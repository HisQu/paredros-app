import {useEffect, useRef, useState} from "react";
// Tauri
import {invoke} from "@tauri-apps/api/core";
import {open} from '@tauri-apps/plugin-dialog';
import {writeTextFile, readTextFile} from '@tauri-apps/plugin-fs';
import {dirname, join} from '@tauri-apps/api/path';
// UI Components
import './App.css';
import Flow from "./components/FlowPlot.tsx";
import UnhandledRejectionDialog from "./components/UnhandledRejectionDialog.tsx";
import PythonSetupComponent from "./components/PythonSetupComponent.tsx";
import {Button} from "./components/ui/button.tsx";
import {Select} from "./components/ui/select.tsx";
import LoadingOverlay from "./components/LoadingOverlay.tsx";
import {FolderOpenIcon} from "@heroicons/react/24/outline";
import {
    GenerateParserOverlay,
    LoadGrammarOverlay,
    BigLoadGrammarOverlay,
    ParserInputOverlay,
    ParseExpressionOverlay,
    ExpressionChangedOverlay
} from "./components/ParseTreeOverlays.tsx";
// Interfaces
import {GrammarRuleLocation, ParseStepInfo, TokenInfo, UserGrammar} from "./interfaces/UserGrammar.ts";
import {ParseTreeNode} from "./interfaces/ParseTreeNode.ts";
import type {PySetupProgressType} from "./interfaces/PySetupProgressType.ts"
// Mockup/Helper values
import {antlr4MonarchLanguage} from "./constants";
// Code Editor
import Editor, {OnMount} from '@monaco-editor/react';
import {editor} from "monaco-editor";
// Allotment (Resizable Panes)
import {Allotment} from "allotment";
import "allotment/dist/style.css";
// Grammar-related imports
import {Tree, UncontrolledTreeEnvironment} from 'react-complex-tree';
import {GrammarFilesDataProvider} from "./components/GrammarFilesDataProvider.ts";
import 'react-complex-tree/lib/style-modern.css';
import {buildItemsFromUserGrammar} from "./grammarHelpers.ts";
// Parse Tree Helpers
import {transformJsonToParseTree} from "./parseTreeHelpers.ts";
// ReactFlow Nodes
import {Edge} from '@xyflow/react';


// END IMPORTS and constants

function App() {
    // Python initialisation progress
    const [pyProgress, setPyProgress] = useState<PySetupProgressType>('Idle');

    // Initial file: a Grammar file with default content.
    const [activeFileIndex, setActiveFileIndex] = useState<String>();

    // Update the content of the active file when the editor changes.
    const handleEditorChange = (value: any) => {
        setUserGrammar(prev => {
            if (!prev) return prev;
            const k = String(activeFileIndex);
            return {
                ...prev,
                grammar_files: {
                    ...prev.grammar_files,
                    [k]: {...prev.grammar_files[k], content: value ?? '', changed: true}
                }
            };
        });
    };

    // whether the expression editor content has changed since the last parse
    const [expressionChanged, setExpressionChanged] = useState<boolean>(false);

    const handleExpressionChange = (value: any) => {
        setExpressionContent(value || "");
        setExpressionChanged(true);
    }

    // Refs / References declarations
    const providerRef = useRef<GrammarFilesDataProvider>();

    // decorations in the grammar monaco editor
    const grammarEditorRef = useRef<Parameters<OnMount>[0] | null>(null);
    const grammarMonacoRef = useRef<Parameters<OnMount>[1] | null>(null);
    const grammarDecorationCollectionRef = useRef<editor.IEditorDecorationsCollection>();

    const handleGrammarEditorDidMount: OnMount = (editor, monaco) => {
        grammarEditorRef.current = editor;
        grammarMonacoRef.current = monaco;
    };

    // decorations in the expression monaco editor
    const expressionEditorRef = useRef<Parameters<OnMount>[0] | null>(null);
    const expressionMonacoRef = useRef<Parameters<OnMount>[1] | null>(null);
    const tokenDecorationCollectionRef = useRef<editor.IEditorDecorationsCollection>();
    const currentTokenDecorationRef = useRef<editor.IEditorDecorationsCollection>();

    const handleExpressionEditorDidMount: OnMount = (editor, monaco) => {
        expressionEditorRef.current = editor;
        expressionMonacoRef.current = monaco;
    };

    const [grammarFileLocation, setGrammarFileLocation] = useState("");

    /** How variables "flow"
     *
     * It is necessary to wait for async operations. For this, we use useEffect.
     * The order of execution is as follows:
     * 1. The user loads a grammar using the button
     * 2. This calls load_grammar_file, which changes the variable "grammarFileLocation"
     * 3. This calls  get_user_grammar, which returns a UserGrammar instance
     *
     *
     * Afterwards, we can call methods of the ParseInformation instance as we wish.
     * 4. generate_parser
     * 5. parse, which parses a specific input
     *
     * This will generate a parse tree, which we can get using get_json_parse_tree
     * 6. get_json_parse_tree, which returns the nodes and edges of the parse tree
     * 7. get_current_parse_step_info, which returns information about the current parse step
     * 8. get_lexemes, which returns the list of lexemes used in the parse
     *
     * The meta-information (parse step info) is then stored in the variable "info"
     * 9.  update_grammar_rule_decorations, which updates the decorations in the grammar editor
     * 10. update_expression_decorations, which updates the decorations in the expression editor
     *
     **/

    function resetStateVariables() {
        setParseStepInfo(undefined);
        setLexemes(undefined);
        setEdges(undefined);
        setNodes(undefined);
        setGenerateParserResult(undefined);
    }

    async function load_grammar_file() {
        // DEBUG
        console.log("load_grammar_file")

        const file = await open({
            multiple: false,
            directory: false,
        });

        if (file) {
            // DEBUG
            console.log("set new grammar file", file);
            // Reset all state values which hold parse tree information, parseInformation instance id, etc.
            resetStateVariables();

            setGrammarFileLocation(file);
            
            // Try to load input.txt from the same directory
            await tryLoadInputFromGrammarDirectory(file);
        }
    }

    async function tryLoadInputFromGrammarDirectory(grammarPath: string) {
        try {
            // Extract directory
            const directory = await dirname(grammarPath);
            const inputPath = await join(directory, 'input.txt');

            // DEBUG
            console.log("Looking for input file at path:" + inputPath);
            
            // Try to read the input.txt file
            const content = await readTextFile(inputPath);
            setExpressionContent(content);
            expressionEditorRef?.current?.setValue(content);

            console.log("Loaded input.txt from grammar directory");
        } catch (error) {
            // File doesn't exist or couldn't be read - that's fine, just continue
            console.log("No input.txt found in grammar directory (this is optional)");
        }
    }

    async function load_input_file() {
        // DEBUG
        console.log("load_input_file")

        const file = await open({
            multiple: false,
            directory: false,
        });

        if (file) {
            try {
                const content = await readTextFile(file);
                setExpressionContent(content);
                setExpressionChanged(true);
                expressionEditorRef?.current?.setValue(content);

                console.log("Loaded input file:", file);
            } catch (error) {
                console.error("Failed to load input file:", error);
            }
        }
    }

    // parse info and user grammar variables which are filled after loading a grammar and generating a parser
    const [parseInfo, setParseInfo] = useState<string | undefined>();
    const [generateParserResult, setGenerateParserResult] = useState<string | undefined>();
    const [userGrammar, setUserGrammar] = useState<UserGrammar>();
    // values which change with each step
    const [nodes, setNodes] = useState<ParseTreeNode[]>();
    const [edges, setEdges] = useState<Edge[]>();
    const [parseStepInfo, setParseStepInfo] = useState<ParseStepInfo>();
    const [nextInfo, setNextInfo] = useState<ParseStepInfo>();
    const [lexemes, setLexemes] = useState<TokenInfo[]>();
    // user interface state
    const [followParser, setFollowParser] = useState<boolean>(false); // default: user controls file switching
    const [isGeneratingParser, setIsGeneratingParser] = useState<boolean>(false);
    const [isParsingExpression, setIsParsingExpression] = useState<boolean>(false);

    // expression editor content
    const [expressionContent, setExpressionContent] = useState<string>("");
    // expression editor language
    const [expressionLanguage, setExpressionLanguage] = useState<string>("xml");

    // grammar editor content
    const [editorContent, setEditorContent] = useState<string>("");
    useEffect(() => {
        // DEBUG
        console.log("Active file index changed:", activeFileIndex);

        // Set the initial content of the editor when the userGrammar changes
        if (userGrammar && activeFileIndex) {
            const file = userGrammar.grammar_files[String(activeFileIndex)];
            if (file) {
                setEditorContent(file.content);
            }
        }
    }, [userGrammar, activeFileIndex]);


    async function get_parse_info() {
        // DEBUG
        console.log("get_parse_info");

        // reset the parse tree
        setNodes(undefined);
        setEdges(undefined);

        await saveGrammarFiles();

        setParseInfo(await invoke("get_parse_info", {grammar: grammarFileLocation}));
    }

    async function generate_parser_save_grammar_files_parse_input() {
        await generate_parser_and_save_grammar_files();
        await parse_input();
    }

    async function generate_parser_and_save_grammar_files() {
        await saveGrammarFiles();
        await generate_parser();
    }

    async function generate_parser() {
        // DEBUG
        console.log("generate_parser");

        setIsGeneratingParser(true);
        try {
            setGenerateParserResult(await invoke("generate_parser", {
                id: parseInfo
            }));
        } finally {
            setIsGeneratingParser(false);
        }
    }

    async function go_to_step(step_id: number) {
        // DEBUG
        console.log("go_to_step", step_id);

        await invoke("go_to_step", {
            id: parseInfo,
            stepId: step_id,
            step_id: step_id,
        });

        // load the new parse tree
        await get_json_parse_tree();
    }

    async function parse_input() {
        // call parse input
        setIsParsingExpression(true);
        try {
            const parse_input_result = await invoke("parse_input", {
                id: parseInfo,
                input: expressionContent
            });

            console.log("Expression parsed:", expressionContent);

            // DEBUG
            console.log("parse_input_result", parse_input_result);

            if (parse_input_result === "Parsed successfully") {
                setExpressionChanged(false);
                await get_json_parse_tree();
                await get_lexemes();
            }
        } finally {
            setIsParsingExpression(false);
        }
    }

    // instead of calling immediately,
    // which results in errors
    useEffect(() => {
        // DEBUG
        console.log("useEffect: grammarFileLocation", grammarFileLocation);
        if (grammarFileLocation) {
            get_parse_info(); // set parseInfo instance ID
        }
    }, [grammarFileLocation]);

    useEffect(() => {
        if (parseInfo) {
            get_user_grammar(); // set userGrammar
        }
    }, [parseInfo]);

    useEffect(() => {
        if (userGrammar) {
            setActiveFileIndex(Object.keys(userGrammar.grammar_files)[0]);
        }
    }, [userGrammar])

    // Create the data provider for the tree, which also handles item updates
    useEffect(() => {
        if (!userGrammar) return;

        const map = buildItemsFromUserGrammar(userGrammar);

        if (!providerRef.current) {
            providerRef.current = new GrammarFilesDataProvider(map);
        } else {
            providerRef.current.setItems(map);
        }
    }, [userGrammar]);

    async function get_user_grammar() {
        // DEBUG
        console.log("get_user_grammar");

        const _g: UserGrammar = await invoke("get_user_grammar", {id: parseInfo})
        setUserGrammar(_g);
    }

    async function saveGrammarFiles(): Promise<void> {
        if (userGrammar) {
            for (const key in userGrammar.grammar_files) {
                if (Object.prototype.hasOwnProperty.call(userGrammar.grammar_files, key)) {
                    const file = userGrammar.grammar_files[key];
                    if (file.changed) {
                        try {
                            // Save the file's content to its specified path.
                            await writeTextFile(file.path, file.content);
                            // Mark the file as saved.
                            file.changed = false;
                        } catch (error) {
                            console.error(`Failed to save file at ${file.path}:`, error);
                        }
                    }
                }
            }
        }
    }

    async function stepForwards() {
        // DEBUG
        console.log("Step Forwards")

        await invoke("step_forwards", {id: parseInfo, step: 1})
        await get_json_parse_tree();
    }

    async function stepBackwards() {
        // DEBUG
        console.log("Step Backwards")
        await invoke("step_backwards", {id: parseInfo})
        await get_json_parse_tree();
    }

    async function stepToLastDecision() {
        // DEBUG
        console.log("stepToLastDecision")
        await invoke("step_back_until_previous_decision", {id: parseInfo})
        await get_json_parse_tree();
    }

    async function stepToNextDecision() {
        // DEBUG
        console.log("stepToNextDecision")
        await invoke("step_until_next_decision", {id: parseInfo})
        await get_json_parse_tree();
    }

    async function get_json_parse_tree() {
        const _response = await invoke("get_json_parse_tree", {id: parseInfo});

        // DEBUG
        console.log("JSON Parse Tree");
        console.log(_response);

        setFollowParser(true);
        const {nodes: _n, edges: _e} = transformJsonToParseTree(_response);
        setNodes(_n);
        setEdges(_e);

        await get_current_parse_step_info();
        await get_next_parse_step_info();
    }

    async function get_current_parse_step_info() {
        const _response = await invoke<ParseStepInfo>("get_current_parse_step_info", {id: parseInfo});

        // DEBUG
        console.log("Parse Step Info");
        console.log(_response);

        setParseStepInfo(_response);
    }

    async function get_next_parse_step_info() {
        const _response = await invoke<ParseStepInfo>("get_next_parse_step_info", {
            id: parseInfo,
        });
        setNextInfo(_response);
    }

    async function get_lexemes() {
        const _response = await invoke<TokenInfo[]>("get_token_list", {id: parseInfo});

        // DEBUG
        console.log("Get lexemes");
        console.log(_response);

        setLexemes(_response);
    }

    // Listen on changes to parse step info, and update decorations accordingly
    useEffect(() => {
        const loc = parseStepInfo?.grammar_rule_location;
        if (!loc) return;

        // Only auto-switch when followParser is enabled
        if (followParser && activeFileIndex !== loc.file_path) {
            setActiveFileIndex(loc.file_path);
            return; // let the next run place the decorations after model changes
        }

        // If the currently open file matches the parser location, decorate it
        if (activeFileIndex === loc.file_path) {
            updateGrammarRuleDecoration(loc);
        } else {
            // Different file is open and follow is OFF: clear any stale decorations
            grammarDecorationCollectionRef.current?.clear?.();
        }
    }, [parseStepInfo, activeFileIndex, followParser]);

    function updateGrammarRuleDecoration(loc: GrammarRuleLocation) {
        const monaco = grammarMonacoRef.current;
        const ed = grammarEditorRef.current;
        if (!monaco || !ed) return;

        const model = ed.getModel();
        if (!model) return;

        grammarDecorationCollectionRef.current?.clear();

        const full = model.getValue();
        let idx = (loc.content ?? '').length ? full.indexOf(loc.content) : -1;
        let fallbackLen = 0;

        if (idx === -1 && loc.content) {
            const firstNonEmpty = loc.content.split(/\r?\n/).find(l => l.trim().length > 0);
            if (firstNonEmpty) {
                idx = full.indexOf(firstNonEmpty);
                fallbackLen = firstNonEmpty.length;
            }
        }

        let range: any;
        if (idx !== -1) {
            const startPos = model.getPositionAt(idx);
            const endPos = model.getPositionAt(idx + (fallbackLen || loc.content.length));
            range = new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column);
        } else {
            const line = Math.min(Math.max(loc.start_line || 1, 1), model.getLineCount());
            range = new monaco.Range(line, 1, line, model.getLineMaxColumn(line));
        }

        const deco = [{
            range,
            options: {
                className: 'rule-highlight',
                beforeContentClassName: 'rule-inline-hint',
            }
        }];
        grammarDecorationCollectionRef.current = ed.createDecorationsCollection(deco);

        ed.revealRangeInCenter(range);
    }

    function tokenToRange(monaco: any, model: any, t: TokenInfo) {
        const startPos = model.getPositionAt(t.startIndex);
        const endPos = model.getPositionAt(t.stopIndex+1);
        return new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column);
    }

    function applyTokenDecorations(tokens: TokenInfo[]) {
        const monaco = expressionMonacoRef.current;
        const ed = expressionEditorRef.current;
        if (!monaco || !ed) return;

        const model = ed.getModel?.();
        if (!model) return;

        // Clear previous
        tokenDecorationCollectionRef.current?.clear?.();

        const Stickiness = monaco.editor.TrackedRangeStickiness;      // runtime enum
        const RulerLane = monaco.editor.OverviewRulerLane;            // runtime enum

        const maxLabel = 80;
        const safe = (s: string) => (s ?? '').replace(/\s+/g, ' ').slice(0, maxLabel);

        const decorations: any[] = tokens.map((t, i) => {
            const range = tokenToRange(monaco, model, t);
            const label = safe(t.text);

            return {
                range,
                options: {
                    className: `token-highlight token-type-${i%2}`,
                    stickiness: Stickiness.NeverGrowsWhenTypingAtEdges,
                    inlineClassNameAffectsLetterSpacing: true,

                    after: {
                        contentText: ` ${label}`,
                        inlineClassName: `token-inline-annotation`,
                    },

                    hoverMessage: {
                        value:
                            `**${t.typeName || 'Token'}**\n\n` +
                            `line: ${t.line}, column: ${t.column}; ` +
                            `index: [${t.startIndex}..${t.stopIndex+1}] (#${t.tokenIndex})`
                    },

                    overviewRuler: {
                        color: 'rgba(180,180,255,0.6)',
                        position: RulerLane.Center,
                    },
                    minimap: { color: 'rgba(180,180,255,0.6)', position: 1 },
                }
            };
        });

        tokenDecorationCollectionRef.current = ed.createDecorationsCollection(decorations);
    }

    function highlightCurrentToken() {
        const monaco = expressionMonacoRef.current;
        const ed = expressionEditorRef.current;
        if (!monaco || !ed || !lexemes || !parseStepInfo) {
            currentTokenDecorationRef.current?.clear?.();
            return;
        }

        const model = ed.getModel?.();
        if (!model) return;

        // find token by index
        const tok = lexemes.find(t => t.tokenIndex === parseStepInfo.token_index) ?? lexemes[parseStepInfo.token_index];
        if (!tok) {
            currentTokenDecorationRef.current?.clear?.();
            return;
        }

        const range = tokenToRange(monaco, model, tok);
        currentTokenDecorationRef.current?.clear?.();
        currentTokenDecorationRef.current = ed.createDecorationsCollection([
            {
                range,
                options: {
                    className: 'token-type-active',
                    stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                },
            },
        ]);
    }

    useEffect(() => {
        // when tokens change:
        if (!lexemes?.length) {
            tokenDecorationCollectionRef.current?.clear?.();
            return;
        }
        applyTokenDecorations(lexemes);
    }, [lexemes]);

    useEffect(() => {
        highlightCurrentToken();
    }, [parseStepInfo, lexemes]);

    // cleanup when editor unmounts
    useEffect(() => {
        return () => {
            tokenDecorationCollectionRef.current?.clear?.();
            currentTokenDecorationRef.current?.clear?.();
        };
    }, []);

    function hasChangedGrammarFile(userGrammar: UserGrammar): boolean {
        return Object.values(userGrammar.grammar_files).some(file => file.changed);
    }

    return (
        <div className="bg-white text-zinc-900 flex flex-col h-screen">
            {/* Unhandled Rejection Dialog */}
            <UnhandledRejectionDialog/>

            {/* tailwindcss Safelist */}
            <span className={"bg-blue-300 bg-blue-400 bg-blue-600 bg-violet-300 bg-violet-400 bg-violet-600"}></span>

            {pyProgress !== 'Done' ? <PythonSetupComponent pyProgress={pyProgress} setPyProgress={setPyProgress}/> :
                userGrammar ? <div className="w-screen h-screen">
                    <Allotment vertical={true}>
                        {/* Augmented Parse Tree (React Flow) */}
                        <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
                            <div className="flex flex-col h-full min-h-0">
                                {/* Header */}
                                <header className="shrink-0 pr-0 border-b border-zinc-200 h-24">
                                    <div className="flex items-center gap-4 h-full">

                                        {/* Left content (logos + subtitle) */}
                                        <div className="flex items-center pl-4">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-22"
                                                    src="/paredros_wordmark.png"
                                                    alt="Paredros Icon"
                                                    style={{marginRight: '1px'}}
                                                />
                                            </div>

                                            <span
                                                className="text-sm underline decoration-dotted decoration-blue-700 decoration-2 underline-offset-2 whitespace-nowrap">
                                                Grammar debugging environment
                                            </span>
                                        </div>
                                    </div>
                                </header>


                                <div className="flex-1 min-h-0">
                                    {isGeneratingParser ? (
                                        <LoadingOverlay message="Generating parser..." />
                                    ) : isParsingExpression ? (
                                        <LoadingOverlay message="Parsing expression..." />
                                    ) : nodes && edges ? (
                                        hasChangedGrammarFile(userGrammar) || expressionChanged ? (
                                            hasChangedGrammarFile(userGrammar) ? (
                                                <ParserInputOverlay onClick={generate_parser_save_grammar_files_parse_input} />
                                            ) : (
                                                <ExpressionChangedOverlay onClick={parse_input} />
                                            )
                                        ) : (
                                            <Flow
                                                node={nodes}
                                                edge={edges}
                                                step_backwards={stepBackwards}
                                                step_forwards={stepForwards}
                                                step_to_last_decision={stepToLastDecision}
                                                step_to_next_decision={stepToNextDecision}
                                                current_step={parseStepInfo?.step_id}
                                                step_action={go_to_step}
                                                generate_parser={generate_parser_save_grammar_files_parse_input}
                                                next_parse_step_info={nextInfo}
                                            />
                                        )
                                    ) : generateParserResult ? (
                                        <ParseExpressionOverlay onClick={parse_input} />
                                    ) : (
                                        <GenerateParserOverlay onClick={generate_parser} />
                                    )}
                                </div>
                            </div>
                        </Allotment.Pane>

                        {/* Editor */}
                        <Allotment.Pane minSize={200} maxSize={800} className="h-96 w-full">
                            <Allotment vertical={false}>
                                <Allotment.Pane minSize={300} className="h-md bg-blue-400">
                                    <h2 className="text-2xl p-2 text-gray-100">Grammar Editor</h2>
                                    {/* Grid */}
                                    {userGrammar && providerRef.current ? (
                                        <div className="flex space-x-4 h-full">
                                            {/* File Tree */}
                                            <div className="w-1/4 bg-blue-200 p-2 h-full overflow-auto">
                                                {/* Follow Parser toggle */}
                                                <Button
                                                    // solid blue when active, outline when inactive
                                                    {...(followParser ? {color: 'blue'} : {outline: true})}
                                                    onClick={() => setFollowParser(v => !v)}
                                                    aria-pressed={followParser}
                                                    title={followParser ? 'Stop following parser location' : 'Follow parser location'}
                                                >
                                                    {followParser ? 'Following Parser' : 'Follow Parser'}
                                                </Button>
                                                <UncontrolledTreeEnvironment
                                                    dataProvider={providerRef.current}
                                                    // @ts-ignore
                                                    getItemTitle={item => {
                                                        const file = userGrammar?.grammar_files[item.index];
                                                        return (
                                                            <>
                                                                {item.data}
                                                                {file && file.changed && (
                                                                    <span
                                                                        className="ml-1 inline-block w-2 h-2 bg-blue-500 rounded-full"/>
                                                                )}
                                                            </>
                                                        );
                                                    }}
                                                    viewState={{}}
                                                    onSelectItems={(items) => {
                                                        if (items.length > 0) {
                                                            const selectedFile = userGrammar?.grammar_files[items[0]];
                                                            if (selectedFile) {
                                                                setFollowParser(false);
                                                                setActiveFileIndex(String(items[0]));
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div className="text-gray-900 transition duration-200">
                                                        <Tree treeId="tree-1" rootItem="root"
                                                              treeLabel="Tree Example"/>
                                                    </div>
                                                </UncontrolledTreeEnvironment>
                                            </div>
                                            {/* Grammar Editor */}
                                            <div className="w-3/4 h-full">
                                                <Editor
                                                    className="w-full h-full"
                                                    language={"antlr4"}
                                                    onMount={handleGrammarEditorDidMount}
                                                    value={editorContent}
                                                    onChange={handleEditorChange}
                                                    beforeMount={(monaco) => {
                                                        // Register the custom ANTLR4 language with Monaco
                                                        monaco.languages.register({id: 'antlr4'});
                                                        monaco.languages.setMonarchTokensProvider('antlr4', antlr4MonarchLanguage);
                                                    }}
                                                    options={{
                                                        wordWrap: "on",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (<LoadGrammarOverlay onClick={load_grammar_file}/>)}
                                </Allotment.Pane>
                                <Allotment.Pane minSize={200} className="h-md bg-violet-500">
                                    <div className="p-2 border-b border-zinc-200 flex justify-between items-center">
                                        <h2 className="text-2xl text-white">Expression</h2>
                                        <div className="flex gap-2 items-center">
                                            <Button 
                                                color="violet" 
                                                onClick={load_input_file}
                                                className="text-sm"
                                            >
                                                Load Input File
                                            </Button>
                                            <Select 
                                                value={expressionLanguage}
                                                onChange={(e) => setExpressionLanguage(e.target.value)}
                                                className="text-sm"
                                            >
                                                <option value="plaintext">Plain Text</option>
                                                <option value="xml">XML</option>
                                                <option value="json">JSON</option>
                                                <option value="javascript">JavaScript</option>
                                                <option value="typescript">TypeScript</option>
                                                <option value="python">Python</option>
                                                <option value="java">Java</option>
                                                <option value="cpp">C++</option>
                                                <option value="csharp">C#</option>
                                                <option value="html">HTML</option>
                                                <option value="css">CSS</option>
                                                <option value="sql">SQL</option>
                                                <option value="markdown">Markdown</option>
                                            </Select>
                                        </div>
                                    </div>
                                    {/* Expression Editor */}
                                    <Editor className="w-full h-full"
                                            language={expressionLanguage}
                                            options={{
                                                wordWrap: "on",
                                            }}
                                            value={expressionContent}
                                            onMount={handleExpressionEditorDidMount}
                                            onChange={handleExpressionChange}/>
                                </Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
                    </Allotment>
                </div> : <BigLoadGrammarOverlay onClick={load_grammar_file}/>
            }
        </div>
    );
}

export default App;