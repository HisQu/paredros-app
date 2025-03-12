// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pyo3::prelude::*;
use pyo3::types::PyList;
use std::{
    collections::HashMap,
    sync::{atomic::{AtomicUsize, Ordering}, Mutex},
};
use tauri::State;

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
fn get_parse_info(
    grammar: String,
    input: String,
    store: State<ParseInfoStore>,
) -> Result<usize, String> {
    Python::with_gil(|py| {
        // Extend sys.path so that Python can find your modules.
        let sys = py.import("sys").map_err(|e| e.to_string())?;
        let path_obj = sys.getattr("path").map_err(|e| e.to_string())?;
        let sys_path = path_obj
            .downcast::<PyList>()
            .map_err(|e| e.to_string())?;
        // Adjust the path as needed so that the paredros_debugger package is found.
        sys_path.insert(0, "paredros-debugger")
            .map_err(|e| e.to_string())?;

        // Import the Python module that exposes get_parse_info.
        let module = py.import("get_parse_info").map_err(|e| e.to_string())?;
        // Get the function.
        let func = module.getattr("get_parse_info").map_err(|e| e.to_string())?;
        // Call the function with the provided arguments; it returns a ParseInformation instance.
        let py_instance = func
            .call1((grammar, input))
            .map_err(|e| e.to_string())?;
        let parse_info: Py<PyAny> = py_instance.into();

        // Generate a unique ID and store the ParseInformation instance.
        let id = store.counter.fetch_add(1, Ordering::SeqCst);
        store.nodes.lock().unwrap().insert(id, parse_info);
        Ok(id)
    })
}

/// Retrieve a string representation of the parse tree from the stored ParseInformation instance.
/// (Assumes that your ParseInformation class has a get_parse_tree method.)
#[tauri::command]
fn get_parse_tree(
    id: usize,
    store: State<ParseInfoStore>,
) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;
    Python::with_gil(|py| {
        let res = parse_info
            .getattr(py, "parse_tree")
            .map_err(|e| e.to_string())?;
        res.extract::<String>(py).map_err(|e| e.to_string())
    })
}

struct UserGrammar {
    grammar_files: ...
}

#[tauri::command]
fn get_grammar(
    id: usize,
    store: State<ParseInfoStore>,
) -> Result<String, String> {
    let nodes = store.nodes.lock().unwrap();
    let parse_info = nodes.get(&id).ok_or("Invalid parse info id")?;
    Python::with_gil(|py| {
        let res = parse_info
            .getattr(py, "grammar")
            .map_err(|e| e.to_string())?;
        res.extract::<UserGrammar>(py).map_err(|e| e.to_string())
    })
}

fn main() {
    // Prepare Python for multithreaded use.
    pyo3::prepare_freethreaded_python();

    tauri::Builder::default()
        // Make our ParseInfoStore available as Tauri state.
        .manage(ParseInfoStore::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_parse_info,
            get_parse_tree
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
