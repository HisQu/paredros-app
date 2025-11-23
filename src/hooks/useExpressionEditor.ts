import { useRef, useEffect } from "react";
import { OnMount } from '@monaco-editor/react';
import { editor } from "monaco-editor";
import { AppState } from "./useAppState";
import { createTokenDecorations, createCurrentTokenDecoration } from "../utils/monacoDecorations";

export function useExpressionEditor(appState: AppState) {
    const { expressionState, parseState } = appState;

    const expressionEditorRef = useRef<Parameters<OnMount>[0] | null>(null);
    const expressionMonacoRef = useRef<Parameters<OnMount>[1] | null>(null);
    const tokenDecorationCollectionRef = useRef<editor.IEditorDecorationsCollection>();
    const currentTokenDecorationRef = useRef<editor.IEditorDecorationsCollection>();

    const handleExpressionEditorDidMount: OnMount = (editor, monaco) => {
        expressionEditorRef.current = editor;
        expressionMonacoRef.current = monaco;
    };

    const handleExpressionChange = (value: any) => {
        expressionState.setExpressionContent(value || "");
        expressionState.setExpressionChanged(true);
    };

    function applyTokenDecorations() {
        const monaco = expressionMonacoRef.current;
        const ed = expressionEditorRef.current;
        const tokens = parseState.lexemes;

        if (!monaco || !ed || !tokens?.length) {
            tokenDecorationCollectionRef.current?.clear?.();
            return;
        }

        const model = ed.getModel?.();
        if (!model) return;

        // Clear previous
        tokenDecorationCollectionRef.current?.clear?.();

        const decorations = createTokenDecorations(monaco, model, tokens, expressionState.showTokenLabels);
        tokenDecorationCollectionRef.current = ed.createDecorationsCollection(decorations);
    }

    function highlightCurrentToken() {
        const monaco = expressionMonacoRef.current;
        const ed = expressionEditorRef.current;

        if (!monaco || !ed || !parseState.lexemes || !parseState.parseStepInfo) {
            currentTokenDecorationRef.current?.clear?.();
            return;
        }

        const model = ed.getModel?.();
        if (!model) return;

        // find token by index
        const tok = parseState.lexemes.find(t => t.tokenIndex === parseState.parseStepInfo!.token_index)
            ?? parseState.lexemes[parseState.parseStepInfo.token_index];

        if (!tok) {
            currentTokenDecorationRef.current?.clear?.();
            return;
        }

        currentTokenDecorationRef.current?.clear?.();
        const decorations = createCurrentTokenDecoration(monaco, model, tok);
        currentTokenDecorationRef.current = ed.createDecorationsCollection(decorations);
    }

    // useEffect: when tokens change, apply decorations
    useEffect(() => {
        applyTokenDecorations();
    }, [parseState.lexemes, expressionState.showTokenLabels]);

    // useEffect: when parse step info changes, highlight current token
    useEffect(() => {
        highlightCurrentToken();
    }, [parseState.parseStepInfo, parseState.lexemes]);

    // useEffect: cleanup when editor unmounts
    useEffect(() => {
        return () => {
            tokenDecorationCollectionRef.current?.clear?.();
            currentTokenDecorationRef.current?.clear?.();
        };
    }, []);

    return {
        expressionEditorRef,
        handleExpressionEditorDidMount,
        handleExpressionChange,
    };
}

