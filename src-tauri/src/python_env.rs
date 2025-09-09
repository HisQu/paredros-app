// ==============================
// src-tauri/src/python_env.rs
// ==============================

use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
    io::Write
};

use anyhow::{anyhow, Context, Result};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tauri::{path::BaseDirectory, AppHandle, Emitter, Manager};
use tauri_plugin_dialog::{
    DialogExt, // trait that adds .dialog() to App / AppHandle
    MessageDialogButtons,
    MessageDialogKind,
};

#[derive(Debug, Serialize, Clone)]
pub enum PySetupProgress {
    Checking,
    CreatingVenv,
    InstallingPackages,
    Done,
    Error(String),
}

#[derive(Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
struct VenvState {
    python_version: String,
    req_hash: String,
}

/// Read the desired Python *major.minor* from the checked‑in `.python-version`
/// (e.g. "3.11.4" → "3.11").  Compile‑time include keeps the binary
/// self‑contained just like `requirements.txt`.
fn desired_py_version() -> String {
    let full = include_str!("../../.python-version").trim();
    let mut parts = full.split('.');
    match (parts.next(), parts.next()) {
        (Some(major), Some(minor)) => format!("{}.{}", major, minor),
        _ => full.to_string(), // fallback if the file is just "3.11"
    }
}

fn show_error_dialog(app: &AppHandle, title: &str, message: &str) {
    let handle = app.clone();
    let msg = message.to_string();
    let title = title.to_string();

    std::thread::spawn(move || {
        handle
            .dialog()
            .message(msg)
            .title(title)
            .kind(MessageDialogKind::Error)
            .buttons(MessageDialogButtons::Ok)
            .blocking_show();
    });

    let _ = app.emit(
        "py/setup-progress",
        PySetupProgress::Error(message.to_string()),
    );
}

pub fn ensure_python_async(app: AppHandle) {
    tauri::async_runtime::spawn_blocking(move || {
        if let Err(e) = ensure_python_sync(&app) {
            let _ = app.emit("py/setup-progress", PySetupProgress::Error(e.to_string()));
        }
    });
}

/// Synchronous bootstrap. Safe to call multiple times.
pub fn ensure_python_sync(app: &AppHandle) -> Result<()> {
    let _ = app.emit("py/setup-progress", PySetupProgress::Checking);

    match bootstrap_python_env(app) {
        Ok(venv_dir) => {
            configure_env_for_venv(&venv_dir)?;
            pyo3::prepare_freethreaded_python();
            let _ = app.emit("py/setup-progress", PySetupProgress::Done);
            Ok(())
        }

        // ---------- v2 dialog on error ----------
        Err(e) => {
            let handle = app.clone();
            let desired_python_version = desired_py_version();

            // `blocking_show` must not run on the main thread, so spawn one:
            std::thread::spawn(move || {
                handle
                    .dialog()
                    .message(
                        format!("No Python interpreter was found on your system.\n\
                         Please install Python {desired_python_version} or later and restart the application."),
                    )
                    .title("Python not detected")
                    .kind(MessageDialogKind::Error)
                    .buttons(MessageDialogButtons::Ok)
                    .blocking_show();
            });

            let _ = app.emit("py/setup-progress", PySetupProgress::Error(e.to_string()));
            Err(e)
        }
    }
}

/// Delete the venv so it gets rebuilt next run.
pub fn delete_venv(app: &AppHandle) -> Result<()> {
    let venv_dir = app
        .path()
        .resolve("pyenv", BaseDirectory::AppConfig)
        .context("cannot resolve app config dir")?;
    if venv_dir.exists() {
        fs::remove_dir_all(&venv_dir)?;
    }
    Ok(())
}

// ---------------- internal helpers ----------------

fn bootstrap_python_env(app: &AppHandle) -> Result<PathBuf> {
    let emit_progress = |progress| {
        let _ = app.emit("py/setup-progress", progress);
    };

    emit_progress(PySetupProgress::Checking);

    let venv_dir = app
        .path()
        .resolve("pyenv", BaseDirectory::AppConfig)
        .context("cannot resolve app config dir")?;

    println!("Using venv dir: {}", venv_dir.display());

    fs::create_dir_all(&venv_dir)
        .with_context(|| format!("failed to create venv directory at {}", venv_dir.display()))?;

    let req_bytes: &[u8] = include_bytes!("../../requirements.txt");
    let req_path = venv_dir.join("requirements.txt");
    fs::write(&req_path, req_bytes).context("failed to write requirements.txt")?;

    let req_hash = {
        let mut h = Sha256::new();
        h.update(req_bytes);
        format!("{:x}", h.finalize())
    };

    let state_path = venv_dir.join(".venv_state.json");
    let current: VenvState = fs::read(&state_path)
        .ok()
        .and_then(|b| serde_json::from_slice(&b).ok())
        .unwrap_or_default();

    let base_python = find_base_python(app).map_err(|e| {
        show_error_dialog(app, "Python Interpreter Not Found", &e.to_string());
        e
    })?;

    let py_version = get_python_version(&base_python).map_err(|e| {
        show_error_dialog(app, "Failed to Get Python Version", &e.to_string());
        e
    })?;

    let desired = VenvState {
        python_version: py_version.clone(),
        req_hash: req_hash.clone(),
    };

    let venv_python = venv_python_path(&venv_dir);

    if !venv_python.exists() || current != desired {
        emit_progress(PySetupProgress::CreatingVenv);

        create_venv(&base_python, &venv_dir).map_err(|e| {
            show_error_dialog(app, "Virtual Environment Creation Failed", &e.to_string());
            e
        })?;

        emit_progress(PySetupProgress::InstallingPackages);

        let git = ensure_git_on_path(app);
        if git.is_err() {
            show_error_dialog(app, "Git Not Found", "Please install Git to continue.");
            return Err(git.unwrap_err());
        }

        // DEBUG
        println!("Path variable looks like this: {}", std::env::var("PATH").unwrap_or_default());

        pip_install_requirements(&venv_python, &req_path).map_err(|e| {
            show_error_dialog(app, "Dependency Installation Failed", &e.to_string());
            e
        })?;

        run_antlr4(app, &venv_dir).map_err(|e| {
            show_error_dialog(app, "ANTLR Setup failed", &e.to_string());
            e
        })?;


        fs::write(&state_path, serde_json::to_vec(&desired)?)
            .context("failed to persist venv state")?;
    }

    Ok(venv_dir)
}

fn find_base_python(app: &AppHandle) -> Result<PathBuf> {
    if let Some(p) = find_embedded_python(app) {
        return Ok(p);
    }
    which::which("python3")
        .or_else(|_| which::which("python"))
        .map_err(|_| anyhow!("No Python interpreter found (embedded/system)."))
}

fn find_embedded_python(app: &AppHandle) -> Option<PathBuf> {
    let root = app.path().resolve("py", BaseDirectory::Resource).ok()?;
    let plat = if cfg!(all(target_os = "windows", target_arch = "x86_64")) {
        "windows"
    } else if cfg!(all(target_os = "macos", target_arch = "aarch64")) {
        "macos"
    } else if cfg!(all(target_os = "linux", target_arch = "x86_64")) {
        "linux"
    } else {
        return None;
    };
    let bin = if cfg!(windows) {
        "python.exe"
    } else {
        "bin/python"
    };
    let path = root.join(plat).join(bin);
    path.exists().then_some(path)
}

fn create_venv(base_python: &Path, venv_dir: &Path) -> Result<()> {
    // Spawn the command and CAPTURE its output instead of just waiting for the status.

    let output = Command::new(base_python)
        .args(["-m", "venv", "--upgrade-deps"])
        .arg(venv_dir)
        .output()
        .context("failed to spawn python -m venv")?;

    if !output.status.success() {
        // Turn the raw bytes into UTF‑8 strings (lossy is fine for diagnostics)
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);

        // Compose a rich error message; skip empty streams.
        let mut msg = String::from("venv creation failed");
        if !stderr.trim().is_empty() {
            msg.push_str(" (stderr):\n");
            msg.push_str(stderr.trim());
        }
        if !stdout.trim().is_empty() {
            msg.push_str("\n(stdout):\n");
            msg.push_str(stdout.trim());
        }

        return Err(anyhow!(msg));
    }
    Ok(())
}

fn pip_install_requirements(venv_python: &Path, req_path: &Path) -> Result<()> {
    // Online install
    let output = Command::new(venv_python)
        .args([
            "-m",
            "pip",
            "install",
            "--disable-pip-version-check",
            "-r",
            req_path.to_str().unwrap(),
        ])
        .output()
        .context("pip install failed to spawn")?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        let msg = format!(
            "pip install -r requirements.txt failed:\n{}\n{}",
            stderr.trim(),
            stdout.trim()
        );
        return Err(anyhow!(msg));
    }
    Ok(())
}

fn get_python_version(py: &Path) -> Result<String> {
    let out = Command::new(py)
        .args([
            "-c",
            "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')",
        ])
        .output()
        .context("could not run python to get version")?;
    Ok(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

fn venv_python_path(venv_dir: &Path) -> PathBuf {
    if cfg!(windows) {
        venv_dir.join("Scripts").join("python.exe")
    } else {
        venv_dir.join("bin").join("python")
    }
}

fn configure_env_for_venv(venv_dir: &Path) -> Result<PathBuf> {
    // Work out site-packages
    let (lib_dir, site_packages) = if cfg!(windows) {
        (
            venv_dir.join("Lib"),
            venv_dir.join("Lib").join("site-packages"),
        )
    } else {
        let lib_root = venv_dir.join("lib");
        let py_dir = std::fs::read_dir(&lib_root)?
            .flatten()
            .find(|e| e.file_name().to_string_lossy().starts_with("python3."))
            .map(|e| e.path())
            .ok_or_else(|| anyhow!("could not find pythonX.Y in venv/lib"))?;
        let site = py_dir.join("site-packages");
        (py_dir, site)
    };

    // Tell the rest of the app which venv we’re using (harmless).
    std::env::set_var("VIRTUAL_ENV", venv_dir);

    // **Do NOT set PYTHONHOME** when embedding with pyo3 – it breaks initialization.
    std::env::remove_var("PYTHONHOME");

    // Prepend site-packages (and the stdlib dir for good measure) to PYTHONPATH.
    let sep = if cfg!(windows) { ";" } else { ":" };
    let mut py_path = format!("{}{}{}", lib_dir.display(), sep, site_packages.display());
    if let Ok(existing) = std::env::var("PYTHONPATH") {
        if !existing.is_empty() {
            py_path = format!("{}{}{}", py_path, sep, existing);
        }
    }
    std::env::set_var("PYTHONPATH", py_path);

    // Make sure the venv’s executables are first on PATH (helps if you ever spawn `python` again)
    let bin_dir = if cfg!(windows) {
        venv_dir.join("Scripts")
    } else {
        venv_dir.join("bin")
    };
    prepend_env_path("PATH", &bin_dir);

    // Shared libs search paths (same as you had)
    #[cfg(target_os = "linux")]
    prepend_env_path("LD_LIBRARY_PATH", venv_dir);
    #[cfg(target_os = "macos")]
    prepend_env_path("DYLD_LIBRARY_PATH", venv_dir);

    Ok(site_packages)
}

fn prepend_env_path(var: &str, path: &Path) {
    let mut paths: Vec<_> = std::env::var_os(var)
        .map(|p| std::env::split_paths(&p).collect())
        .unwrap_or_else(Vec::new);

    // Put our path at the front
    paths.insert(0, path.to_path_buf());

    let new_val = std::env::join_paths(paths)
        .expect("Failed to join PATH components");
    std::env::set_var(var, &new_val);
}

fn ensure_git_on_path(app: &AppHandle) -> anyhow::Result<bool> {
    match which::which("git") {
        Ok(git) => {
            let dir = git.parent()
                .ok_or_else(|| anyhow::anyhow!("git path has no parent"))?;
            prepend_env_path("PATH", dir);

            // DEBUG
            println!("Found git at: {}", git.display());

            Ok(true)
        }
        Err(e) => {
            let _ = app.emit(
                "py/setup-progress",
                PySetupProgress::Error(e.to_string()),
            );
            Ok(false)
        }
    }
}

fn antlr4_path(venv_dir: &Path) -> Option<PathBuf> {
    #[cfg(windows)]
    {
        // pip may create either .bat or .cmd – look for both
        for ext in ["bat", "cmd"] {
            let p = venv_dir.join("Scripts").join(format!("antlr4.{ext}"));
            if p.exists() { return Some(p) }
        }
    }
    #[cfg(not(windows))]
    {
        let p = venv_dir.join("bin").join("antlr4");
        if p.exists() { return Some(p) }
    }
    None
}

fn run_antlr4(app: &AppHandle, venv_dir: &Path) -> Result<()> {
    let antlr = antlr4_path(venv_dir)
        .ok_or_else(|| {
            let _ = app.emit(
                "py/setup-progress",
                PySetupProgress::Error("antlr4 launcher not found in the virtual-env".to_string()),
            );
            anyhow!("antlr4 launcher not found in the virtual-env")
        })?;

    // If Java isn't installed, this will trigger the antlr4-tools prompt
    let mut cmd = Command::new(&antlr);
    cmd.stdin(std::process::Stdio::piped());
    cmd.stdout(std::process::Stdio::inherit());
    cmd.stderr(std::process::Stdio::inherit());

    let mut child = cmd.spawn().context("failed to spawn antlr4")?;
    if let Some(mut stdin) = child.stdin.take() {
        writeln!(stdin, "yes")?;
    }
    let output = child.wait_with_output().context("failed to wait on antlr4")?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);

        let msg = format!(
            "antlr4 failed with exit code {:?}:\n--- stderr ---\n{}\n--- stdout ---\n{}",
            output.status.code(),
            stderr.trim(),
            stdout.trim()
        );

        let _ = app.emit(
            "py/setup-progress",
            PySetupProgress::Error(msg.clone()),
        );

        return Err(anyhow!(msg));
    }
    Ok(())
}
