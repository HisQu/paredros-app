import {useEffect, useRef, useState} from "react";
// Tauri
import {invoke} from "@tauri-apps/api/core";
import {open} from '@tauri-apps/plugin-dialog';
import {BaseDirectory, writeTextFile} from '@tauri-apps/plugin-fs';
// UI Components
import './App.css';
import Flow from "./components/FlowPlot.tsx";
import {Button} from './components/ui/button.tsx';
import {BeakerIcon, BoltIcon, FolderOpenIcon} from "@heroicons/react/24/outline";
import UnhandledRejectionDialog from "./components/UnhandledRejectionDialog.tsx";
// Interfaces
import {ParseStepInfo, UserGrammar} from "./interfaces/UserGrammar.ts";
import {ParseTreeNode} from "./interfaces/ParseTreeNode.ts";
// Mockup/Helper values
import {antlr4MonarchLanguage, sampleInputText, tempFileName} from "./constants";
// Code Editor
import Editor, {OnMount} from '@monaco-editor/react';
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

    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
    const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);

    const decorationCollectionRef = useRef();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
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
     * Afterwards we can call methods of the ParseInformation instance as we wish.
     * 4. generate_parser
     * 5. parse, which parses a specific input
     *
     *
     **/


    async function load_grammar_file() {
        // DEBUG
        console.log("load_grammar_file")

        // Reset all state values which hold parse tree information, parseInformation instance id, etc.

        setEdges(undefined);
        setNodes(undefined);
        setGenerateParserResult(undefined);
        setParseInfo(undefined);

        const file = await open({
            multiple: false,
            directory: false,
        });

        if (file) {
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

    // expression editor content
    const [expressionContent, setExpressionContent] = useState(sampleInputText);

    // grammar editor content
    const [editorContent, setEditorContent] = useState<string>("");
    useEffect(() => {
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
    const providerRef = useRef<GrammarFilesDataProvider>();
    useEffect(() => {
        if (!userGrammar) return;

        const map = buildItemsFromUserGrammar(userGrammar);

        if (!providerRef.current) {
            providerRef.current = new GrammarFilesDataProvider(map);
        } else {
            providerRef.current.setItems(map);
        }
    }, [userGrammar]);

    /*
    async function get_parse_tree() {
      setParseTree(await invoke("get_parse_tree", { id: parseInfo }));
    }
    */

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

    async function step_forwards() {
        // DEBUG
        console.log("Step Forwards")
        await invoke("step_forwards", {id: parseInfo, step: 1})
        await get_json_parse_tree();
    }

    async function step_backwards() {
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

    function testDecoration() {
        if (monacoRef.current) {
            decorationCollectionRef.current = editorRef.current.createDecorationsCollection([
                {
                    range: new monacoRef.current.Range(3, 1, 3, 1),
                    options: {
                        beforeContentClassName: "my-inline-label"
                    }
                }
            ]);
        }
    }

    return (
        <div className="bg-white text-zinc-900">
            {/* Unhandled Rejection Dialog */}
            <UnhandledRejectionDialog />

            {/* tailwindcss Safelist */}
            <span className={"bg-blue-300 bg-blue-400 bg-violet-300 bg-violet-400"}></span>

            <span className="bg-violet-300"></span>
            {/* Header */}
            <header className="p-4 border-b border-zinc-200 grid grid-cols-1 gap-2">
                <div className="flex gap-2 w-full h-10 items-center">
                    <h1 className="text-2xl font-bold text-middle">πάρεδρος</h1>
                    <span
                        className="text-sm underline decoration-dotted decoration-blue-700 decoration-2 underline-offset-2">
            Grammar debugging environment
          </span>
                    <Button color="lime" onClick={load_grammar_file}>Load a grammar file</Button>
                    <Button color="indigo" onClick={generate_parser_and_save_grammar_files}>Generate Parser (and save
                        grammar files)</Button>
                    <Button color="amber" onClick={parse_input}>Parse Input File</Button>
                </div>
            </header>
            {userGrammar ? <div className="w-screen h-screen">
                <div className="flex justify-center gap-2 font-mono bg-violet-500 text-3xl text-gray-100 p-8 h-24">

                </div>
                <Allotment vertical={true}>
                    {/* Augmented Parse Tree */}
                    <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
                        {(nodes && edges) /* The input has been parsed, and there is a parser */
                            ? (<Flow node={nodes} edge={edges} step_backwards={step_backwards}
                                     step_forwards={step_forwards} current_step={parseInt(info?.step_id || "")}/>) : (
                                (generateParserResult) ? (
                                    <div className="text-center text-xl bg-orange-100 h-full p-4">
                                        <button
                                            type="button"
                                            onClick={parse_input}
                                            className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                                        >
                                            <BoltIcon className="mx-auto size-12"/>
                                            <span className="mt-2 block font-semibold text-gray-900">
                      Now, you can <span className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">parse the expression</span>
                    </span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center text-xl bg-green-100 h-full p-4">
                                        <button
                                            type="button"
                                            onClick={generate_parser}
                                            className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                                        >
                                            <BeakerIcon className="mx-auto size-12"/>
                                            <span className="mt-2 block font-semibold text-gray-900">
                    The next step is to <span className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">generate the parser</span>
                  </span>
                                        </button>
                                    </div>)
                            )}
                    </Allotment.Pane>

                    {/* Editor */}
                    <Allotment.Pane minSize={100} className="h-96 w-full">
                        <Allotment vertical={false}>
                            <Allotment.Pane minSize={300} className="h-md bg-blue-400">
                                <h2 className="text-2xl p-2 text-gray-100">Grammar Editor</h2>
                                {/* Grid */}
                                {userGrammar && providerRef.current ? (
                                    <div className="flex space-x-4">
                                        <div className="w-1/4">
                                            {/* File Tree */}
                                            <div className="bg-blue-200 p-2 h-full overflow-auto">
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
                                                            console.log("selected items", userGrammar?.grammar_files[items[0]]);
                                                            const selectedFile = userGrammar?.grammar_files[items[0]];
                                                            if (selectedFile) {
                                                                console.log("setactivefileinded", String(items[0]))
                                                                setActiveFileIndex(String(items[0]));
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div className="text-gray-900 transition duration-200">
                                                        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example"/>
                                                    </div>
                                                </UncontrolledTreeEnvironment>
                                            </div>
                                        </div>
                                        {/* Grammar Editor */}
                                        <div className="w-3/4">
                                            <Button color={"amber"} onClick={testDecoration}>Test</Button>
                                            <Editor
                                                className="w-full"
                                                height="82vh"
                                                language={"antlr4"}
                                                onMount={handleEditorDidMount}
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
                                ) : (
                                    <div className="text-center text-xl bg-blue-200 h-full p-4">
                                        <button
                                            type="button"
                                            onClick={load_grammar_file}
                                            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                                        >
                                            <FolderOpenIcon className="mx-auto size-12"/>
                                            <span className="mt-2 block text-sm font-semibold text-gray-900">Load a grammar file</span>
                                        </button>
                                    </div>
                                )}
                            </Allotment.Pane>
                            <Allotment.Pane minSize={200} className="h-md bg-violet-500">
                                <div className="p-2 border-b border-zinc-200">
                                    <h2 className="text-2xl text-white">Expression</h2>
                                </div>
                                <Editor height="90vh"
                                        defaultLanguage="plain"
                                        options={{
                                            wordWrap: "on",
                                        }}
                                        onChange={(value) => setExpressionContent(value || "")}
                                        defaultValue={sampleInputText}/>
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>
                </Allotment>
            </div> : <div className="text-center mt-12">
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="mx-auto size-12 text-gray-400"
                >
                    <path
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        strokeWidth={2}
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No grammar loaded</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by loading a grammar.</p>
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={load_grammar_file}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <FolderOpenIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5"/>
                        Open Grammar file
                    </button>
                </div>
            </div>}
        </div>
    );
}

export default App;