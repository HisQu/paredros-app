# User Settings Storage

Diese App verwendet das **Tauri Store Plugin** (`@tauri-apps/plugin-store`) für die persistente Speicherung von Benutzereinstellungen.

## Übersicht

Die Einstellungen werden in einer `settings.json` Datei im App-Data-Verzeichnis gespeichert und bleiben über Sitzungen hinweg erhalten.

## Verwendung

### Aktuell gespeicherte Einstellungen

- **`showTokenLabels`**: Boolean - Zeigt oder versteckt Token-Labels im Expression Editor

### Neue Einstellungen hinzufügen

1. **Interface erweitern** (`src/interfaces/UserSettings.ts`):
```typescript
export interface UserSettings {
    showTokenLabels: boolean;
    // Neue Einstellung hinzufügen:
    yourNewSetting: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    showTokenLabels: true,
    yourNewSetting: 'default value',
};
```

2. **Einstellung in useAppState laden** (`src/hooks/useAppState.ts`):
```typescript
const [yourNewSetting, setYourNewSetting] = useState<string>('default value');

// In useEffect für das Laden:
useEffect(() => {
    const loadSettings = async () => {
        const showLabels = await getSetting('showTokenLabels');
        setShowTokenLabels(showLabels);
        
        const newSetting = await getSetting('yourNewSetting');
        setYourNewSetting(newSetting);
    };
    loadSettings();
}, [getSetting]);

// Separater useEffect für das Speichern:
useEffect(() => {
    setSetting('yourNewSetting', yourNewSetting);
}, [yourNewSetting, setSetting]);
```

3. **State in AppState Interface exportieren**:
```typescript
export interface AppState {
    // ... existing state ...
    settingsState: {
        yourNewSetting: string;
        setYourNewSetting: Dispatch<SetStateAction<string>>;
    };
}
```

## API

Der `useUserSettings` Hook bietet folgende Funktionen:

- **`getSetting<K>(key: K)`**: Lädt einen einzelnen Einstellungswert
- **`setSetting<K>(key: K, value: UserSettings[K])`**: Speichert einen einzelnen Einstellungswert
- **`loadAllSettings()`**: Lädt alle Einstellungen auf einmal
- **`resetSettings()`**: Setzt alle Einstellungen auf Standardwerte zurück

## Speicherort

Die Einstellungsdatei wird gespeichert unter:
- **Windows**: `%APPDATA%\com.paredros-app.dev\settings.json`
- **macOS**: `~/Library/Application Support/com.paredros-app.dev/settings.json`
- **Linux**: `~/.config/com.paredros-app.dev/settings.json`

## Implementierungsdetails

- Das Store-Plugin wird in `src-tauri/src/main.rs` initialisiert
- Permissions sind in `src-tauri/capabilities/default.json` konfiguriert
- Die Rust-Dependency ist in `src-tauri/Cargo.toml` definiert
- Das Frontend-Package ist in `package.json` definiert

## Beispiel: followParser Einstellung hinzufügen

Wenn Sie z.B. die `followParser` Einstellung persistent machen möchten:

1. In `UserSettings.ts`:
```typescript
export interface UserSettings {
    showTokenLabels: boolean;
    followParser: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    showTokenLabels: true,
    followParser: false,
};
```

2. In `useAppState.ts`:
```typescript
// Im loadSettings useEffect:
const followParserSetting = await getSetting('followParser');
setFollowParser(followParserSetting);

// Neuer useEffect:
useEffect(() => {
    setSetting('followParser', followParser);
}, [followParser, setSetting]);
```

Das war's! Die Einstellung wird nun automatisch geladen und gespeichert.

