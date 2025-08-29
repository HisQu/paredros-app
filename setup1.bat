@echo off

REM 1. Python installieren (empfohlen: von python.org, nicht aus dem Store) ===
where python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Python nicht gefunden. Installiere Python 3.12...
    winget install --id Python.Python.3.12 --source winget
)

REM 2. Node.js prüfen und ggf. installieren
where node >nul 2>nul
IF ERRORLEVEL 1 (
    echo Node.js nicht gefunden. Installiere Node.js...
    winget install -e --id OpenJS.NodeJS.LTS
)

REM 3. WebView2-Runtime installieren (für Tauri)
winget install Microsoft.EdgeWebView2Runtime

REM 4. Powershell-ExecutionPolicy für venv-Aktivierung erlauben ===
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"

REM 5. Python-DLL prüfen
where python3*.dll >nul 2>nul
IF ERRORLEVEL 1 (
    echo Python-DLL nicht gefunden! Installiere Python neu...
    winget install --id Python.Python.3.12 --source winget
)

REM 6. Hinweis zu Visual Studio Build Tools
echo ------------------------------------------
echo Installiere die Visual Studio Build Tools (MSVC, CMake, Windows SDK)!
echo Download: https://visualstudio.microsoft.com/de/visual-cpp-build-tools/
echo ------------------------------------------

REM 7. Virtuelle Umgebung erstellen ===
python -m venv .venv

REM 7. Hinweis zur Aktivierung des venv ===
echo ------------------------------------------
echo Starte jetzt eine neue PowerShell und fuehre aus:
echo .\.venv\Scripts\Activate.ps1
echo ------------------------------------------


