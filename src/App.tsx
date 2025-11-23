import { useRef } from "react";
// UI Components
import './App.css';
import UnhandledRejectionDialog from "./components/UnhandledRejectionDialog.tsx";
import PythonSetupComponent from "./components/PythonSetupComponent.tsx";
import { AppHeader } from "./components/AppHeader.tsx";
import { ParseTreePanel } from "./components/ParseTreePanel.tsx";
import { GrammarEditorPanel } from "./components/GrammarEditorPanel.tsx";
import { ExpressionEditorPanel } from "./components/ExpressionEditorPanel.tsx";
import {
    BigLoadGrammarOverlay,
    SelectGrammarFileOverlay,
    NoGrammarFilesOverlay
} from "./components/ParseTreeOverlays.tsx";
// Allotment (Resizable Panes)
import { Allotment } from "allotment";
import "allotment/dist/style.css";
// Grammar-related imports
import { GrammarFilesDataProvider } from "./components/GrammarFilesDataProvider.ts";
import 'react-complex-tree/lib/style-modern.css';
// Custom Hooks
import { useAppState } from "./hooks/useAppState.ts";
import { useGrammarLoader } from "./hooks/useGrammarLoader.ts";
import { useParserOperations } from "./hooks/useParserOperations.ts";
import { useParseTreeNavigation } from "./hooks/useParseTreeNavigation.ts";
import { useGrammarEditor } from "./hooks/useGrammarEditor.ts";
import { useExpressionEditor } from "./hooks/useExpressionEditor.ts";

function App() {
    // Initialize all state
    const appState = useAppState();

    // Initialize refs
    const providerRef = useRef<GrammarFilesDataProvider>();

    // Initialize hooks
    const grammarLoader = useGrammarLoader(appState);
    const parserOps = useParserOperations(appState, providerRef, grammarLoader.saveGrammarFiles);
    const navigation = useParseTreeNavigation(appState, parserOps.get_json_parse_tree);
    const grammarEditor = useGrammarEditor(appState);
    const expressionEditor = useExpressionEditor(appState);

    // Destructure state for easier access
    const { pyState, grammarState, parseState, expressionState, editorState, flowLayoutState } = appState;

    return (
        <div className="bg-white text-zinc-900 flex flex-col h-screen">
            {/* Unhandled Rejection Dialog */}
            <UnhandledRejectionDialog />

            {/* tailwindcss Safelist */}
            <span className={"bg-blue-300 bg-blue-400 bg-blue-600 bg-violet-300 bg-violet-400 bg-violet-600"}></span>

            {pyState.pyProgress !== 'Done' ? (
                <PythonSetupComponent
                    pyProgress={pyState.pyProgress}
                    setPyProgress={pyState.setPyProgress}
                />
            ) : grammarState.noGrammarFilesFound ? (
                <NoGrammarFilesOverlay onClick={grammarLoader.load_grammar_file} />
            ) : grammarState.availableGrammarFiles.length > 0 ? (
                <div className="w-screen h-screen flex items-center justify-center">
                    <SelectGrammarFileOverlay
                        files={grammarState.availableGrammarFiles}
                        onSelect={(fileName) => grammarLoader.selectMainGrammarFile(
                            grammarState.grammarDirectory,
                            fileName
                        )}
                    />
                </div>
            ) : grammarState.userGrammar ? (
                <div className="w-screen h-screen">
                    <Allotment vertical={true}>
                        {/* Augmented Parse Tree (React Flow) */}
                        <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
                            <div className="flex flex-col h-full min-h-0">
                                <AppHeader />
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
                                    generate_parser_save_grammar_files_parse_input={
                                        parserOps.generate_parser_save_grammar_files_parse_input
                                    }
                                    parse_input={parserOps.parse_input}
                                    flowLayoutDirection={flowLayoutState.flowLayoutDirection}
                                    setFlowLayoutDirection={flowLayoutState.setFlowLayoutDirection}
                                    autoCenterActiveNode={flowLayoutState.autoCenterActiveNode}
                                    setAutoCenterActiveNode={flowLayoutState.setAutoCenterActiveNode}
                                />
                            </div>
                        </Allotment.Pane>

                        {/* Editor */}
                        <Allotment.Pane minSize={200} maxSize={800} className="h-96 w-full">
                            <Allotment vertical={false}>
                                <Allotment.Pane minSize={300} className="h-md bg-blue-400">
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
                                </Allotment.Pane>
                                <Allotment.Pane minSize={200} className="h-md bg-violet-500">
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
                                </Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
                    </Allotment>
                </div>
            ) : (
                <BigLoadGrammarOverlay onClick={grammarLoader.load_grammar_file} />
            )}
        </div>
    );
}

export default App;

