import { useState, useEffect, useMemo } from "react";
// Tauri
import { invoke } from "@tauri-apps/api/core";
import * as path from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
// UI Components
import './App.css';
import Flow from "./components/FlowPlot.tsx";
import { Button } from './components/ui/button.tsx';
// Interfaces
import { UserGrammar } from "./interfaces/UserGrammar.ts";
// Mockup/Helper values
import { tempFileName, antlr4MonarchLanguage, sampleInputText, initialEdges, initialNodes } from "./constants";
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
// Code Editor
import Editor from '@monaco-editor/react';
// Allotment (Resizable Panes)
import { Allotment } from "allotment";
import "allotment/dist/style.css";
// React Complex Tree
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
// END IMPORTS and constants

function App() {
  // Initial file: a Grammar file with default content.
  const [activeFileIndex, setActiveFileIndex] = useState<String>();

  // Update the content of the active file when the editor changes.
  const handleEditorChange = (value: any) => {
    if (userGrammar) {
      userGrammar.grammar_files[String(activeFileIndex)].content = value;
    }
  };

  const [grammarFileLocation, setGrammarFileLocation] = useState("");

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
  const [parseTree, setParseTree] = useState();
  const [userGrammar, setUserGrammar] = useState<UserGrammar>();

  // expression editor content (other editor is handled separately)
  const [expressionContent, setExpressionContent] = useState(sampleInputText);

  async function get_parse_info() {
    // DEBUG
    console.log("get_parse_info")
    setParseInfo(await invoke("get_parse_info", { grammar: grammarFileLocation }));
  }

  async function parse_input() {
    // save the file to the temporary location
    await writeTextFile(tempFileName, expressionContent, { baseDir: BaseDirectory.Temp });

    const _p = await path.join(await path.tempDir(), tempFileName);

    // call parse input
    await invoke("parse_input", {
      id: parseInfo,
      input: _p
    })
  }

  // instead of calling immediately
  // which results in errors
  useEffect(() => {
    if (grammarFileLocation) {
      get_parse_info();
    }
  }, [grammarFileLocation]);

  useEffect(() => {
    if (parseInfo) {
      get_user_grammar();
    }
  }, [parseInfo]);

  const treeItemsFromGrammar = useMemo(() => buildItemsFromUserGrammar(userGrammar), [userGrammar]);
  // Create the data provider for the tree, which also handles item updates
  const dataProvider = useMemo(
    () =>
      new StaticTreeDataProvider(treeItemsFromGrammar, (item, data) => ({
        ...item,
        data
      })),
    [treeItemsFromGrammar]
  );

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

  return (
    <div className="bg-white text-zinc-900" style={{ height: "calc(100vh - 3rem)" }}>
      {/* Header */}
      <header className="p-4 border-b border-zinc-200 grid grid-cols-1 gap-2">
        <div className="flex gap-2 w-full h-10">
          <Button color="lime" onClick={load_grammar_file}>Load a grammar file</Button>
          <Button color="indigo" onClick={get_parse_info}>Generate Parser</Button>
          <Button color="indigo" onClick={parse_input}>Parse Input File</Button>
        </div>

        <div className="flex justify-center gap-2 font-mono bg-violet-500 text-3xl text-gray-100 p-8 h-24">
          Henricus de ●<span className="underline underline-offset-4 decoration-violet-200 font-black hover:decoration-4">Bocholdia</span>
        </div>
      </header>
      <Allotment vertical={true}>
        {/* Augmented Parse Tree */}
        <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
          <Flow node={initialNodes} edge={initialEdges} />
        </Allotment.Pane>

        {/* Editor */}
        <Allotment.Pane minSize={100} className="h-96 w-full">
          <Allotment vertical={false}>
            <Allotment.Pane minSize={300} className="h-md bg-blue-400">
              <h2 className="text-2xl p-2 text-gray-100">Grammar Editor</h2>
              {/* Grid */}
              {userGrammar ? (
                <div className="flex space-x-4">
                  <div className="w-1/4">
                    {/* File Tree */}
                    <div className="bg-blue-200 p-2 h-full overflow-auto">
                      <UncontrolledTreeEnvironment
                        dataProvider={dataProvider}
                        getItemTitle={item => item.data}
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
                <div className="text-center text-xl pt-10 bg-blue-200 h-full">
                  Load a grammar first
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
    </div>
  );
}

export default App;