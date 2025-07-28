# Paredros App

## Setup for Deployment
Currently the newest version can be obtained via the [Github build action](https://github.com/HisQu/paredros-app/actions), triggered by any new commits or manually.
Download the artifact for your system and run it.

## Setting up for development and building

### Prerequisites
The following needs to be installed for development:
- `Antlr4 & paredros-debugger` will be installed via the `requirements.txt`
- [Python 3.10](https://www.python.org/downloads/) or above
- [npm](https://nodejs.org/en/download) or [yarn](https://classic.yarnpkg.com/lang/en/) for java-script package management
- [Tauri](https://v1.tauri.app/v1/guides/getting-started/prerequisites) prerequisites for development

### Step by Step

1. Create a virtual environment for Python, which will be used for the ANTLR runtime.
The path should be the same so that it works with the tauri app.
```shell
python -m venv .venv
```
2. Source the created venv and install the `requirements.txt` using 
```shell
source .venv/bin/activate && pip install -r requirements.txt
```

3. Install all requirements for Tauri development, see [Prerequisites](https://tauri.app/start/prerequisites/).

4. Install all node packages:
```shell
yarn # OR
npm i
```

5. Start the tauri installation with the command
```shell
yarn run tauri dev # OR
npm run tauri dev
```

## Hints

### Compatibility issue with Linux and NVIDIA graphics card 
What if you get?
```
** (paredros-app:35128): WARNING **: 13:14:18.714: webkit_settings_set_enable_offline_web_application_cache is deprecated and does nothing.
AcceleratedSurfaceDMABuf was unable to construct a complete framebuffer
...
```
Then set the environment variable `export WEBKIT_DISABLE_DMABUF_RENDERER=1`. Issue is documented [on GitHub](https://github.com/tauri-apps/tauri/issues/9304).

### The display is blank (but the buttons work)

The fix might also be to:
```
# NVIDIA proprietary driver (or when you see “DMABUF” errors)
WEBKIT_DISABLE_DMABUF_RENDERER=1 tauri dev
# ---------------- OR ----------------
# Intel/Mesa or Wayland “compositing” glitches
WEBKIT_DISABLE_COMPOSITING_MODE=1 tauri dev
```

### Python Libraries missing?
```
➜  Local:   http://localhost:1420/
    Running DevCommand (`cargo  run --no-default-features --color always --`)
    Info Watching /home/frand/paredros-app/src-tauri for changes...
   Compiling pyo3-build-config v0.23.5
   Compiling pyo3-macros-backend v0.23.5
   Compiling pyo3-ffi v0.23.5
   Compiling pyo3 v0.23.5
   Compiling pyo3-macros v0.23.5
   Compiling paredros-app v0.1.0 (/home/frand/paredros-app/src-tauri)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 27.68s
     Running `target/debug/paredros-app`
target/debug/paredros-app: error while loading shared libraries: libpython3.10.so.1.0: cannot open shared object file: No such file or directory
error Command failed with exit code 127.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

First fix is to install e.g. `sudo apt install python3.12-dev`, which contains the appropriate libraries. Tauri should find them.

You can also fix this by setting the environment variable `LD_LIBRARY_PATH`. You need to of course use the correct python version.
If you use `pyenv` you can do this for example:
```
export LD_LIBRARY_PATH="$(pyenv root)/versions/3.10.14/lib"
```

## Template (Tauri + React + Typescript)

To reproduce the initialisation of this template, follow these commands:
```shell
cargo create-tauri-app
# answer each prompt:
# Project name > paredros-app
# Identifier > de.uni-jena.mephisto.app
# Frontend > TypeScript / JavaScript
# Package manager > yarn
# UI template > React
# UI flavor > TypeScript
cd paredros-app
npm install
npm run tauri
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)


## For deployment (What does the user need on his machine?)

- Python 3.12 installed (with `python3.12-venv`)
- Java 11 installed (else antlr4 will install Java JRE 11, at the time of writing)