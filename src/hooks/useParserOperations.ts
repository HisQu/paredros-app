import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppState } from "./useAppState";
import { ParseStepInfo, TokenInfo } from "../interfaces/UserGrammar";
import { transformJsonToParseTree } from "../parseTreeHelpers";
import { buildItemsFromUserGrammar } from "../grammarHelpers";
import { GrammarFilesDataProvider } from "../components/GrammarFilesDataProvider";

export function useParserOperations(
    appState: AppState,
    providerRef: React.MutableRefObject<GrammarFilesDataProvider | undefined>,
    saveGrammarFiles: () => Promise<void>
) {
    const { grammarState, parseState, expressionState } = appState;

    async function generate_parser() {
        console.log("generate_parser");

        parseState.setIsGeneratingParser(true);
        try {
            const result = await invoke("generate_parser", {
                id: parseState.parseInfo
            });
            parseState.setGenerateParserResult(result as string);
        } finally {
            parseState.setIsGeneratingParser(false);
        }
    }

    async function generate_parser_and_save_grammar_files() {
        await saveGrammarFiles();
        await generate_parser();
    }

    async function generate_parser_save_grammar_files_parse_input() {
        await generate_parser_and_save_grammar_files();
        await parse_input();
    }

    async function parse_input() {
        parseState.setIsParsingExpression(true);
        try {
            const parse_input_result = await invoke("parse_input", {
                id: parseState.parseInfo,
                input: expressionState.expressionContent
            });

            console.log("Expression parsed:", expressionState.expressionContent);
            console.log("parse_input_result", parse_input_result);

            if (parse_input_result === "Parsed successfully") {
                expressionState.setExpressionChanged(false);
                await get_json_parse_tree();
                await get_lexemes();
            }
        } finally {
            parseState.setIsParsingExpression(false);
        }
    }

    async function get_json_parse_tree() {
        const _response = await invoke("get_json_parse_tree", { id: parseState.parseInfo });

        console.log("JSON Parse Tree");
        console.log(_response);

        parseState.setFollowParser(true);
        const { nodes: _n, edges: _e } = transformJsonToParseTree(_response);
        parseState.setNodes(_n);
        parseState.setEdges(_e);

        await get_current_parse_step_info();
        await get_next_parse_step_info();
    }

    async function get_current_parse_step_info() {
        const _response = await invoke<ParseStepInfo>("get_current_parse_step_info", { id: parseState.parseInfo });

        console.log("Parse Step Info");
        console.log(_response);

        parseState.setParseStepInfo(_response);
    }

    async function get_next_parse_step_info() {
        const _response = await invoke<ParseStepInfo>("get_next_parse_step_info", {
            id: parseState.parseInfo,
        });
        parseState.setNextInfo(_response);
    }

    async function get_lexemes() {
        const _response = await invoke<TokenInfo[]>("get_token_list", { id: parseState.parseInfo });

        console.log("Get lexemes");
        console.log(_response);

        parseState.setLexemes(_response);
    }

    // useEffect: grammarFileLocation changes -> get parse info
    useEffect(() => {
        console.log("useEffect: grammarFileLocation", grammarState.grammarFileLocation);
        if (grammarState.grammarFileLocation) {
            const getParseInfo = async () => {
                console.log("get_parse_info");
                parseState.setNodes(undefined);
                parseState.setEdges(undefined);
                await saveGrammarFiles();
                const result = await invoke("get_parse_info", { grammar: grammarState.grammarFileLocation });
                parseState.setParseInfo(result as string);
            };
            getParseInfo();
        }
    }, [grammarState.grammarFileLocation]);

    // useEffect: parseInfo changes -> get user grammar
    useEffect(() => {
        if (parseState.parseInfo) {
            const getUserGrammar = async () => {
                console.log("get_user_grammar");
                const _g = await invoke("get_user_grammar", { id: parseState.parseInfo });
                grammarState.setUserGrammar(_g as any);
            };
            getUserGrammar();
        }
    }, [parseState.parseInfo]);

    // useEffect: userGrammar changes -> set active file
    useEffect(() => {
        if (grammarState.userGrammar) {
            grammarState.setActiveFileIndex(Object.keys(grammarState.userGrammar.grammar_files)[0]);
        }
    }, [grammarState.userGrammar]);

    // useEffect: userGrammar changes -> update data provider
    useEffect(() => {
        if (!grammarState.userGrammar) return;

        const map = buildItemsFromUserGrammar(grammarState.userGrammar);

        if (!providerRef.current) {
            providerRef.current = new GrammarFilesDataProvider(map);
        } else {
            providerRef.current.setItems(map);
        }
    }, [grammarState.userGrammar]);

    return {
        generate_parser,
        generate_parser_and_save_grammar_files,
        generate_parser_save_grammar_files_parse_input,
        parse_input,
        get_json_parse_tree,
        get_lexemes,
    };
}

