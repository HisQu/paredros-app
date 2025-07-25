// ==============================
// src-tauri/src/python_env.rs
// ==============================

use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{anyhow, Context, Result};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tauri::{path::BaseDirectory, AppHandle, Emitter, Manager};

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

/// Synchronous bootstrap. Safe to call multiple times.
pub fn ensure_python_sync(app: &AppHandle) -> Result<()> {
    let _ = app.emit("py/setup-progress", PySetupProgress::Checking);

    let venv_dir = bootstrap_python_env(app)?;
    configure_env_for_venv(&venv_dir)?;

    // Initialise PyO3/Python (idempotent).
    pyo3::prepare_freethreaded_python();

    let _ = app.emit("py/setup-progress", PySetupProgress::Done);
    Ok(())
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
    // Put venv under per-user app config dir
    let venv_dir = app
        .path()
        .resolve("pyenv", BaseDirectory::AppConfig)
        .context("cannot resolve app config dir")?;
    fs::create_dir_all(&venv_dir)?;

    // requirements.txt lives in project root (../.. from src-tauri/src)
    let req_bytes: &[u8] = include_bytes!("../../requirements.txt");
    let req_path = venv_dir.join("requirements.txt");
    fs::write(&req_path, req_bytes)?;

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

    let base_python = find_base_python(app)?;
    let py_version = get_python_version(&base_python)?;

    let desired = VenvState {
        python_version: py_version.clone(),
        req_hash: req_hash.clone(),
    };

    let venv_python = venv_python_path(&venv_dir);

    if !venv_python.exists() || current != desired {
        let _ = app.emit("py/setup-progress", PySetupProgress::CreatingVenv);
        create_venv(&base_python, &venv_dir)?;

        let _ = app.emit(
            "py/setup-progress",
            PySetupProgress::InstallingPackages,
        );
        pip_install_requirements(&venv_python, &req_path, app)?;

        fs::write(&state_path, serde_json::to_vec(&desired)?)?;
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
    let bin = if cfg!(windows) { "python.exe" } else { "bin/python" };
    let path = root.join(plat).join(bin);
    path.exists().then_some(path)
}

fn create_venv(base_python: &Path, venv_dir: &Path) -> Result<()> {
    let status = Command::new(base_python)
        .args(["-m", "venv", "--upgrade-deps"]) // Python >= 3.10
        .arg(venv_dir)
        .status()
        .context("failed to spawn python -m venv")?;
    if !status.success() {
        return Err(anyhow!("venv creation failed"));
    }
    Ok(())
}

fn pip_install_requirements(venv_python: &Path, req_path: &Path, app: &AppHandle) -> Result<()> {
    // Online install; if you ship wheels, switch to --no-index/--find-links
    let status = Command::new(venv_python)
        .args([
            "-m",
            "pip",
            "install",
            "--disable-pip-version-check",
            "-r",
            req_path.to_str().unwrap(),
        ])
        .status()
        .context("pip install failed to spawn")?;
    if !status.success() {
        return Err(anyhow!("pip install -r requirements.txt failed"));
    }

    // Optional: install your local project
    pip_install_local_project(venv_python, app)?;
    Ok(())
}

fn pip_install_local_project(venv_python: &Path, app: &AppHandle) -> Result<()> {
    // Adjust to where your python package actually lives. This tries resources first,
    // then falls back to the repo root for dev.
    let project_path = app
        .path()
        .resolve("python_src/paredros_debugger", BaseDirectory::Resource)
        .unwrap_or_else(|_| PathBuf::from("../paredros_debugger"));

    if !project_path.exists() {
        return Ok(()); // nothing to install
    }

    let status = Command::new(venv_python)
        .args(["-m", "pip", "install", "-e"])
        .arg(project_path)
        .status()
        .context("pip install -e <local project> failed to spawn")?;
    if !status.success() {
        return Err(anyhow!("pip install -e <local project> failed"));
    }
    Ok(())
}

fn get_python_version(py: &Path) -> Result<String> {
    let out = Command::new(py)
        .args(["-c", "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"])
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
        (venv_dir.join("Lib"), venv_dir.join("Lib").join("site-packages"))
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
    let new_val = if let Ok(old) = std::env::var(var) {
        format!("{}:{}", path.display(), old)
    } else {
        path.display().to_string()
    };
    std::env::set_var(var, new_val);
}
