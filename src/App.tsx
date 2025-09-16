import {useEffect, useRef, useState} from "react";
// Tauri
import {invoke} from "@tauri-apps/api/core";
import {open} from '@tauri-apps/plugin-dialog';
import {BaseDirectory, writeTextFile} from '@tauri-apps/plugin-fs';
// UI Components
import './App.css';
import Flow, {FlowHandle} from "./components/FlowPlot.tsx";
import UnhandledRejectionDialog from "./components/UnhandledRejectionDialog.tsx";
import PythonSetupComponent from "./components/PythonSetupComponent.tsx";
// Interfaces
import {GrammarRuleLocation, ParseStepInfo, UserGrammar} from "./interfaces/UserGrammar.ts";
import {ParseTreeNode} from "./interfaces/ParseTreeNode.ts";
import type {PySetupProgressType} from "./interfaces/PySetupProgressType.ts"
// Mockup/Helper values
import {antlr4MonarchLanguage, sampleInputText, tempFileName} from "./constants";
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
import {
    GenerateParserOverlay,
    LoadGrammarOverlay,
    BigLoadGrammarOverlay,
    ParserInputOverlay,
    ParseExpressionOverlay
} from "./components/ParseTreeOverlays.tsx";
import {Button} from "./components/ui/button.tsx";

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


    // Refs / References declarations
    const providerRef = useRef<GrammarFilesDataProvider>();
    const flowRef = useRef<FlowHandle>(null);

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
    const expressionDecorationCollectionRef = useRef<editor.IEditorDecorationsCollection>();

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
     * 7. get_parse_step_info, which returns information about the current parse step
     *
     * The meta-information (parse step info) is then stored in the variable "info"
     * 8. update_grammar_rule_decorations, which updates the decorations in the grammar editor
     * 9. update_expression_decorations, which updates the decorations in the expression editor
     *
     **/

    function resetStateVariables() {
        setInfo(undefined);
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
        }
    }

    // parse info and user grammar variables which are filled after loading a grammar and generating a parser
    const [parseInfo, setParseInfo] = useState<string | undefined>();
    const [generateParserResult, setGenerateParserResult] = useState<string | undefined>();
    const [userGrammar, setUserGrammar] = useState<UserGrammar>();
    // values which change with each step
    const [nodes, setNodes] = useState<ParseTreeNode[]>();
    const [edges, setEdges] = useState<Edge[]>();
    const [info, setInfo] = useState<ParseStepInfo>();
    // user interface state
    const [followParser, setFollowParser] = useState<boolean>(false); // default: user controls file switching

    // expression editor content
    const [expressionContent, setExpressionContent] = useState(sampleInputText);

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

        setGenerateParserResult(await invoke("generate_parser", {
            id: parseInfo
        }));
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

        // expand all nodes in the parse tree plot
        if (flowRef.current) {
            // DEBUG
            console.log("expandAll");
            flowRef.current.expandAll();
        }
    }

    async function parse_input() {
        // save the file to the temporary location
        await writeTextFile(tempFileName, expressionContent, {baseDir: BaseDirectory.Temp});

        // call parse input
        const parse_input_result = await invoke("parse_input", {
            id: parseInfo,
            input: expressionContent
        });

        // DEBUG
        console.log("parse_input_result", parse_input_result);

        if (parse_input_result === "Parsed successfully") {
            get_json_parse_tree();
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

    async function get_json_parse_tree() {
        const _response = await invoke("get_json_parse_tree", {id: parseInfo});

        // DEBUG
        console.log("JSON Parse Tree");
        console.log(_response);

        setFollowParser(true);
        const {nodes: _n, edges: _e} = transformJsonToParseTree(_response);
        setNodes(_n);
        setEdges(_e);

        await get_parse_step_info()
    }

    async function get_parse_step_info() {
        const _response = await invoke<ParseStepInfo>("get_parse_step_info", {id: parseInfo});

        // DEBUG
        console.log("Parse Step Info");
        console.log(_response);

        setInfo(_response);
    }

    // Listen on changes to parse step info, and update decorations accordingly
    useEffect(() => {
        const loc = info?.grammar_rule_location;
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
    }, [info, activeFileIndex, followParser]);

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

    function hasChangedGrammarFile(userGrammar: UserGrammar): boolean {
        return Object.values(userGrammar.grammar_files).some(file => file.changed);
    }

    return (
        <div className="bg-white text-zinc-900 flex flex-col h-screen">
            {/* Unhandled Rejection Dialog */}
            <UnhandledRejectionDialog/>

            {/* tailwindcss Safelist */}
            <span className={"bg-blue-300 bg-blue-400 bg-violet-300 bg-violet-400"}></span>

            {pyProgress !== 'Done' ? <PythonSetupComponent pyProgress={pyProgress} setPyProgress={setPyProgress}/> :
                userGrammar ? <div className="w-screen h-screen">
                    <Allotment vertical={true}>
                        {/* Augmented Parse Tree (React Flow) */}
                        <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
                            <div className="flex flex-col h-full min-h-0">
                                {/* Header */}
                                <header className="shrink-0 p-4 border-b border-zinc-200 grid grid-cols-1 gap-2">
                                    <div className="flex gap-2 w-full h-10 items-center">
                                        <h1 className="text-2xl font-bold text-middle">πάρεδρος</h1>
                                        <span
                                            className="text-sm underline decoration-dotted decoration-blue-700 decoration-2 underline-offset-2">
                        Grammar debugging environment
                    </span>
                                    </div>
                                </header>
                                <div
                                    className="shrink-0 flex justify-center gap-2 font-mono bg-violet-500 text-3xl text-gray-100 p-8 h-24">
                                    {info?.input_context_snippet ? info.input_context_snippet : ""}
                                </div>
                                <div className="shrink-0">
                                    {info?.grammar_rule_location ? info.grammar_rule_location.file_path : ""}
                                </div>
                                <div className="flex-1 min-h-0">
                                    {(nodes && edges) /* The input has been parsed, and there is a parser */
                                        ? (hasChangedGrammarFile(userGrammar)
                                            ? (<ParserInputOverlay
                                                onClick={generate_parser_save_grammar_files_parse_input}/>)
                                            :
                                            <Flow ref={flowRef} node={nodes} edge={edges} step_backwards={stepBackwards}
                                                  step_forwards={stepForwards} current_step={info?.step_id}
                                                  step_action={go_to_step}/>)
                                        : ((generateParserResult)
                                                ? (<ParseExpressionOverlay onClick={parse_input}/>)
                                                : (<GenerateParserOverlay onClick={generate_parser}/>)
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
                                    <div className="p-2 border-b border-zinc-200">
                                        <h2 className="text-2xl text-white">Expression</h2>
                                    </div>
                                    {/* Expression Editor */}
                                    <Editor className="w-full h-full"
                                            defaultLanguage="xml"
                                            options={{
                                                wordWrap: "on",
                                            }}
                                            defaultValue={sampleInputText}
                                            onMount={handleExpressionEditorDidMount}
                                            onChange={(value) => setExpressionContent(value || "")}/>
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