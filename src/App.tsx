import { useState } from "react";
import './App.css';
import { Button } from './ui/button';
import Editor from '@monaco-editor/react';
import { grammarFiles } from "./constants";

function App() {
  // Initial file: a Grammar file with default content.
  const [files, setFiles] = useState(grammarFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // Add a new file with default "Grammar" content.
  const addFile = () => {
    const newFile = {
      name: `Grammar${files.length + 1}`,
      language: "antlr4",
      content: "Grammar",
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length); // switch to the new file
  };

  // Update the content of the active file when the editor changes.
  const handleEditorChange = (value: any) => {
    setFiles(files.map((file, index) => {
      if (index === activeFileIndex) {
        return { ...file, content: value };
      }
      return file;
    }));
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="p-4 border-b border-zinc-200 flex items-center gap-2">
        <div className="flex gap-2">
          <Button color="indigo">Generate Parser</Button>
          <Button color="indigo">Parse Input File</Button>
          <Button color="blue" onClick={addFile}>Add File</Button>
        </div>
      </header>

      {/* Big preview container */}
      <div className="border border-zinc-200 w-full h-64 mb-4">
        {/* Empty container for the big preview */}
      </div>

      <div className="w-64 mx-auto">
        <Button color="green" className="mr-6">Step Back</Button>
        <Button color="green" className="ml-6">Step Forward</Button>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* File Tabs */}
          <div className="p-2 border-b border-zinc-200">
            {files.map((file, index) => (
              <Button
                color={activeFileIndex === index ? "green" : "zinc"}
                key={index}
                className={`mr-2 p-2 rounded`}
                onClick={() => setActiveFileIndex(index)}
              >
                {file.name}
              </Button>
            ))}
          </div>
          <Editor
            height="90vh"
            language={files[activeFileIndex].language}
            value={files[activeFileIndex].content}
            onChange={handleEditorChange}
          />
        </div>
        <div>
          <div className="p-2 border-b border-zinc-200">
          <Button
                color="blue"
                className={`mr-2 p-2 rounded`}
                onClick={() => {}}
              >
                Load Input File from Disk
              </Button>
          </div>
          <Editor height="90vh" defaultLanguage="plain" defaultValue="Input Text" />
        </div>
      </div>
    </div>
  );
}

export default App;