@echo off

REM 8. Python-Abhängigkeiten installieren
pip install -r requirements.txt

REM 9. NPM-Abhängigkeiten installieren
yarn install
npm install

REM 10. Yarn aktivieren
corepack enable
corepack prepare yarn@stable --activate

REM 11. App starten
yarn tauri dev

pause