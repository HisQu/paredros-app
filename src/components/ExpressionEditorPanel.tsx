import Editor, { OnMount } from '@monaco-editor/react';
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { FolderOpenIcon } from "@heroicons/react/24/outline";

interface ExpressionEditorPanelProps {
    expressionContent: string;
    expressionLanguage: string;
    setExpressionLanguage: (language: string) => void;
    handleExpressionEditorDidMount: OnMount;
    handleExpressionChange: (value: any) => void;
    load_input_file: () => Promise<void>;
    showTokenLabels: boolean;
    setShowTokenLabels: (value: boolean) => void;
}

export function ExpressionEditorPanel({
    expressionContent,
    expressionLanguage,
    setExpressionLanguage,
    handleExpressionEditorDidMount,
    handleExpressionChange,
    load_input_file,
    showTokenLabels,
    setShowTokenLabels,
}: ExpressionEditorPanelProps) {
    return (
        <>
            <div className="p-2 border-b border-zinc-200 flex justify-between items-center">
                <h2 className="text-2xl text-white">Expression</h2>
                <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-1 text-white text-sm cursor-pointer">
                        <Checkbox
                            checked={showTokenLabels}
                            onChange={setShowTokenLabels}
                            color="violet"
                        />
                        <span>Show Labels</span>
                    </label>
                    <Button
                        color="violet"
                        onClick={load_input_file}
                        className="text-sm"
                    >
                        <FolderOpenIcon className="w-4 h-4 mr-1 inline-block" />
                    </Button>
                    <Select
                        value={expressionLanguage}
                        onChange={(e) => setExpressionLanguage(e.target.value)}
                        className="text-sm"
                    >
                        <option value="plaintext">Plain Text</option>
                        <option value="xml">XML</option>
                        <option value="json">JSON</option>
                        <option value="html">HTML</option>
                        <option value="markdown">Markdown</option>
                    </Select>
                </div>
            </div>
            {/* Expression Editor */}
            <Editor
                className="w-full h-full"
                language={expressionLanguage}
                options={{
                    wordWrap: "on",
                }}
                value={expressionContent}
                onMount={handleExpressionEditorDidMount}
                onChange={handleExpressionChange}
            />
        </>
    );
}

