# Paredros App - Quick Reference

Schnelle Referenz für häufig verwendete Patterns und APIs.

## Inhaltsverzeichnis
- [Hooks API](#hooks-api)
- [Components Props](#components-props)
- [Utils Functions](#utils-functions)
- [State Structure](#state-structure)
- [Common Patterns](#common-patterns)

---

## Hooks API

### useAppState()

```typescript
const appState = useAppState();

// Zugriff auf State-Gruppen
appState.pyState.pyProgress
appState.grammarState.userGrammar
appState.parseState.nodes
appState.expressionState.expressionContent
appState.editorState.editorContent
```

### useGrammarLoader(appState)

```typescript
const grammarLoader = useGrammarLoader(appState);

// Grammar laden
await grammarLoader.load_grammar_file();

// Main Grammar auswählen
await grammarLoader.selectMainGrammarFile(directory, fileName);

// Input File laden
await grammarLoader.load_input_file();

// Grammar Files speichern
await grammarLoader.saveGrammarFiles();
```

### useParserOperations(appState, providerRef, saveGrammarFiles)

```typescript
const parserOps = useParserOperations(appState, providerRef, grammarLoader.saveGrammarFiles);

// Parser generieren
await parserOps.generate_parser();

// Expression parsen
await parserOps.parse_input();

// Parse Tree holen
await parserOps.get_json_parse_tree();

// Tokens holen
await parserOps.get_lexemes();

// Vollständiger Workflow
await parserOps.generate_parser_save_grammar_files_parse_input();
```

### useParseTreeNavigation(appState, get_json_parse_tree)

```typescript
const navigation = useParseTreeNavigation(appState, parserOps.get_json_parse_tree);

// Navigation
await navigation.stepForwards();
await navigation.stepBackwards();
await navigation.stepToLastDecision();
await navigation.stepToNextDecision();
await navigation.go_to_step(stepId);
```

### useGrammarEditor(appState)

```typescript
const grammarEditor = useGrammarEditor(appState);

// Refs
grammarEditor.grammarEditorRef
grammarEditor.grammarMonacoRef

// Event Handlers
<Editor onMount={grammarEditor.handleGrammarEditorDidMount} />
<Editor onChange={grammarEditor.handleEditorChange} />
```

### useExpressionEditor(appState)

```typescript
const expressionEditor = useExpressionEditor(appState);

// Refs
expressionEditor.expressionEditorRef

// Event Handlers
<Editor onMount={expressionEditor.handleExpressionEditorDidMount} />
<Editor onChange={expressionEditor.handleExpressionChange} />
```

---

## Components Props

### ParseTreePanel

```typescript
<ParseTreePanel
  nodes={parseState.nodes}
  edges={parseState.edges}
  parseStepInfo={parseState.parseStepInfo}
  nextInfo={parseState.nextInfo}
  userGrammar={grammarState.userGrammar}
  expressionChanged={expressionState.expressionChanged}
  isGeneratingParser={parseState.isGeneratingParser}
  isParsingExpression={parseState.isParsingExpression}
  generateParserResult={parseState.generateParserResult}
  stepBackwards={navigation.stepBackwards}
  stepForwards={navigation.stepForwards}
  stepToLastDecision={navigation.stepToLastDecision}
  stepToNextDecision={navigation.stepToNextDecision}
  go_to_step={navigation.go_to_step}
  generate_parser_save_grammar_files_parse_input={parserOps.generate_parser_save_grammar_files_parse_input}
  parse_input={parserOps.parse_input}
/>
```

### GrammarEditorPanel

```typescript
<GrammarEditorPanel
  userGrammar={grammarState.userGrammar}
  providerRef={providerRef}
  activeFileIndex={grammarState.activeFileIndex}
  setActiveFileIndex={grammarState.setActiveFileIndex}
  followParser={parseState.followParser}
  setFollowParser={parseState.setFollowParser}
  editorContent={editorState.editorContent}
  handleGrammarEditorDidMount={grammarEditor.handleGrammarEditorDidMount}
  handleEditorChange={grammarEditor.handleEditorChange}
  load_grammar_file={grammarLoader.load_grammar_file}
/>
```

### ExpressionEditorPanel

```typescript
<ExpressionEditorPanel
  expressionContent={expressionState.expressionContent}
  expressionLanguage={expressionState.expressionLanguage}
  setExpressionLanguage={expressionState.setExpressionLanguage}
  handleExpressionEditorDidMount={expressionEditor.handleExpressionEditorDidMount}
  handleExpressionChange={expressionEditor.handleExpressionChange}
  load_input_file={grammarLoader.load_input_file}
  showTokenLabels={expressionState.showTokenLabels}
  setShowTokenLabels={expressionState.setShowTokenLabels}
/>
```

---

## Utils Functions

### monacoDecorations

```typescript
import {
  tokenToRange,
  createGrammarRuleDecoration,
  createTokenDecorations,
  createCurrentTokenDecoration
} from './utils/monacoDecorations';

// Token zu Range
const range = tokenToRange(monaco, model, token);

// Grammar Rule Decoration
const decorations = createGrammarRuleDecoration(monaco, model, grammarRuleLocation);
decorationCollection = editor.createDecorationsCollection(decorations);

// Token Decorations
const decorations = createTokenDecorations(monaco, model, tokens);
decorationCollection = editor.createDecorationsCollection(decorations);

// Aktueller Token
const decoration = createCurrentTokenDecoration(monaco, model, currentToken);
decorationCollection = editor.createDecorationsCollection(decoration);
```

### grammarFileOperations

```typescript
import {
  readGrammarDirectory,
  tryLoadInputFromGrammarDirectory,
  saveFile
} from './utils/grammarFileOperations';

// Grammar Directory lesen
const files = await readGrammarDirectory(directory);
// Returns: Array<{ name: string, isMainFile: boolean }>

// Input File laden
const content = await tryLoadInputFromGrammarDirectory(grammarPath);
// Returns: string | null

// File speichern
await saveFile(path, content);
```

---

## State Structure

```typescript
// Complete State Type
interface AppState {
  pyState: {
    pyProgress: 'Idle' | 'Downloading' | 'Installing' | 'Done'
    setPyProgress: Dispatch<SetStateAction<PySetupProgressType>>
  }
  
  grammarState: {
    activeFileIndex: string | undefined
    setActiveFileIndex: Dispatch<SetStateAction<string | undefined>>
    grammarFileLocation: string
    setGrammarFileLocation: Dispatch<SetStateAction<string>>
    grammarDirectory: string
    setGrammarDirectory: Dispatch<SetStateAction<string>>
    availableGrammarFiles: Array<{ name: string; isMainFile: boolean }>
    setAvailableGrammarFiles: Dispatch<SetStateAction<Array<{ name: string; isMainFile: boolean }>>>
    noGrammarFilesFound: boolean
    setNoGrammarFilesFound: Dispatch<SetStateAction<boolean>>
    userGrammar: UserGrammar | undefined
    setUserGrammar: Dispatch<SetStateAction<UserGrammar | undefined>>
  }
  
  parseState: {
    parseInfo: string | undefined
    setParseInfo: Dispatch<SetStateAction<string | undefined>>
    generateParserResult: string | undefined
    setGenerateParserResult: Dispatch<SetStateAction<string | undefined>>
    nodes: ParseTreeNode[] | undefined
    setNodes: Dispatch<SetStateAction<ParseTreeNode[] | undefined>>
    edges: Edge[] | undefined
    setEdges: Dispatch<SetStateAction<Edge[] | undefined>>
    parseStepInfo: ParseStepInfo | undefined
    setParseStepInfo: Dispatch<SetStateAction<ParseStepInfo | undefined>>
    nextInfo: ParseStepInfo | undefined
    setNextInfo: Dispatch<SetStateAction<ParseStepInfo | undefined>>
    lexemes: TokenInfo[] | undefined
    setLexemes: Dispatch<SetStateAction<TokenInfo[] | undefined>>
    followParser: boolean
    setFollowParser: Dispatch<SetStateAction<boolean>>
    isGeneratingParser: boolean
    setIsGeneratingParser: Dispatch<SetStateAction<boolean>>
    isParsingExpression: boolean
    setIsParsingExpression: Dispatch<SetStateAction<boolean>>
  }
  
  expressionState: {
    expressionContent: string
    setExpressionContent: Dispatch<SetStateAction<string>>
    expressionChanged: boolean
    setExpressionChanged: Dispatch<SetStateAction<boolean>>
    expressionLanguage: string
    setExpressionLanguage: Dispatch<SetStateAction<string>>
    showTokenLabels: boolean
    setShowTokenLabels: Dispatch<SetStateAction<boolean>>
  }
  
  editorState: {
    editorContent: string
    setEditorContent: Dispatch<SetStateAction<string>>
  }
}
```

---

## Common Patterns

### 1. Neuen Hook erstellen

```typescript
// src/hooks/useMyFeature.ts
import { AppState } from "./useAppState";

export function useMyFeature(appState: AppState) {
  const { grammarState, parseState } = appState;
  
  async function doSomething() {
    // Implementation
  }
  
  return {
    doSomething,
  };
}

// In App.tsx verwenden
const myFeature = useMyFeature(appState);
```

### 2. Neue Component erstellen

```typescript
// src/components/MyComponent.tsx
interface MyComponentProps {
  data: string;
  onAction: () => void;
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  return (
    <div>
      <p>{data}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
}

// In Parent verwenden
<MyComponent 
  data={appState.grammarState.grammarFileLocation}
  onAction={grammarLoader.load_grammar_file}
/>
```

### 3. Monaco Decorations hinzufügen

```typescript
// In Hook
const decorationRef = useRef<editor.IEditorDecorationsCollection>();

function applyDecorations() {
  const monaco = monacoRef.current;
  const ed = editorRef.current;
  if (!monaco || !ed) return;
  
  const model = ed.getModel();
  if (!model) return;
  
  // Clear old decorations
  decorationRef.current?.clear?.();
  
  // Create new decorations
  const decorations = createMyDecorations(monaco, model, data);
  decorationRef.current = ed.createDecorationsCollection(decorations);
}

useEffect(() => {
  applyDecorations();
}, [data]);

// Cleanup
useEffect(() => {
  return () => {
    decorationRef.current?.clear?.();
  };
}, []);
```

### 4. Async Operation mit Loading State

```typescript
const [isLoading, setIsLoading] = useState(false);

async function performAction() {
  setIsLoading(true);
  try {
    const result = await someAsyncOperation();
    // Handle success
  } catch (error) {
    console.error("Failed:", error);
    // Handle error
  } finally {
    setIsLoading(false);
  }
}
```

### 5. Conditional Rendering

```typescript
return (
  <div>
    {isLoading ? (
      <LoadingOverlay message="Loading..." />
    ) : data ? (
      <DataDisplay data={data} />
    ) : (
      <EmptyState />
    )}
  </div>
);
```

### 6. File Selection Dialog

```typescript
const file = await open({
  multiple: false,
  directory: false,
  title: "Select File",
  filters: [{
    name: "Grammar Files",
    extensions: ["g4"]
  }]
});

if (file) {
  const content = await readTextFile(file);
  // Process content
}
```

### 7. useEffect mit Dependency

```typescript
// Single dependency
useEffect(() => {
  if (grammarFileLocation) {
    loadGrammar();
  }
}, [grammarFileLocation]);

// Multiple dependencies
useEffect(() => {
  if (parseStepInfo && lexemes) {
    updateDecorations();
  }
}, [parseStepInfo, lexemes]);

// Cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 8. Immutable State Update

```typescript
// Object update
setState(prev => ({
  ...prev,
  field: newValue
}));

// Nested object update
setState(prev => ({
  ...prev,
  nested: {
    ...prev.nested,
    field: newValue
  }
}));

// Array update
setState(prev => [...prev, newItem]);
setState(prev => prev.filter(item => item.id !== id));
setState(prev => prev.map(item => 
  item.id === id ? { ...item, field: newValue } : item
));
```

---

## Debugging Tips

### 1. State Debugging

```typescript
// Log state changes
useEffect(() => {
  console.log("State changed:", {
    userGrammar: grammarState.userGrammar,
    parseInfo: parseState.parseInfo
  });
}, [grammarState.userGrammar, parseState.parseInfo]);
```

### 2. Monaco Editor Debugging

```typescript
// Log editor state
const model = editor.getModel();
console.log("Editor content:", model?.getValue());
console.log("Cursor position:", editor.getPosition());
console.log("Decorations:", model?.getAllDecorations());
```

### 3. Backend Call Debugging

```typescript
console.log("Calling backend with:", { id: parseInfo, input });
const result = await invoke("parse_input", { id: parseInfo, input });
console.log("Backend result:", result);
```

---

## Performance Tips

### 1. Memoize Components

```typescript
export const MyComponent = React.memo(function MyComponent(props) {
  // Component logic
});
```

### 2. useCallback for Handlers

```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 3. useMemo for Expensive Calculations

```typescript
const processedData = useMemo(() => {
  return expensiveOperation(rawData);
}, [rawData]);
```

---

## TypeScript Types

### Common Types

```typescript
// Grammar Types
type UserGrammar = {
  grammar_files: {
    [key: string]: {
      path: string;
      content: string;
      changed: boolean;
    }
  }
}

type GrammarRuleLocation = {
  file_path: string;
  content: string;
  start_line?: number;
}

// Parse Types
type ParseTreeNode = {
  id: string;
  type: string;
  data: any;
}

type ParseStepInfo = {
  step_id: number;
  token_index: number;
  grammar_rule_location?: GrammarRuleLocation;
}

type TokenInfo = {
  text: string;
  typeName: string;
  line: number;
  column: number;
  startIndex: number;
  stopIndex: number;
  tokenIndex: number;
}
```

---

*Letzte Aktualisierung: November 2025*

