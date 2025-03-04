// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pyo3::prelude::*;
use pyo3::types::PyList;
use std::{
    collections::HashMap,
    sync::{atomic::{AtomicUsize, Ordering}, Mutex},
};
use tauri::State;

/// A store for Python ParseStep instances.
struct ParseStepStore {
    /// A counter used to generate unique IDs.
    counter: AtomicUsize,
    /// A mapping from unique IDs to Python objects.
    nodes: Mutex<HashMap<usize, Py<PyAny>>>,
}

// Implement Default so we can initialize it easily.
impl Default for ParseStepStore {
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

/// Create a new ParseStep by calling Python's get_parse_steps function.
/// Returns an ID (handle) to the created ParseStep instance.
#[tauri::command]
fn get_parse_steps(
    grammar: String,
    input: String,
    store: State<ParseStepStore>,
) -> Result<usize, String> {
    Python::with_gil(|py| {
        // Extend sys.path so that Python can find your modules.
        let sys = py.import("sys").map_err(|e| e.to_string())?;
        let path_obj = sys.getattr("path").map_err(|e| e.to_string())?;
        let sys_path = path_obj
            .downcast::<PyList>()
            .map_err(|e| e.to_string())?;
        sys_path.insert(0, "paredros-debugger")
            .map_err(|e| e.to_string())?;

        // Import the Python module (e.g. paredros-debugger/main.py becomes module "main").
        let module = py.import("main").map_err(|e| e.to_string())?;
        // Get the Python function.
        let func = module.getattr("get_parse_steps").map_err(|e| e.to_string())?;
        // Call the function with the provided arguments; it returns an instance of ParseStep.
        let py_instance = func
            .call1((grammar, input))
            .map_err(|e| e.to_string())?;
        // Convert to an owned Py<PyAny> to store it safely.
        let parse_node: Py<PyAny> = py_instance.into();

        // Generate a unique ID and store the ParseStep instance.
        let id = store.counter.fetch_add(1, Ordering::SeqCst);
        store.nodes.lock().unwrap().insert(id, parse_node);
        Ok(id)
    })
}

/// Call the Python method get_some_variable on the ParseStep instance identified by `id`.
#[tauri::command]
fn parse_node_get_some_variable(
    id: usize,
    store: State<ParseStepStore>,
) -> Result<String, String> {
    // Get a reference to the Python object.
    let nodes = store.nodes.lock().unwrap();
    let node = nodes.get(&id).ok_or("Invalid parse node id")?;
    Python::with_gil(|py| {
        let res = node
            .call_method0(py, "get_some_variable")
            .map_err(|e| e.to_string())?;
        res.extract::<String>(py)
            .map_err(|e| e.to_string())
    })
}

/// Call the Python method set_some_variable on the ParseStep instance identified by `id`.
/// The value is passed as a string.
#[tauri::command]
fn parse_node_set_some_variable(
    id: usize,
    value: String,
    store: State<ParseStepStore>,
) -> Result<(), String> {
    let nodes = store.nodes.lock().unwrap();
    let node = nodes.get(&id).ok_or("Invalid parse node id")?;
    Python::with_gil(|py| {
        node.call_method1(py, "set_some_variable", (value,))
        .map(|_| ())
        .map_err(|e| e.to_string())
    })
}

/// (Optional) Expose other methods, e.g. method1.
#[tauri::command]
fn parse_node_method1(id: usize, store: State<ParseStepStore>) -> Result<(), String> {
    let nodes = store.nodes.lock().unwrap();
    let node = nodes.get(&id).ok_or("Invalid parse node id")?;
    Python::with_gil(|py| {
        node.call_method0(py, "method1")
            .map(|_| ())
            .map_err(|e| e.to_string())
    })
}

fn main() {
    // Prepare Python for multithreaded use.
    pyo3::prepare_freethreaded_python();

    tauri::Builder::default()
        // Make our ParseStepStore available as Tauri state.
        .manage(ParseStepStore::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_parse_steps,
            parse_node_get_some_variable,
            parse_node_set_some_variable,
            parse_node_method1
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
