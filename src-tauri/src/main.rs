// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pyo3::prelude::*;
use pyo3::types::PyList;
use serde::Serialize;
use std::{
    collections::{HashMap, HashSet},
    sync::{
        atomic::{AtomicUsize, Ordering},
        Mutex,
    },
};
use tauri::{Manager, State};

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

/// Create a new ParseInformation instance by calling Python's get_parse_info function.
/// Returns an ID (handle) for the created instance.
#[tauri::command]
fn get_parse_info(grammar: String, store: State<ParseInfoStore>) -> Result<usize, String> {
    Python::with_gil(|py| {
        // Extend sys.path so that Python can find your modules.
        let sys = py.import("sys").map_err(|e| e.to_string())?;
        let path_obj = sys.getattr("path").map_err(|e| e.to_string())?;
        let sys_path = path_obj.downcast::<PyList>().map_err(|e| e.to_string())?;
        // Adjust the path as needed so that the paredros_debugger package is found.
        sys_path
            .insert(0, "paredros-debugger")
            .map_err(|e| e.to_string())?;

        // Import the Python module that exposes get_parse_info.
        let module = py.import("get_parse_info").map_err(|e| e.to_string())?;
        // Get the function.
        let func = module
            .getattr("get_parse_info")
            .map_err(|e| e.to_string())?;
        // Call the function with the provided arguments; it returns a ParseInformation instance.
        let py_instance = func.call1((grammar,)).map_err(|e| e.to_string())?;
        let parse_info: Py<PyAny> = py_instance.into();

        // Generate a unique ID and store the ParseInformation instance.
        let id = store.counter.fetch_add(1, Ordering::SeqCst);
        store.nodes.lock().unwrap().insert(id, parse_info);
        Ok(id)
    })
}

#[tauri::command]
fn parse_input(
    id: usize,
    input: String,
    store: State<ParseInfoStore>,
) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;

    Python::with_gil(|py| {
        let func = parse_info.getattr(py, "parse").map_err(|e| e.to_string())?;
        
        func.call1(py, (input,)).map_err(|e| e.to_string())?;

        Ok("Parsed successfully".to_string())
    })
}

/// Retrieve a string representation of the parse tree from the stored ParseInformation instance.
/// (Assumes that your ParseInformation class has a get_parse_tree method.)
#[tauri::command]
fn get_parse_tree(id: usize, store: State<ParseInfoStore>) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;
    Python::with_gil(|py| {
        let res = parse_info
            .getattr(py, "parse_tree")
            .map_err(|e| e.to_string())?;
        res.extract::<String>(py).map_err(|e| e.to_string())
    })
}

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

#[derive(Debug, FromPyObject, Serialize)]
struct UserGrammar {
    #[pyo3(attribute("grammar_files"))]
    grammar_files: HashMap<String, GrammarFile>,
    #[pyo3(attribute("processed_files"))]
    processed_files: HashSet<String>,
}

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

fn main() {
    // Prepare Python for multithreaded use.
    pyo3::prepare_freethreaded_python();

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        // Make our ParseInfoStore available as Tauri state.
        .manage(ParseInfoStore::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_parse_info,
            parse_input,
            get_parse_tree,
            get_user_grammar
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
