import { useState, useEffect, useRef } from "react";
// Tauri
import { invoke } from "@tauri-apps/api/core";
import * as path from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
// UI Components
import './App.css';
import Flow from "./components/FlowPlot.tsx";
import { Button } from './components/ui/button.tsx';
import { BeakerIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
// Interfaces
import { UserGrammar } from "./interfaces/UserGrammar.ts";
import { ParseTreeNode } from "./interfaces/ParseTreeNode.ts";
// Mockup/Helper values
import { tempFileName, antlr4MonarchLanguage, sampleInputText } from "./constants";
// Code Editor
import Editor from '@monaco-editor/react';
// Allotment (Resizable Panes)
import { Allotment } from "allotment";
import "allotment/dist/style.css";
// React Complex Tree
import { UncontrolledTreeEnvironment, Tree, TreeItem } from 'react-complex-tree';
import { GrammarFilesDataProvider } from "./components/GrammarFilesDataProvider.ts";
import 'react-complex-tree/lib/style-modern.css';
// ReactFlow Nodes
import { Edge } from '@xyflow/react';
// END IMPORTS and constants

const readTemplate = (template: any, data: any = { items: {} }): any => {
  for (const [key, value] of Object.entries(template)) {
    // eslint-disable-next-line no-param-reassign
    data.items[key] = {
      index: key,
      canMove: true,
      isFolder: value !== null,
      children:
        value !== null
          ? Object.keys(value as Record<string, unknown>)
          : undefined,
      data: key,
      canRename: true,
    };

    if (value !== null) {
      readTemplate(value, data);
    }
  }
  return data;
};

function getCommonBasename(paths: string[]): string {
  if (paths.length === 0) {
    return ""; // Return an empty string if there are no paths
  }

  // Normalize paths and split into components
  const splitPaths = paths.map(path => path.split('/'));

  // Find the common base path
  let minLength = Math.min(...splitPaths.map(p => p.length));
  let commonBaseIndex = 0;

  for (let i = 0; i < minLength; i++) {
    const segment = splitPaths[0][i];
    if (!splitPaths.every(p => p[i] === segment)) {
      break;
    }
    commonBaseIndex = i;
  }

  // Join the common base path into a string
  return splitPaths[0].slice(0, commonBaseIndex + 1).join('/') + '/';
}

// Convert userGrammar.grammar_files into the item structure expected by react-complex-tree
function buildItemsFromUserGrammar(userGrammar: UserGrammar | undefined): Record<string, TreeItem> {
  // DEBUG
  console.log("buildItemsFromUserGrammar");

  // The keys of userGrammar.grammar_files become child items under the "root"
  const fileNames = Object.keys(userGrammar?.grammar_files ?? []);

  const commonBasename = getCommonBasename(fileNames);

  // The "root" item
  const rootItem: TreeItem = {
    index: 'root',
    data: 'Root Node',
    children: fileNames
  };

  // Each file becomes its own item
  const fileItems = fileNames.reduce<Record<string, TreeItem>>((acc, fileName) => {
    acc[fileName] = {
      index: fileName,
      data: fileName.replace(commonBasename, ''),
      children: []
    };
    return acc;
  }, {});

  return {
    root: rootItem,
    ...fileItems
  };
}

function transformJsonToParseTree(root: any): { nodes: ParseTreeNode[]; edges: Edge[] } {
  const nodes: ParseTreeNode[] = [];
  const edges: Edge[] = [];

  /**
   * Recursively traverses the JSON tree to generate nodes and edges.
   * @param node - The current JSON node.
   * @param parent - The parent JSON node (or null for the root).
   * @param depth - The current depth (used to compute the x position).
   * @param index - The index among siblings (used to compute the y position).
   */
  function traverse(node: any, parent: any | null, depth: number, index: number): void {
    // Compute a simple layout: x based on depth, y based on sibling index.
    const x = depth * 200;
    const y = index * 100;

    // Create a node object and add it to the nodes list.
    nodes.push({
      id: node.id,
      position: { x, y },
      data: {
        nodeType: node.node_type,
        ruleName: node.rule_name,
        token: node.token,
        traceSteps: node.trace_steps
      }
    });

    // If there is a parent, create an edge from the parent to the current node.
    if (parent) {
      edges.push({
        id: `e${parent.id}-${node.id}`,
        source: parent.id,
        target: node.id
      });
    }

    // Recursively process children (if any).
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any, childIndex: number) => {
        traverse(child, node, depth + 1, childIndex);
      });
    }
  }

  // Start the recursion with the root node.
  traverse(root, null, 0, 0);

  return { nodes, edges };
}

function App() {
  // Initial file: a Grammar file with default content.
  const [activeFileIndex, setActiveFileIndex] = useState<String>();

  // Update the content of the active file when the editor changes.
  const handleEditorChange = (value: any) => {
    setUserGrammar(prev => {
      if (!prev) return prev;
      const k = String(activeFileIndex);
      const updated = {
        ...prev,
        grammar_files: {
          ...prev.grammar_files,
          [k]: { ...prev.grammar_files[k], content: value ?? '', changed: true }
        }
      };
      return updated;
    });
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

    const file = await open({
      multiple: false,
      directory: false,
    });

    if (file) {
      setGrammarFileLocation(file);
    }
  }

  // parse info and user grammar variables which are filled after loading a grammar and generating a parser
  const [parseInfo, setParseInfo] = useState("");
  const [generateParserResult, setGenerateParserResult] = useState("");
  const [userGrammar, setUserGrammar] = useState<UserGrammar>();

  // expression editor content (other editor is handled separately)
  const [expressionContent, setExpressionContent] = useState(sampleInputText);

  async function get_parse_info() {
    // DEBUG
    console.log("get_parse_info");

    // reset the parse tree
    setNodes(undefined);
    setEdges(undefined);

    saveGrammarFiles();

    setParseInfo(await invoke("get_parse_info", { grammar: grammarFileLocation }));
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
    await writeTextFile(tempFileName, expressionContent, { baseDir: BaseDirectory.Temp });

    const _p = await path.join(await path.tempDir(), tempFileName);

    // call parse input
    const parse_input_result = await invoke("parse_input", {
      id: parseInfo,
      input: _p
    });

    // DEBUG
    console.log("parse_input_result", parse_input_result);

    if (parse_input_result === "Parsed successfully") {
      get_json_parse_tree();
    }
  }

  // instead of calling immediately
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

    const _g: UserGrammar = await invoke("get_user_grammar", { id: parseInfo })
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
    await invoke("step_forwards", { id: parseInfo, step: 1 })
    await get_json_parse_tree();
  }

  async function step_backwards() {
    // DEBUG
    console.log("Step Backwards")
    await invoke("step_backwards", { id: parseInfo })
    await get_json_parse_tree();
  }

  async function get_json_parse_tree() {
    const { nodes: _n, edges: _e } = transformJsonToParseTree(await invoke("get_json_parse_tree", { id: parseInfo }))
    setNodes(_n);
    setEdges(_e);
  }

  const [nodes, setNodes] = useState<ParseTreeNode[]>();
  const [edges, setEdges] = useState<Edge[]>();

  return (
    <div className="bg-white text-zinc-900">
      <span className="bg-violet-300"></span>
      {/* Header */}
      <header className="p-4 border-b border-zinc-200 grid grid-cols-1 gap-2">
        <div className="flex gap-2 w-full h-10 items-center">
          <h1 className="text-2xl font-bold text-middle">πάρεδρος</h1>
          <span className="text-sm underline decoration-dotted decoration-blue-700 decoration-2 underline-offset-2">
            Grammar debugging environment
          </span>
          <Button color="lime" onClick={load_grammar_file}>Load a grammar file</Button>
          <Button color="indigo" onClick={generate_parser_and_save_grammar_files}>Generate Parser (and save grammar files)</Button>
          <Button color="amber" onClick={parse_input}>Parse Input File</Button>
        </div>
      </header>
      {userGrammar ? <div className="w-screen h-screen">
        <div className="flex justify-center gap-2 font-mono bg-violet-500 text-3xl text-gray-100 p-8 h-24">

        </div>
        <Allotment vertical={true}>
          {/* Augmented Parse Tree */}
          <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
            {(nodes && edges) ? (<Flow node={nodes} edge={edges} step_backwards={step_backwards} step_forwards={step_forwards} />) : (
              (
                <div className="text-center text-xl bg-orange-100 h-full p-4">
                  <button
                    type="button"
                    onClick={parse_input}
                    className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-48 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                  >
                    <BeakerIcon className="mx-auto size-12" />
                    <span className="mt-2 block font-semibold text-gray-900">
                      The next step is to <span className="underline decoration-4 underline-offset-2 decoration-dotted decoration-blue-700">parse the expression</span>
                    </span>
                  </button>
                </div>
              )
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
                                  <span className="ml-1 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </>
                            );
                          }}
                          viewState={{}}
                          onSelectItems={(items) => {
                            if (items.length > 0) {
                              const selectedFile = userGrammar.grammar_files[items[0]];
                              if (selectedFile) {
                                setActiveFileIndex(String(items[0]));
                              }
                            }
                          }}
                        >
                          <div className="text-gray-900 transition duration-200">
                            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
                          </div>
                        </UncontrolledTreeEnvironment>
                      </div>
                    </div>
                    {/* Grammar Editor */}
                    <div className="w-3/4">
                      <Editor
                        className="w-full"
                        height="82vh"
                        language={"antlr4"}
                        value={userGrammar.grammar_files[String(activeFileIndex)]?.content ?? ""}
                        onChange={handleEditorChange}
                        beforeMount={(monaco) => {
                          // Register the custom ANTLR4 language with Monaco
                          monaco.languages.register({ id: 'antlr4' });
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
                      <FolderOpenIcon className="mx-auto size-12" />
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
                  defaultValue={sampleInputText} />
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
            <FolderOpenIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
            Open Grammar file
          </button>
        </div>
      </div>}
    </div>
  );
}

export default App;