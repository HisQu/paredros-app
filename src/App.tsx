import { useState, useCallback } from "react";
// Tauri
import { invoke } from "@tauri-apps/api/core";
import * as path from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
// UI Components
import './App.css';
import { Button } from './ui/button';
// Interfaces
import {UserGrammar} from "./interfaces/UserGrammar.ts";
// Mockup/Helper values
import { tempFileName, grammarFiles, antlr4MonarchLanguage, sampleInputText, longTreeTemplate, initialEdges, initialNodes, nodeHeight, nodeWidth } from "./constants";
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
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
// React Flow
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
  ConnectionLineType
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
// END IMPORTS and constants

function App() {
  // Initial file: a Grammar file with default content.
  const [files, setFiles] = useState(grammarFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // Add a new file with default "Grammar" content.
  const addFile = (name: string) => {
    const newFile = {
      name: name,
      language: "antlr4",
      content: "// new file",
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length); // switch to the new file
  };

  const deleteFile = (index: any) => {
    const newFiles = files.filter((_, i) => i !== index);
    if (newFiles.indexOf(index) === -1) {
      setActiveFileIndex(newFiles.length - 1);
    }
    setFiles(newFiles);
  }

  // Update the content of the active file when the editor changes.
  const handleEditorChange = (value: any) => {
    setFiles(files.map((file, index) => {
      if (index === activeFileIndex) {
        return { ...file, content: value };
      }
      return file;
    }));
  };

  const getLayoutedElements = (nodes: any, edges: any, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
   
    nodes.forEach((node:any) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
   
    edges.forEach((edge:any) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
   
    dagre.layout(dagreGraph);
   
    const newNodes = nodes.map((node:any) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
   
      return newNode;
    });
   
    return { nodes: newNodes, edges };
  };
   
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
  );

  const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
   
    const onConnect = useCallback(
      (params:any) =>
        setEdges((eds) =>
          addEdge(
            { ...params, type: ConnectionLineType.SmoothStep, animated: true },
            eds,
          ),
        ),
      [],
    );
    const onLayout = useCallback(
      (direction:any) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(nodes, edges, direction);
   
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      },
      [nodes, edges],
    );
   
    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        style={{ backgroundColor: "#F7F9FB" }}
      >
        <Panel position="top-right" className="grid grid-cols-2 gap-4">
          <Button onClick={() => onLayout('TB')} className="mr-2">vertical layout</Button>
          <Button onClick={() => onLayout('LR')}>horizontal layout</Button>
          <Button color="green">Step Back</Button>
          <Button color="green">Step Forward</Button>
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    );
  };

  const [grammarFileLocation, setFileLocation] = useState("");

  async function load_grammar_file() {
    const file = await open({
      multiple: false,
      directory: false,
    });

    if (file) {
      setFileLocation(file);
      await get_parse_info();
    }
  }

  // parse info and user grammar variables which are filled after loading a grammar and generating a parser
  const [parseInfo, setParseInfo] = useState("");
  const [parseTree, setParseTree] = useState();
  const [userGrammar, setUserGrammar] = useState<UserGrammar>();

  // expression editor content (other editor is handled separately)
  const [expressionContent, setExpressionContent] = useState(sampleInputText);

  async function get_parse_info() {
    setParseInfo(await invoke("get_parse_info", { grammar: grammarFileLocation }))
    get_user_grammar();
  }

  async function parse_input() {
    // save the file to the temporary location
    const res = await writeTextFile(tempFileName, expressionContent, { baseDir: BaseDirectory.Temp });
    console.log("writeTextFile response", res);

    console.log("path", await path.join(await path.tempDir(), tempFileName))

    // call parse input
    await invoke("parse_input", { 
      id: parseInfo, 
      input: await path.join(await path.tempDir(), tempFileName) 
    })
  }

  /*
  async function get_parse_tree() {
    setParseTree(await invoke("get_parse_tree", { id: parseInfo }));
  }
  */

  async function get_user_grammar() {
    setUserGrammar(await invoke("get_user_grammar", { id: parseInfo }))
    setFiles([]);
    if (userGrammar) {
      Object.entries(userGrammar.grammar_files).forEach(([fileKey, grammarFile]) => {
        console.log(`Processing file key: ${fileKey}`);
        console.log(`Path: ${grammarFile.path}`);
        console.log(`Directory: ${grammarFile.directory}`);
        console.log(`Imports: ${grammarFile.imports.join(", ")}`);
    
        // Iterate over each GrammarRule in the rules object of the current GrammarFile
        Object.entries(grammarFile.rules).forEach(([ruleKey, rule]) => {
          console.log(`  Rule key: ${ruleKey}`);
          console.log(`    Name: ${rule.name}`);
          console.log(`    Content: ${rule.content}`);
          console.log(`    Lines: ${rule.start_line} - ${rule.end_line}`);
          console.log(`    Positions: ${rule.start_pos} - ${rule.end_pos}`);
        });

        addFile(grammarFile.path);
      });
    }
  }

  return (
    <div className="bg-white text-zinc-900" style={{ height: "calc(100vh - 3rem)" }}>
      {/* Header */}
      <header className="p-4 h-96 border-b border-zinc-200 grid grid-cols-1 gap-2">
        <div className="flex gap-2 w-full">
          <Button color="lime" onClick={load_grammar_file}>Load a grammar file</Button>
          <Button color="indigo" onClick={get_parse_info}>Generate Parser</Button>
          <Button color="indigo" onClick={parse_input}>Parse Input File</Button>
        </div>

        <div className="flex justify-center gap-2 font-mono bg-violet-100 text-gray-800 p-4">
          Henricus de ●<span className="underline underline-offset-4 decoration-violet-400 font-black hover:decoration-4">Bocholdia</span>
          { grammarFileLocation } { parseInfo } { parseTree }
        </div>
      </header>
      <Allotment vertical={true}>
        {/* Augmented Parse Tree */}
        <Allotment.Pane minSize={100} className="border border-zinc-200 w-full h-64 mb-4">
          <Flow />
        </Allotment.Pane>

        {/* Editor */}
        <Allotment.Pane minSize={100} className="h-96 w-full">
          <Allotment vertical={false}>
            <Allotment.Pane minSize={300} className="h-md bg-blue-400">
              <h2 className="text-2xl p-2 text-gray-100">Grammar Editor</h2>
              {/* Grid */}
              <div className="flex space-x-4">
                <div className="w-1/4">
                  {/* File Tree */}
                  <div className="bg-blue-200 p-2 h-full overflow-auto">

                    <UncontrolledTreeEnvironment
                      dataProvider={new StaticTreeDataProvider(readTemplate(longTreeTemplate).items, (item, data) => ({ ...item, data }))}
                      getItemTitle={item => item.data}
                      viewState={{}}
                      onSelectItems={(items) => {
                        if (items.length > 0) {
                          const selectedFile = files.find(file => file.name === items[0]);
                          if (selectedFile) {
                            setActiveFileIndex(files.indexOf(selectedFile));
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
                    language={files[activeFileIndex].language}
                    value={files[activeFileIndex].content}
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