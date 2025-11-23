# Paredros App - Architektur Dokumentation

## Übersicht

Diese Dokumentation beschreibt die Architektur der Paredros App nach dem Refactoring. Die App wurde von einer monolithischen `App.tsx` (950 Zeilen) in eine modulare Struktur mit 13 spezialisierten Modulen aufgeteilt.

## Inhaltsverzeichnis

1. [Projektstruktur](#projektstruktur)
2. [Architektur-Prinzipien](#architektur-prinzipien)
3. [Module-Übersicht](#module-übersicht)
4. [State Management](#state-management)
5. [Datenfluss](#datenfluss)
6. [Komponenten-Hierarchie](#komponenten-hierarchie)
7. [Best Practices](#best-practices)

---

## Projektstruktur

```
src/
├── App.tsx                          # Hauptkomponente (~140 Zeilen)
├── hooks/                           # Custom React Hooks
│   ├── useAppState.ts              # Zentraler Application State
│   ├── useGrammarLoader.ts         # Grammar File Operations
│   ├── useParserOperations.ts      # Parser & Parse Operations
│   ├── useParseTreeNavigation.ts   # Parse Tree Navigation
│   ├── useGrammarEditor.ts         # Grammar Editor Logic
│   └── useExpressionEditor.ts      # Expression Editor Logic
├── components/                      # React Components
│   ├── AppHeader.tsx               # Header Component
│   ├── ParseTreePanel.tsx          # Parse Tree Display
│   ├── GrammarEditorPanel.tsx      # Grammar Editor with File Tree
│   ├── ExpressionEditorPanel.tsx   # Expression Editor
│   ├── FlowPlot.tsx                # Parse Tree Visualization
│   ├── LoadingOverlay.tsx          # Loading Indicator
│   ├── ParseTreeOverlays.tsx       # Various Overlay Components
│   ├── PythonSetupComponent.tsx    # Python Setup UI
│   └── ui/                         # UI Library Components
└── utils/                           # Utility Functions
    ├── monacoDecorations.ts        # Monaco Editor Decorations
    └── grammarFileOperations.ts    # File I/O Operations
```

---

## Architektur-Prinzipien

### 1. **Separation of Concerns**
Jedes Modul hat eine klar definierte Verantwortlichkeit:
- **Hooks**: Geschäftslogik und State Management
- **Components**: UI-Rendering und User Interaction
- **Utils**: Wiederverwendbare Hilfsfunktionen

### 2. **Single Responsibility Principle**
Jede Datei fokussiert sich auf einen spezifischen Aspekt:
- `useGrammarLoader` → nur Grammar Loading
- `useParserOperations` → nur Parser Operations
- `monacoDecorations` → nur Monaco Decorations

### 3. **Dependency Injection**
Hooks und Components erhalten ihre Dependencies als Parameter:
```typescript
useParserOperations(appState, providerRef, saveGrammarFiles)
```

### 4. **Composition over Inheritance**
Die App nutzt React Hooks Composition:
```typescript
const grammarLoader = useGrammarLoader(appState);
const parserOps = useParserOperations(appState, providerRef, grammarLoader.saveGrammarFiles);
```

---

## Module-Übersicht

### Hooks

#### `useAppState.ts`
**Zweck**: Zentraler Application State Manager

**Verantwortlichkeiten**:
- Definiert und initialisiert alle State-Variablen
- Gruppiert State logisch nach Domänen
- Exportiert typsichere State-Objekte

**State-Gruppen**:
- `pyState` - Python Setup Status
- `grammarState` - Grammar Files und Selection
- `parseState` - Parser und Parse Tree Status
- `expressionState` - Expression Editor Content
- `editorState` - Grammar Editor Content

**Verwendung**:
```typescript
const appState = useAppState();
const { grammarState, parseState } = appState;
```

---

#### `useGrammarLoader.ts`
**Zweck**: Verwaltung von Grammar File Loading und Selection

**Hauptfunktionen**:
- `load_grammar_file()` - Öffnet Directory Selection Dialog
- `selectMainGrammarFile(directory, fileName)` - Wählt Haupt-Grammar File
- `load_input_file()` - Lädt Input File für Parser
- `get_parse_info()` - Initialisiert Parse Info vom Backend
- `get_user_grammar()` - Lädt UserGrammar Objekt
- `saveGrammarFiles()` - Speichert alle geänderten Files
- `resetStateVariables()` - Zurücksetzen des States

**Dependencies**:
- Tauri Dialog API (`open`)
- Tauri FileSystem API (`readTextFile`, `writeTextFile`, `readDir`)
- Utils: `readGrammarDirectory`, `tryLoadInputFromGrammarDirectory`

**Workflow**:
```
User clicks "Load Grammar"
  ↓
load_grammar_file() opens directory dialog
  ↓
readGrammarDirectory() scans for .g4 files
  ↓
selectMainGrammarFile() when user selects
  ↓
get_parse_info() initializes backend parser
  ↓
get_user_grammar() loads grammar structure
```

---

#### `useParserOperations.ts`
**Zweck**: Parser-Generierung und Parsing-Operationen

**Hauptfunktionen**:
- `generate_parser()` - Generiert Parser aus Grammar
- `generate_parser_and_save_grammar_files()` - Kombiniert Speichern + Generieren
- `generate_parser_save_grammar_files_parse_input()` - Vollständiger Workflow
- `parse_input()` - Parst Input Expression
- `get_json_parse_tree()` - Holt Parse Tree vom Backend
- `get_lexemes()` - Holt Token List

**useEffect Hooks**:
1. **grammarFileLocation → get_parse_info**: Initialisiert Parser wenn Grammar geladen
2. **parseInfo → get_user_grammar**: Lädt Grammar Structure
3. **userGrammar → setActiveFileIndex**: Wählt erstes File
4. **userGrammar → updateProvider**: Aktualisiert Tree Provider

**Workflow**:
```
User loads grammar
  ↓
generate_parser() compiles grammar to parser
  ↓
parse_input() parses expression
  ↓
get_json_parse_tree() gets AST
  ↓
get_lexemes() gets token list
```

---

#### `useParseTreeNavigation.ts`
**Zweck**: Navigation durch Parse Steps

**Hauptfunktionen**:
- `stepForwards()` - Ein Schritt vorwärts
- `stepBackwards()` - Ein Schritt zurück
- `stepToLastDecision()` - Zum vorherigen Decision Point
- `stepToNextDecision()` - Zum nächsten Decision Point
- `go_to_step(stepId)` - Direkt zu bestimmtem Step

**Verwendung**:
```typescript
const navigation = useParseTreeNavigation(appState, get_json_parse_tree);
await navigation.stepForwards();
```

---

#### `useGrammarEditor.ts`
**Zweck**: Grammar Editor Logik und Decorations

**State**:
- `grammarEditorRef` - Monaco Editor Instance Ref
- `grammarMonacoRef` - Monaco API Ref
- `grammarDecorationCollectionRef` - Decoration Collection

**Hauptfunktionen**:
- `handleGrammarEditorDidMount()` - Initialisiert Editor Refs
- `handleEditorChange()` - Tracked Content Changes
- `updateGrammarRuleDecoration()` - Highlightet aktuelle Grammar Rule

**useEffect Hooks**:
1. **activeFileIndex/userGrammar → updateContent**: Lädt File Content
2. **parseStepInfo → updateDecorations**: Highlightet aktuelle Rule

**Decoration Flow**:
```
Parse Step Info ändert sich
  ↓
useEffect erkennt Änderung
  ↓
updateGrammarRuleDecoration() wird aufgerufen
  ↓
createGrammarRuleDecoration() erstellt Decorations
  ↓
Monaco Editor zeigt Highlight
```

---

#### `useExpressionEditor.ts`
**Zweck**: Expression Editor mit Token Highlighting

**State**:
- `expressionEditorRef` - Monaco Editor Instance Ref
- `expressionMonacoRef` - Monaco API Ref
- `tokenDecorationCollectionRef` - Token Decorations
- `currentTokenDecorationRef` - Aktueller Token Highlight

**Hauptfunktionen**:
- `handleExpressionEditorDidMount()` - Initialisiert Editor
- `handleExpressionChange()` - Tracked Content Changes
- `applyTokenDecorations()` - Zeigt alle Tokens
- `highlightCurrentToken()` - Highlightet aktuellen Token

**useEffect Hooks**:
1. **lexemes → applyTokenDecorations**: Zeigt alle Tokens
2. **parseStepInfo/lexemes → highlightCurrentToken**: Highlightet aktuellen Token
3. **unmount → cleanup**: Entfernt Decorations

---

### Components

#### `AppHeader.tsx`
**Zweck**: Application Header mit Branding

**Props**: Keine

**Rendered Content**:
- Paredros Logo
- Application Subtitle

---

#### `ParseTreePanel.tsx`
**Zweck**: Zeigt Parse Tree und Workflow-Overlays

**Props**:
- `nodes` - Parse Tree Nodes
- `edges` - Parse Tree Edges
- `parseStepInfo` - Aktueller Parse Step
- `nextInfo` - Nächster Parse Step
- `userGrammar` - Grammar Information
- `expressionChanged` - Expression wurde geändert
- `isGeneratingParser` - Parser wird generiert
- `isParsingExpression` - Expression wird geparst
- `generateParserResult` - Parser Generation Ergebnis
- Navigation Functions (stepForwards, stepBackwards, etc.)
- Action Handlers (generate_parser, parse_input)

**Conditional Rendering Logic**:
```typescript
if (isGeneratingParser) → LoadingOverlay("Generating parser...")
else if (isParsingExpression) → LoadingOverlay("Parsing expression...")
else if (nodes && edges) {
  if (grammarChanged) → ParserInputOverlay
  else if (expressionChanged) → ExpressionChangedOverlay
  else → Flow Component
}
else if (generateParserResult) → ParseExpressionOverlay
else → GenerateParserOverlay
```

---

#### `GrammarEditorPanel.tsx`
**Zweck**: Grammar Editor mit File Tree

**Props**:
- `userGrammar` - Grammar Structure
- `providerRef` - Tree Data Provider
- `activeFileIndex` - Aktuell ausgewähltes File
- `setActiveFileIndex` - File Selection Callback
- `followParser` - Auto-follow Parser Location
- `setFollowParser` - Toggle Follow Mode
- `editorContent` - Editor Content
- `handleGrammarEditorDidMount` - Editor Mount Handler
- `handleEditorChange` - Content Change Handler
- `load_grammar_file` - Load Grammar Callback

**Features**:
- **File Tree**: Zeigt alle Grammar Files
- **Follow Parser Toggle**: Auto-switch zu Parser Location
- **Change Indicators**: Zeigt ungespeicherte Änderungen
- **Monaco Editor**: ANTLR4 Syntax Highlighting

---

#### `ExpressionEditorPanel.tsx`
**Zweck**: Expression Editor mit Language Selection

**Props**:
- `expressionContent` - Editor Content
- `expressionLanguage` - Selected Language (xml, json, etc.)
- `setExpressionLanguage` - Language Selection Callback
- `handleExpressionEditorDidMount` - Editor Mount Handler
- `handleExpressionChange` - Content Change Handler
- `load_input_file` - Load Input File Callback
- `showTokenLabels` - Toggle Token Labels
- `setShowTokenLabels` - Toggle Callback

**Features**:
- **Language Selector**: XML, JSON, HTML, Markdown, Plain Text
- **Load File Button**: Import Input File
- **Monaco Editor**: Syntax Highlighting basierend auf Language
- **Token Decorations**: Zeigt Tokens inline (optional)

---

### Utils

#### `monacoDecorations.ts`
**Zweck**: Monaco Editor Decoration Utilities

**Funktionen**:

##### `tokenToRange(monaco, model, token)`
Konvertiert ein Token zu einem Monaco Range Object.

**Parameter**:
- `monaco` - Monaco API
- `model` - Editor Text Model
- `token` - Token Info Object

**Returns**: `monaco.Range`

---

##### `createGrammarRuleDecoration(monaco, model, loc)`
Erstellt Decorations für Grammar Rule Highlighting.

**Parameter**:
- `monaco` - Monaco API
- `model` - Editor Text Model
- `loc` - Grammar Rule Location

**Returns**: `IModelDeltaDecoration[]`

**Logik**:
1. Sucht nach Rule Content im Editor
2. Falls nicht gefunden, sucht nach erster nicht-leerer Zeile
3. Falls immer noch nicht gefunden, nutzt Zeilennummer
4. Erstellt Decoration mit `rule-highlight` CSS Klasse

---

##### `createTokenDecorations(monaco, model, tokens)`
Erstellt Decorations für alle Tokens im Expression Editor.

**Parameter**:
- `monaco` - Monaco API
- `model` - Editor Text Model
- `tokens` - Array von Token Info Objects

**Returns**: `IModelDeltaDecoration[]`

**Features**:
- Alternierende Token Colors (`token-type-0`, `token-type-1`)
- Inline Annotations mit Token Text
- Hover Messages mit Token Details
- Overview Ruler Indicators
- Minimap Indicators

---

##### `createCurrentTokenDecoration(monaco, model, token)`
Erstellt Decoration für den aktuell aktiven Token.

**Parameter**:
- `monaco` - Monaco API
- `model` - Editor Text Model
- `token` - Aktuelles Token Object

**Returns**: `IModelDeltaDecoration[]`

**CSS Klasse**: `token-type-active`

---

#### `grammarFileOperations.ts`
**Zweck**: File I/O Operations für Grammar Files

**Funktionen**:

##### `readGrammarDirectory(directory)`
Liest alle .g4 Files aus einem Verzeichnis und analysiert sie.

**Parameter**:
- `directory` - Verzeichnis Pfad

**Returns**: `Promise<GrammarFileMetadata[]>`

**GrammarFileMetadata**:
```typescript
{
  name: string;        // Filename
  isMainFile: boolean; // Hat startRule oder "// main file" Kommentar
}
```

**Logik**:
1. Liest Directory Entries
2. Filtert nach .g4 Files
3. Analysiert jedes File auf "startRule" oder "// main file"
4. Returned Metadata Array

---

##### `tryLoadInputFromGrammarDirectory(grammarPath)`
Versucht input.txt aus dem gleichen Verzeichnis zu laden.

**Parameter**:
- `grammarPath` - Grammar File Pfad

**Returns**: `Promise<string | null>`

**Logik**:
1. Extrahiert Directory aus Grammar Path
2. Konstruiert input.txt Pfad
3. Versucht File zu lesen
4. Returns Content oder null bei Fehler

---

##### `saveFile(path, content)`
Speichert eine Datei auf Disk.

**Parameter**:
- `path` - File Pfad
- `content` - File Content

**Returns**: `Promise<void>`

**Throws**: Error bei Speicher-Fehler

---

## State Management

### State-Architektur

Die App nutzt ein **zentralisiertes State Management** mit `useAppState`:

```typescript
const appState = useAppState();

// State ist gruppiert nach Domänen
appState.pyState       // Python Setup
appState.grammarState  // Grammar Files
appState.parseState    // Parser & Parse Tree
appState.expressionState // Expression Editor
appState.editorState   // Grammar Editor
```

### State Flow

```
User Action
  ↓
Component Event Handler
  ↓
Hook Function (z.B. grammarLoader.load_grammar_file())
  ↓
State Update (z.B. setGrammarFileLocation)
  ↓
useEffect Hook triggered
  ↓
Side Effect (z.B. Backend Call)
  ↓
State Update
  ↓
Component Re-render
```

### State Dependencies

```
grammarFileLocation
  ↓
parseInfo (via useEffect)
  ↓
userGrammar (via useEffect)
  ↓
activeFileIndex (via useEffect)
  ↓
editorContent (via useEffect)
```

---

## Datenfluss

### Grammar Loading Flow

```
┌─────────────────────┐
│ User clicks "Load"  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ load_grammar_file() │
│ opens dialog        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│ readGrammarDirectory()  │
│ scans .g4 files         │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│ setAvailableGrammarFiles │
└──────────┬───────────────┘
           │
           ▼
┌─────────────────────────┐
│ User selects main file  │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│ selectMainGrammarFile()  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ setGrammarFileLocation   │
└──────────┬───────────────┘
           │
           ▼ (useEffect)
┌──────────────────────────┐
│ get_parse_info()         │
│ backend initialization   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ setParseInfo             │
└──────────┬───────────────┘
           │
           ▼ (useEffect)
┌──────────────────────────┐
│ get_user_grammar()       │
│ loads grammar structure  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ setUserGrammar           │
│ App ready!               │
└──────────────────────────┘
```

### Parsing Flow

```
┌─────────────────────────┐
│ User types expression   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ setExpressionChanged    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ User clicks "Parse"     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ parse_input()           │
│ backend parse           │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ get_json_parse_tree()   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ setNodes, setEdges      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ get_lexemes()           │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│ setLexemes               │
│ Parse Tree displayed!    │
└──────────────────────────┘
```

---

## Komponenten-Hierarchie

```
App
│
├─ UnhandledRejectionDialog (global error handler)
│
├─ PythonSetupComponent (if py not ready)
│
├─ NoGrammarFilesOverlay (if no .g4 files found)
│
├─ SelectGrammarFileOverlay (if multiple .g4 files)
│
├─ BigLoadGrammarOverlay (initial state)
│
└─ Allotment (main layout)
   │
   ├─ Allotment.Pane (top - parse tree)
   │  └─ div
   │     ├─ AppHeader
   │     └─ ParseTreePanel
   │        ├─ LoadingOverlay (generating/parsing)
   │        ├─ GenerateParserOverlay (no parser)
   │        ├─ ParseExpressionOverlay (parser ready)
   │        ├─ ParserInputOverlay (grammar changed)
   │        ├─ ExpressionChangedOverlay (expression changed)
   │        └─ Flow (parse tree visualization)
   │
   └─ Allotment.Pane (bottom - editors)
      └─ Allotment (horizontal split)
         │
         ├─ Allotment.Pane (left - grammar editor)
         │  └─ GrammarEditorPanel
         │     ├─ Button (Follow Parser toggle)
         │     ├─ UncontrolledTreeEnvironment (file tree)
         │     └─ Editor (Monaco - grammar)
         │
         └─ Allotment.Pane (right - expression editor)
            └─ ExpressionEditorPanel
               ├─ Button (Load file)
               ├─ Select (Language selector)
               └─ Editor (Monaco - expression)
```

---

## Best Practices

### 1. Hook Usage

#### ✅ DO
```typescript
// Nutze Hooks in korrekter Reihenfolge
const appState = useAppState();
const grammarLoader = useGrammarLoader(appState);
const parserOps = useParserOperations(appState, ref, grammarLoader.saveGrammarFiles);
```

#### ❌ DON'T
```typescript
// Keine konditionalen Hooks
if (condition) {
  const state = useState(); // ❌
}
```

---

### 2. State Updates

#### ✅ DO
```typescript
// Immutable Updates
grammarState.setUserGrammar(prev => ({
  ...prev,
  grammar_files: {
    ...prev.grammar_files,
    [key]: { ...prev.grammar_files[key], changed: true }
  }
}));
```

#### ❌ DON'T
```typescript
// Keine direkten Mutations
userGrammar.grammar_files[key].changed = true; // ❌
```

---

### 3. Async Operations

#### ✅ DO
```typescript
async function parse_input() {
  setIsParsingExpression(true);
  try {
    const result = await invoke("parse_input", {...});
    // Handle result
  } finally {
    setIsParsingExpression(false); // Always cleanup
  }
}
```

#### ❌ DON'T
```typescript
async function parse_input() {
  const result = await invoke("parse_input", {...});
  setIsParsingExpression(false); // ❌ Skipped if error
}
```

---

### 4. Component Props

#### ✅ DO
```typescript
// Klare, typsichere Props
interface ParseTreePanelProps {
  nodes: ParseTreeNode[] | undefined;
  edges: Edge[] | undefined;
  stepForwards: () => Promise<void>;
}

export function ParseTreePanel(props: ParseTreePanelProps) {
  // ...
}
```

#### ❌ DON'T
```typescript
// Keine any Props
export function ParseTreePanel(props: any) { // ❌
  // ...
}
```

---

### 5. useEffect Dependencies

#### ✅ DO
```typescript
useEffect(() => {
  if (grammarFileLocation) {
    get_parse_info();
  }
}, [grammarFileLocation]); // Korrekte Dependency
```

#### ❌ DON'T
```typescript
useEffect(() => {
  if (grammarFileLocation) {
    get_parse_info();
  }
}, []); // ❌ Missing dependency
```

---

### 6. Error Handling

#### ✅ DO
```typescript
try {
  const content = await readTextFile(filePath);
  setExpressionContent(content);
} catch (error) {
  console.error("Failed to load file:", error);
  // Show user-friendly error message
}
```

#### ❌ DON'T
```typescript
const content = await readTextFile(filePath); // ❌ No error handling
setExpressionContent(content);
```

---

### 7. Monaco Decorations Cleanup

#### ✅ DO
```typescript
useEffect(() => {
  applyTokenDecorations();
  
  return () => {
    tokenDecorationCollectionRef.current?.clear?.(); // Cleanup
  };
}, [lexemes]);
```

#### ❌ DON'T
```typescript
useEffect(() => {
  applyTokenDecorations();
  // ❌ No cleanup
}, [lexemes]);
```

---

## Testing Guidelines

### Unit Tests für Hooks

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useGrammarLoader } from './useGrammarLoader';

test('load_grammar_file opens dialog', async () => {
  const { result } = renderHook(() => useGrammarLoader(mockAppState));
  
  await result.current.load_grammar_file();
  
  expect(mockOpen).toHaveBeenCalled();
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { AppHeader } from './AppHeader';

test('renders logo and subtitle', () => {
  render(<AppHeader />);
  
  expect(screen.getByAltText('Paredros Icon')).toBeInTheDocument();
  expect(screen.getByText('Grammar debugging environment')).toBeInTheDocument();
});
```

---

## Performance Considerations

### 1. Memoization
Nutze `React.memo()` für Components die häufig re-rendern:
```typescript
export const ParseTreePanel = React.memo(function ParseTreePanel(props) {
  // ...
});
```

### 2. useCallback für Event Handlers
```typescript
const handleEditorChange = useCallback((value: any) => {
  setUserGrammar(prev => ({...}));
}, [dependencies]);
```

### 3. useMemo für teure Berechnungen
```typescript
const parsedData = useMemo(() => {
  return transformJsonToParseTree(response);
}, [response]);
```

---

## Troubleshooting

### Problem: Editor Decorations werden nicht angezeigt
**Lösung**: Prüfe ob Monaco Editor gemounted ist
```typescript
if (!monaco || !editor) return;
const model = editor.getModel();
if (!model) return;
```

### Problem: State Updates triggern nicht
**Lösung**: Prüfe useEffect Dependencies
```typescript
useEffect(() => {
  // ...
}, [dependency1, dependency2]); // Alle genutzten Variablen
```

### Problem: Parse Tree wird nicht geladen
**Lösung**: Prüfe die Reihenfolge der Backend Calls
```
1. load_grammar_file()
2. get_parse_info()
3. generate_parser()
4. parse_input()
5. get_json_parse_tree()
```

---

## Weiterführende Dokumentation

- [API Documentation](./API.md) - Detaillierte API Referenz
- [Component Guide](./COMPONENTS.md) - Component Usage Guide
- [Hooks Guide](./HOOKS.md) - Custom Hooks Guide
- [Contributing](../CONTRIBUTING.md) - Contribution Guidelines

---

*Letzte Aktualisierung: November 2025*

