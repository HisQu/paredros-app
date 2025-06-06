// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pyo3::prelude::*;
use pyo3::types::PyList;
use serde::Serialize;
use std::{collections::{HashMap, HashSet}, env, sync::{
    atomic::{AtomicUsize, Ordering},
    Mutex,
}};
use std::path::PathBuf;
use std::sync::OnceLock;
use tauri::{AppHandle, Manager, State, path::BaseDirectory};
use pythonize::depythonize;

/// because of a bug on certain platforms, where the screen is blank.
std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");

/// A store for Python ParseInformation instances.
struct ParseInfoStore {
    /// A counter used to generate unique IDs.
    counter: AtomicUsize,
    /// A mapping from unique IDs to Python objects.
    nodes: Mutex<HashMap<usize, Py<PyAny>>>,
}

impl Default for ParseInfoStore {
    fn default() -> Self {
        Self {
            counter: AtomicUsize::new(1),
            nodes: Mutex::new(HashMap::new()),
        }
    }
}

/// A simple example command.
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Create a new ParseInformation instance by calling the get_parse_info function from a helper file.
/// Returns an ID (handle) for the created instance.
#[tauri::command]
fn get_parse_info(grammar: String, store: State<ParseInfoStore>) -> Result<usize, String> {
    Python::with_gil(|py| {
        // Extend sys.path so that Python can find your modules.
        let sys = py.import("sys").map_err(|e| e.to_string())?;
        let path_obj = sys.getattr("path").map_err(|e| e.to_string())?;
        let sys_path = path_obj.downcast::<PyList>().map_err(|e| e.to_string())?;
        // use the local repository, going from the cwd, if it exists
        sys_path
            .insert(0, "paredros_debugger")
            .map_err(|e| e.to_string())?;
        let module = py
            .import("paredros_debugger.ParseInformation")
            .map_err(|e| e.to_string())?;
        let parse_information_cls = module
            .getattr("ParseInformation")
            .map_err(|e| e.to_string())?;
        // Call the function with the provided arguments; it returns a ParseInformation instance.
        let py_instance = parse_information_cls
            .call1((grammar,))
            .map_err(|e| e.to_string())?;
        let parse_info: Py<PyAny> = py_instance.into();

        // Generate a unique ID and store the ParseInformation instance.
        let id = store.counter.fetch_add(1, Ordering::SeqCst);
        store.nodes.lock().unwrap().insert(id, parse_info);
        Ok(id)
    })
}


/// Call the generate_parser method on a stored ParseInformation instance
#[tauri::command]
fn generate_parser(
    id: usize,
    store: State<ParseInfoStore>,
) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let func = parse_info.getattr(py, "generate_parser").map_err(|e| e.to_string())?;
        
        func.call0(py).map_err(|e| e.to_string())?;

        Ok("Generated parser successfully".to_string())
    })
}

/// Call the parse_input method on a stored ParseInformation instance
#[tauri::command]
fn parse_input(
    id: usize,
    input: String,
    store: State<ParseInfoStore>,
) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        // parse the input
        let func = parse_info.getattr(py, "parse").map_err(|e| e.to_string())?;
        func.call1(py, (input,)).map_err(|e| e.to_string())?;

        // go to step 0 in the parse process
        let func2 = parse_info.getattr(py, "go_to_step").map_err(|e| e.to_string())?;
        func2.call1(py, (0,)).map_err(|e| e.to_string())?;

        Ok("Parsed successfully".to_string())
    })
}

/// Jump to a specific step
#[tauri::command]
fn go_to_step(
    id: usize,
    step_id: usize,
    store: State<ParseInfoStore>,
) -> Result<String, String> {
        let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let func = parse_info.getattr(py, "go_to_step").map_err(|e| e.to_string())?;
        
        func.call1(py, (step_id,)).map_err(|e| e.to_string())?;

        Ok("Went to indicated step successfully".to_string())
    })
}

/// This class mirrors the Python class
#[derive(Debug, FromPyObject, Serialize)]
struct ParseTreeNode {
    #[pyo3(attribute("id"))]
    id: String,
    #[pyo3(attribute("nodeType"))]
    node_type: String,
    #[pyo3(attribute("children"))]
    children: Vec<ParseTreeNode>, 
}


/// This class mirrors the Python class
#[derive(Debug, FromPyObject, Serialize)]
struct GrammarRule {
    #[pyo3(attribute)]
    name: String,
    #[pyo3(attribute)]
    content: String,
    #[pyo3(attribute("start_line"))]
    start_line: i32,
    #[pyo3(attribute("end_line"))]
    end_line: i32,
    #[pyo3(attribute("start_pos"))]
    start_pos: i32,
    #[pyo3(attribute("end_pos"))]
    end_pos: i32,
}

/// This class mirrors the Python class
#[derive(Debug, FromPyObject, Serialize)]
struct GrammarFile {
    #[pyo3(attribute)]
    path: String,
    #[pyo3(attribute)]
    directory: String,
    #[pyo3(attribute)]
    rules: HashMap<String, GrammarRule>,
    #[pyo3(attribute)]
    imports: Vec<String>,
    #[pyo3(attribute)]
    content: String,
}

/// This class mirrors the Python class
#[derive(Debug, FromPyObject, Serialize)]
struct UserGrammar {
    #[pyo3(attribute("grammar_files"))]
    grammar_files: HashMap<String, GrammarFile>,
    #[pyo3(attribute("processed_files"))]
    processed_files: HashSet<String>,
}

/// Mirrors the `possible_transitions` entries
#[derive(Debug, FromPyObject, Serialize)]
#[pyo3(from_item_all)]
struct Transition {
    target_state: usize,
    matches: Vec<String>,
}

/// Mirrors the `grammar_rule_location` sub-dict
#[derive(Debug, FromPyObject, Serialize)]
#[pyo3(from_item_all)]
struct GrammarRuleLocation {
    name: String,
    content: String,
    file_path: String,
    start_line: usize,
    end_line: usize,
    start_pos: usize,
    end_pos: usize,
}

/// Mirrors the ParseStepInfo return type of `get_current_parse_step_info`
#[derive(Debug, FromPyObject, Serialize)]
#[pyo3(from_item_all)]
struct ParseStepInfo {
    step_id: String,
    node_type: String,
    rule_name: Option<String>,
    rule_stack: Vec<String>,
    state: String,
    current_token_repr: String,
    token_index: usize,
    chosen_transition_index: Option<i32>,
    input_text_context: String,
    lookahead_repr: String,
    matching_error: bool,
    is_error_node: bool,
    next_input_token: Option<String>,
    next_input_literal: Option<String>,
    possible_transitions: Option<Vec<Transition>>,
    grammar_rule_location: Option<GrammarRuleLocation>,
    input_context_snippet: Option<String>,
}

/// Gets the property "grammar" from a ParseInformation instance
#[tauri::command]
fn get_user_grammar(id: usize, store: State<ParseInfoStore>) -> Result<UserGrammar, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let py_grammar = parse_info
            .getattr(py, "grammar")
            .map_err(|e| e.to_string())?;

        py_grammar.extract(py).map_err(|e| e.to_string())
    })
}

/// Gets the meta information dictionary with 
#[tauri::command]
fn get_parse_step_info(id: usize, store: State<ParseInfoStore>) -> Result<ParseStepInfo, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let py_step = parse_info
            .getattr(py, "get_current_parse_step_info")
            .map_err(|e| e.to_string())?
            .call0(py)
            .map_err(|e| e.to_string())?;
        py_step.extract(py).map_err(|e| e.to_string())
    })
}

/// Gets a JSON representation of the current (meaning partial) ParseTree from a ParseInformation instance
#[tauri::command]
fn get_json_parse_tree(id: usize, store: State<ParseInfoStore>) -> Result<serde_json::Value, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let dict_obj = parse_info
            .getattr(py, "get_current_tree_dict")
            .map_err(|e| e.to_string())?
            .call0(py)
            .map_err(|e| e.to_string())?;

        let dict_bound = dict_obj.bind(py);
        depythonize::<serde_json::Value>(&dict_bound)
            .map_err(|e| e.to_string())
    })
}

/// Manipulates the current step in the ParseInformation instance's ParseTreeExplorer instance
#[tauri::command]
fn step_forwards(id: usize, step: usize, store: State<ParseInfoStore>) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let func = parse_info.getattr(py, "step_forward").map_err(|e| e.to_string())?;
        
        func.call1(py, (step,)).map_err(|e| e.to_string())?;

        Ok("Stepped successfully".to_string())
    })
}

#[tauri::command]
fn step_backwards(id: usize, store: State<ParseInfoStore>) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let func = parse_info.getattr(py, "step_backwards").map_err(|e| e.to_string())?;
        
        func.call0(py).map_err(|e| e.to_string())?;

        Ok("Stepped successfully".to_string())
    })
}

// Initialise Python exactly once. Prefer the embedded copy if it exists.
// Call this with `&app.handle()`.
pub fn ensure_python(handle: &AppHandle) -> Result<(), String> {
    // `Result<(), String>` is `Clone`, so we can hand out a copy later.
    static INIT: OnceLock<Result<(), String>> = OnceLock::new();

    INIT
        .get_or_init(|| {
            // ── 1. embedded runtime? ───────────────────────────────
            let embedded_ok = handle
                .path()
                .resolve("py", BaseDirectory::Resource)   // resources/py
                .ok()
                .and_then(|py_root| {
                    if py_root.exists() {
                        let plat_dir = current_platform_dir(&py_root)?;
                        configure_env_for_embedded(&plat_dir);
                        Some(())
                    } else {
                        None
                    }
                })
                .is_some();

            if !embedded_ok {
                eprintln!("⚠️  Embedded Python not found – falling back to system interpreter");
            }

            // ── 2. start interpreter ───────────────────────────────
            pyo3::prepare_freethreaded_python();

            Ok(())               // <- whatever error you want to propagate
        })
        .clone()                 // hand the stored result to the caller
}

// ---------- helpers ----------------------------------------------------

fn current_platform_dir(py_root: &PathBuf) -> Option<PathBuf> {
    let dir = if cfg!(all(target_os = "windows", target_arch = "x86_64")) {
        "windows"
    } else if cfg!(all(target_os = "macos", target_arch = "aarch64")) {
        "macos"
    } else if cfg!(all(target_os = "linux", target_arch = "x86_64")) {
        "linux"
    } else {
        return None;
    };
    Some(py_root.join(dir))
}

fn configure_env_for_embedded(dir: &PathBuf) {
    let stdlib = dir.join("Lib");

    env::set_var("PYTHONHOME", dir);
    env::set_var(
        "PYTHONPATH",
        format!(
            "{}{}{}",
            stdlib.display(),
            if cfg!(windows) { ";" } else { ":" },
            stdlib.join("site-packages").display()
        ),
    );

    if cfg!(target_os = "linux") {
        env::set_var("LD_LIBRARY_PATH", dir);
    } else if cfg!(target_os = "macos") {
        env::set_var("DYLD_LIBRARY_PATH", dir);
    }
}

fn main() {

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            ensure_python(&handle)?;          // initialise once
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        // Make our ParseInfoStore available as Tauri state.
        .manage(ParseInfoStore::default())
        // expose these commands to typescript
        .invoke_handler(tauri::generate_handler![
            greet,
            get_parse_info,
            generate_parser,
            parse_input,
            go_to_step,
            get_user_grammar,
            get_parse_step_info,
            step_forwards,
            step_backwards,
            get_json_parse_tree
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
