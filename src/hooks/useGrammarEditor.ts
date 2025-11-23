import { useRef, useEffect } from "react";
import { OnMount } from '@monaco-editor/react';
import { editor } from "monaco-editor";
import { AppState } from "./useAppState";
import { createGrammarRuleDecoration } from "../utils/monacoDecorations";
import { GrammarRuleLocation } from "../interfaces/UserGrammar";

export function useGrammarEditor(appState: AppState) {
    const { grammarState, parseState, editorState } = appState;

    const grammarEditorRef = useRef<Parameters<OnMount>[0] | null>(null);
    const grammarMonacoRef = useRef<Parameters<OnMount>[1] | null>(null);
    const grammarDecorationCollectionRef = useRef<editor.IEditorDecorationsCollection>();

    const handleGrammarEditorDidMount: OnMount = (editor, monaco) => {
        grammarEditorRef.current = editor;
        grammarMonacoRef.current = monaco;
    };

    const handleEditorChange = (value: any) => {
        grammarState.setUserGrammar(prev => {
            if (!prev) return prev;
            const k = String(grammarState.activeFileIndex);
            return {
                ...prev,
                grammar_files: {
                    ...prev.grammar_files,
                    [k]: { ...prev.grammar_files[k], content: value ?? '', changed: true }
                }
            };
        });
    };

    function updateGrammarRuleDecoration(loc: GrammarRuleLocation) {
        const monaco = grammarMonacoRef.current;
        const ed = grammarEditorRef.current;
        if (!monaco || !ed) return;

        const model = ed.getModel();
        if (!model) return;

        grammarDecorationCollectionRef.current?.clear();

        const decorations = createGrammarRuleDecoration(monaco, model, loc);
        grammarDecorationCollectionRef.current = ed.createDecorationsCollection(decorations);

        // Reveal the range in the editor
        if (decorations.length > 0) {
            ed.revealRangeInCenter(decorations[0].range);
        }
    }

    // useEffect: Update editor content when activeFileIndex or userGrammar changes
    useEffect(() => {
        console.log("Active file index changed:", grammarState.activeFileIndex);

        if (grammarState.userGrammar && grammarState.activeFileIndex) {
            const file = grammarState.userGrammar.grammar_files[String(grammarState.activeFileIndex)];
            if (file) {
                editorState.setEditorContent(file.content);
            }
        }
    }, [grammarState.userGrammar, grammarState.activeFileIndex]);

    // useEffect: Listen to parse step info changes and update decorations
    useEffect(() => {
        const loc = parseState.parseStepInfo?.grammar_rule_location;
        if (!loc) return;

        // Only auto-switch when followParser is enabled
        if (parseState.followParser && grammarState.activeFileIndex !== loc.file_path) {
            grammarState.setActiveFileIndex(loc.file_path);
            return; // let the next run place the decorations after model changes
        }

        // If the currently open file matches the parser location, decorate it
        if (grammarState.activeFileIndex === loc.file_path) {
            updateGrammarRuleDecoration(loc);
        } else {
            // Different file is open and follow is OFF: clear any stale decorations
            grammarDecorationCollectionRef.current?.clear?.();
        }
    }, [parseState.parseStepInfo, grammarState.activeFileIndex, parseState.followParser]);

    return {
        grammarEditorRef,
        grammarMonacoRef,
        handleGrammarEditorDidMount,
        handleEditorChange,
    };
}