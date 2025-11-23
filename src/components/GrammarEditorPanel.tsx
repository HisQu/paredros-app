import Editor, { OnMount } from '@monaco-editor/react';
import { Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { Button } from "./ui/button";
import { UserGrammar } from "../interfaces/UserGrammar";
import { GrammarFilesDataProvider } from "./GrammarFilesDataProvider";
import { LoadGrammarOverlay } from "./ParseTreeOverlays";
import { antlr4MonarchLanguage } from "../constants";

interface GrammarEditorPanelProps {
    userGrammar: UserGrammar | undefined;
    providerRef: React.MutableRefObject<GrammarFilesDataProvider | undefined>;
    activeFileIndex: string | undefined;
    setActiveFileIndex: (index: string | undefined) => void;
    followParser: boolean;
    setFollowParser: (value: boolean | ((prev: boolean) => boolean)) => void;
    editorContent: string;
    handleGrammarEditorDidMount: OnMount;
    handleEditorChange: (value: any) => void;
    load_grammar_file: () => Promise<void>;
}

export function GrammarEditorPanel({
    userGrammar,
    providerRef,
    activeFileIndex,
    setActiveFileIndex,
    followParser,
    setFollowParser,
    editorContent,
    handleGrammarEditorDidMount,
    handleEditorChange,
    load_grammar_file,
}: GrammarEditorPanelProps) {
    if (!userGrammar || !providerRef.current) {
        return <LoadGrammarOverlay onClick={load_grammar_file} />;
    }

    return (
        <>
            <h2 className="text-2xl p-2 text-gray-100">Grammar Editor</h2>
            <div className="flex space-x-4 h-full">
                {/* File Tree */}
                <div className="w-1/4 bg-blue-200 p-2 h-full overflow-auto">
                    {/* Follow Parser toggle */}
                    <Button
                        {...(followParser ? { color: 'blue' } : { outline: true })}
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
                                        <span className="ml-1 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                </>
                            );
                        }}
                        viewState={{
                            ['tree-1']: {
                                selectedItems: activeFileIndex ? [activeFileIndex] : [],
                                expandedItems: ['root'],
                            }
                        }}
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
                            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
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
                            monaco.languages.register({ id: 'antlr4' });
                            monaco.languages.setMonarchTokensProvider('antlr4', antlr4MonarchLanguage);
                        }}
                        options={{
                            wordWrap: "on",
                        }}
                    />
                </div>
            </div>
        </>
    );
}

