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
    const isUserTypingRef = useRef<boolean>(false);
    const lastLoadedFileIndexRef = useRef<string | undefined>(undefined);

    const handleGrammarEditorDidMount: OnMount = (editor, monaco) => {
        grammarEditorRef.current = editor;
        grammarMonacoRef.current = monaco;
    };

    const handleEditorChange = (value: any) => {
        console.log("[useGrammarEditor] handleEditorChange called, activeFileIndex:", grammarState.activeFileIndex);

        // Mark that user is typing to prevent editor content reset
        isUserTypingRef.current = true;

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

        // Reset the typing flag after a short delay
        setTimeout(() => {
            isUserTypingRef.current = false;
        }, 100);
    };

    function updateGrammarRuleDecoration(loc: GrammarRuleLocation, shouldReveal: boolean = true) {
        const monaco = grammarMonacoRef.current;
        const ed = grammarEditorRef.current;
        if (!monaco || !ed) return;

        const model = ed.getModel();
        if (!model) return;

        grammarDecorationCollectionRef.current?.clear();

        const decorations = createGrammarRuleDecoration(monaco, model, loc);
        grammarDecorationCollectionRef.current = ed.createDecorationsCollection(decorations);

        // Reveal the range in the editor only if explicitly requested
        if (shouldReveal && decorations.length > 0) {
            ed.revealRangeInCenter(decorations[0].range);
        }
    }

    // useEffect: Intelligently update editor content
    // This handles file switches, grammar loading, but NOT typing
    useEffect(() => {
        const currentFileIndex = grammarState.activeFileIndex;
        const lastFileIndex = lastLoadedFileIndexRef.current;
        const fileIndexChanged = currentFileIndex !== lastFileIndex;

        console.log("[useGrammarEditor] Effect triggered", {
            currentFileIndex,
            lastFileIndex,
            fileIndexChanged,
            isUserTyping: isUserTypingRef.current,
            hasGrammar: !!grammarState.userGrammar
        });

        // If file index changed, this is a manual file switch - ALWAYS process it
        if (fileIndexChanged) {
            console.log("[useGrammarEditor] File switch detected:", lastFileIndex, "→", currentFileIndex);
            isUserTypingRef.current = false; // Clear typing flag immediately on file switch

            if (grammarState.userGrammar && currentFileIndex) {
                const file = grammarState.userGrammar.grammar_files[String(currentFileIndex)];
                if (file) {
                    console.log("[useGrammarEditor] Loading content for file:", currentFileIndex);
                    editorState.setEditorContent(file.content);
                    lastLoadedFileIndexRef.current = currentFileIndex;
                }
            }
            return;
        }

        // If user is typing and file didn't change, skip update
        if (isUserTypingRef.current) {
            console.log("[useGrammarEditor] User is typing (same file), skipping update");
            return;
        }

        // If we reach here, userGrammar changed but file index didn't
        // This could be: initial grammar load, or a parse operation updated the grammar
        if (grammarState.userGrammar && currentFileIndex) {
            const file = grammarState.userGrammar.grammar_files[String(currentFileIndex)];
            if (file) {
                // Only update if content actually differs AND we haven't loaded this file yet
                const shouldUpdate = lastFileIndex === undefined || editorState.editorContent !== file.content;
                if (shouldUpdate) {
                    console.log("[useGrammarEditor] Grammar loaded/updated, updating content");
                    editorState.setEditorContent(file.content);
                    lastLoadedFileIndexRef.current = currentFileIndex;
                }
            }
        }
    }, [grammarState.activeFileIndex, grammarState.userGrammar]);

    // useEffect: Apply decorations when user manually switches to a file that has the parser location
    useEffect(() => {
        console.log("[useGrammarEditor] activeFileIndex changed effect triggered, activeFileIndex:", grammarState.activeFileIndex);

        const loc = parseState.parseStepInfo?.grammar_rule_location;
        if (!loc) {
            console.log("[useGrammarEditor] No parse location, clearing decorations");
            grammarDecorationCollectionRef.current?.clear?.();
            return;
        }

        console.log("[useGrammarEditor] Parse location file:", loc.file_path, "Active file:", grammarState.activeFileIndex);

        // Only apply decorations if the current file matches the parser location
        if (grammarState.activeFileIndex === loc.file_path) {
            console.log("[useGrammarEditor] Files match, applying decorations WITHOUT reveal");
            setTimeout(() => {
                updateGrammarRuleDecoration(loc, false);
            }, 0);
        } else {
            console.log("[useGrammarEditor] Files don't match, clearing decorations");
            grammarDecorationCollectionRef.current?.clear?.();
        }
    }, [grammarState.activeFileIndex]);

    // useEffect: Listen to parse step info changes and update decorations
    useEffect(() => {
        console.log("[useGrammarEditor] parseStepInfo/followParser effect triggered");

        const loc = parseState.parseStepInfo?.grammar_rule_location;
        if (!loc) {
            console.log("[useGrammarEditor] No parse location, clearing decorations");
            grammarDecorationCollectionRef.current?.clear?.();
            return;
        }

        console.log("[useGrammarEditor] followParser:", parseState.followParser, "activeFileIndex:", grammarState.activeFileIndex, "loc.file_path:", loc.file_path);

        // Only auto-switch when followParser is enabled
        if (parseState.followParser && grammarState.activeFileIndex !== loc.file_path) {
            console.log("[useGrammarEditor] AUTO-SWITCHING to file:", loc.file_path);
            grammarState.setActiveFileIndex(loc.file_path);
            // Decorations will be applied in the next render after file switch
        } else if (grammarState.activeFileIndex === loc.file_path) {
            console.log("[useGrammarEditor] Files match, applying decorations WITH reveal");
            updateGrammarRuleDecoration(loc);
        } else {
            console.log("[useGrammarEditor] Different file and follow OFF, clearing decorations");
            grammarDecorationCollectionRef.current?.clear?.();
        }
    }, [parseState.parseStepInfo, parseState.followParser]);

    return {
        grammarEditorRef,
        grammarMonacoRef,
        handleGrammarEditorDidMount,
        handleEditorChange,
    };
}