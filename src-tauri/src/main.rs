#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod python_env;

use crate::python_env::{delete_venv, ensure_python_async};
use pyo3::prelude::*;
use pythonize::depythonize; // keep if you still use it in other commands
use std::collections::{HashMap, HashSet};
use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Mutex,
};
use serde::Serialize;
use tauri::{AppHandle, State, Builder};
// ---------------- Store ----------------

struct ParseInfoStore {
    counter: AtomicUsize,
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

// ---------------- Commands ----------------

#[tauri::command]
fn get_parse_info(grammar: String, store: State<ParseInfoStore>) -> Result<usize, String> {
    Python::with_gil(|py| {
        let module = py
            .import("paredros_debugger.ParseInformation")
            .map_err(|e| e.to_string())?;
        let cls = module.getattr("ParseInformation").map_err(|e| e.to_string())?;
        let obj = cls.call1((grammar,)).map_err(|e| e.to_string())?;
        let id = store.counter.fetch_add(1, Ordering::SeqCst);
        store.nodes.lock().unwrap().insert(id, obj.into());
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

/// Mirrors `ParseStepInfo`, return type of `get_current_parse_step_info`
#[derive(Debug, FromPyObject, Serialize)]
#[pyo3(from_item_all)]
#[serde(rename_all = "snake_case")]
struct ParseStepInfo {
    step_id: String,
    step_type: String,
    rule_name: Option<String>,
    rule_stack: Vec<String>,
    state: String,
    current_token_repr: String,
    token_index: usize,
    chosen_transition_index: Option<i32>,
    input_text_context: String,
    next_token_stream_index: usize,
    lookahead_repr: Vec<String>,
    matching_error: bool,
    is_error_node: bool,
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

#[tauri::command]
fn initialise_python_frontend_wrapper(app: tauri::AppHandle) -> Result<(), String> {
    ensure_python_async(app);
    Ok(())
}

#[tauri::command]
fn repair_python(app: AppHandle) -> Result<(), String> {
    delete_venv(&app).map_err(|e| e.to_string())
}

// ─────────────────────────────────────────────────────────────────────────────
//  main
// ─────────────────────────────────────────────────────────────────────────────

fn main() {
    Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(ParseInfoStore::default())
        .invoke_handler(tauri::generate_handler![
            initialise_python_frontend_wrapper,
            get_parse_info,
            repair_python,
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