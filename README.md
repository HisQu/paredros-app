# Paredros App

## Table of cotent
- [Hint: Setup for Deployment](#setup-for-deployment)
- [About Paredros App](#about-paredros-app)
- [Usage](#usage)
- [Installing Instructions](#installing-instructions)
    - [Quickstart instrutions](#quickstart)
    - [Step by Step Instructions](#setting-up-step-by-step)
- [Additional Hints](#additional-hints)
    - [Compatibility issue with NVIDIA graphics card](#compatibility-issue-with-nvidia-graphics-card)
    - [The display is blank](the-display-is-blank-but-the-buttons-work)
    - [Python Libraries missing?](#python-libraries-missing)
    - [Template (Tauri + React + Typescript)](#template-tauri--react--typescript)
    - [Recommended IDE Setup](#recommended-ide-setup)

## Setup for Deployment
This repository is a component of the research data infrastructure "Historische Quellen" (abbreviated as 'HisQu'). It serves as a collaborative initiative aimed at fostering the systematic organization, analysis, and accessibility of historical sources. For more detailed information about the goals, scope, and participating institutions, please visit the official [website](https://hisqu.de/).

Currently the newest version can be obtained via the [Github build action](https://github.com/HisQu/paredros-app/actions), triggered by any new commits or manually.
Download the artifact for your system and run it.

## About Paredros App
The **Paredros App** is an interactive Ontology tool with a visualization environment designed for working with grammars defined in [**ANTLR4**](https://www.antlr.org/). Its primary purpose is to support researchers and developers engaged in the structural analysis of complex textual corpora, such as historical sources, charters, and regesta. By providing a seamless integration of parsing, error analysis, and graphical exploration of syntactic structures, the application enables precise inspection and iterative refinement of grammar definitions. The tool combines a modern **React/TypeScript frontend** with a high-performance **Rust/Python backend** (via Tauri and PyO3), thereby offering both usability and computational efficiency in real-time parsing workflows.

Functionally, the system allows users to import custom grammar specifications (e.g., `.g4` files) alongside input texts, execute parsing routines, and visualize results as parse trees, token flows, and intermediate structures. Errors in the parsing process are directly surfaced within the workflow, enabling immediate grammar adjustments and iterative debugging. Typical usage involves preparing a project environment (installation of Python, Node.js, build tools, and dependencies), loading grammar-input pairs, initiating parsing, and using the interactive visualization layer to detect anomalies or unexpected parser behavior. Adjusted grammars can be reloaded and tested repeatedly, with results optionally exported for documentation. Through this design, the Paredros App bridges advanced parsing technology with practical usability, making it a valuable instrument for both computational linguistics research and applied software development.


## Usage
To initiate the parsing workflow, the user first selects a suitable [**ANTLR**](https://www.antlr.org/) grammar file (e.g., Regest.g4) that encodes the syntactic and lexical rules for the input domain. Alongside the grammar specification, an input file (e.g., input.txt) containing the text to be analyzed must be loaded. Once both resources are provided, the system invokes the ANTLR4 runtime via Python, generating a parse tree and token sequence based on the defined grammar. This allows for an immediate inspection of how the rules apply to real data, ensuring that the parsing logic aligns with the structural properties of the chosen text corpus.

The app subsequently provides interactive visualization and debugging mechanisms. The parse tree is rendered graphically, enabling stepwise exploration of syntactic nodes, while the token flow representation exposes the segmentation process at the lexical level. Errors, such as incomplete matches or unhandled inputs, are reported in real time and annotated within the interface, offering actionable feedback for grammar refinement. Through the integration of interactive components—such as ParseTreeNodeComponent and FlowPlot—users can examine rule applications, inspect node-level metadata, and explore alternative parsing paths. By iteratively editing the grammar in the embedded editor, reloading files, and re-executing the parsing pipeline, users establish a closed feedback loop that supports incremental grammar optimization and documentation of results (including exports and screenshots for scholarly or development purposes).

## Installing Instructions
At first of all make sure your have already installed all prerequisites. Then you can decide if you want to use the Quickstart, or by following the Step-By-Step Instruction.

### Prerequisites
The following needs to be installed for development:
- `Antlr4 & paredros-debugger` will be installed via the `requirements.txt`
- [Python 3.10](https://www.python.org/downloads/) or above
- [npm](https://nodejs.org/en/download) or [yarn](https://classic.yarnpkg.com/lang/en/) for java-script package management
- [Tauri](https://v1.tauri.app/v1/guides/getting-started/prerequisites) prerequisites for development


### Quickstart

**On Windows:**
Open the cmd in your directionary through clicking right mouse key. Click on ``Open with Terminal``.  Now follow these instructions:
1. For install all the needed DLL's please type ````.\setup1.bat```` and press Enter. 
    Don't get shocked, if some loading bars will open.
2. Copy the printed command and exceute ````.\.venv\Scripts\Activate.ps1```` through typing and oressing Enter.
3. For running this App excute following command: ````.\setup2.bat```` through typing and pressing Enter

**On Linux:**
Open your Terminal at your dictionary. No follow these instructions:
1. Exceute ``setup.sh``.
2. Install all node packages:
    ``` shell
    yarn # OR
    npm i
    ```

3. Start the tauri installation with the command

    ``` shell
    yarn run tauri dev # OR
    npm run tauri dev
    ```

### Setting up Step by Step
**On Windows**
1. Install Python by executing: 
    ```shell
    winget install --id Python.Python.3.12 --source winget
    ```
2. Install NodeJS by excuting:
    ```cshellmd
    winget install -e --id OpenJS.NodeJS.LTS
    ```
3. Install WebView2-Runtime by executing:
    ```shell
    winget install Microsoft.EdgeWebView2Runtime
    ```
4. Setting up your Powershell-Execution-Policy by executing:
    ```shell
    powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
    ```
5. Install all needed Python3 DLLs by executing:
    ```shell
    winget install --id Python.Python.3.12 --source winget
    ```
6. Download the building tools from: [visualstudio.microsoft.com](https://visualstudio.microsoft.com/de/visual-cpp-build-tools/).
7. Create and activate the [Virtual Envirement](https://github.com/HisQu/.github-private/tree/main/coding-practices/PythonVENV) (watch out the article for further informations)


8. Install all python dependencies recursivly from [requirements.txt](https://github.com/HisQu/.github-private/blob/main/coding-practices/PythonRequirementsText/README.md).
9. Install yarn and npm by exceuting: 
    ```shell
    yarn install
    npm install
    ```
10. Activate yarn by exceuting:
    ```shell
    corepack enable
    corepack prepare yarn@stable --activate
    ```
11. Start the app:
    ```shell
    yarn tauri dev
    ```

**On Linux**
1. Create and activate the [Virtual Envirement](https://github.com/HisQu/.github-private/tree/main/coding-practices/PythonVENV) (watch out the article for further informations).
2. Install all python dependencies recursivly from [requirements.txt](https://github.com/HisQu/.github-private/blob/main/coding-practices/PythonRequirementsText/README.md).
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

## Additional Hints

### Compatibility issue with NVIDIA graphics card 
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

First fix is to install e.g. `sudo apt install python3.12-dev`, which contains the appropriate libraries. Tauri should find them

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

