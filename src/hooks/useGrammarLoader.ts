import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { invoke } from "@tauri-apps/api/core";
import { AppState } from "./useAppState";
import { UserGrammar } from "../interfaces/UserGrammar";
import { readGrammarDirectory, tryLoadInputFromGrammarDirectory } from "../utils/grammarFileOperations";

export function useGrammarLoader(appState: AppState) {
    const { grammarState, parseState, expressionState } = appState;

    function resetStateVariables() {
        parseState.setParseStepInfo(undefined);
        parseState.setLexemes(undefined);
        parseState.setEdges(undefined);
        parseState.setNodes(undefined);
        parseState.setGenerateParserResult(undefined);
        grammarState.setNoGrammarFilesFound(false);
    }

    async function load_grammar_file() {
        console.log("load_grammar_file - opening directory dialog");

        const directory = await open({
            multiple: false,
            directory: true,
            title: "Select Grammar Directory"
        });

        if (directory) {
            console.log("Selected directory:", directory);

            // Reset all state values
            resetStateVariables();

            // Set the grammar directory
            grammarState.setGrammarDirectory(directory);

            try {
                const g4FilesWithMetadata = await readGrammarDirectory(directory);

                // Check if any .g4 files were found
                if (g4FilesWithMetadata.length === 0) {
                    console.error("No .g4 files found in directory");
                    grammarState.setNoGrammarFilesFound(true);
                    return;
                }

                grammarState.setAvailableGrammarFiles(g4FilesWithMetadata);

                // If there's only one .g4 file, select it automatically
                if (g4FilesWithMetadata.length === 1) {
                    console.log("Auto-selecting single grammar file:", g4FilesWithMetadata[0].name);
                    await selectMainGrammarFile(directory, g4FilesWithMetadata[0].name);
                } else {
                    // If one file is marked as main, auto-select it
                    const mainFile = g4FilesWithMetadata.find(f => f.isMainFile);
                    if (mainFile) {
                        console.log("Auto-selecting detected main file:", mainFile.name);
                        await selectMainGrammarFile(directory, mainFile.name);
                    }
                }
            } catch (error) {
                console.error("Failed to read directory:", error);
                grammarState.setNoGrammarFilesFound(true);
            }
        }
    }

    async function selectMainGrammarFile(directory: string, fileName: string) {
        const fullPath = await join(directory, fileName);
        console.log("Selected main grammar file:", fullPath);

        grammarState.setGrammarFileLocation(fullPath);
        grammarState.setAvailableGrammarFiles([]);  // Clear the file list after selection

        // Try to load input.txt from the same directory
        const inputContent = await tryLoadInputFromGrammarDirectory(fullPath);
        if (inputContent) {
            expressionState.setExpressionContent(inputContent);
        }
    }

    async function load_input_file() {
        console.log("load_input_file");

        const file = await open({
            multiple: false,
            directory: false,
        });

        if (file) {
            try {
                const content = await readTextFile(file);
                expressionState.setExpressionContent(content);
                expressionState.setExpressionChanged(true);

                console.log("Loaded input file:", file);
            } catch (error) {
                console.error("Failed to load input file:", error);
            }
        }
    }

    async function get_parse_info() {
        console.log("get_parse_info");

        // reset the parse tree
        parseState.setNodes(undefined);
        parseState.setEdges(undefined);

        await saveGrammarFiles();

        const result = await invoke("get_parse_info", { grammar: grammarState.grammarFileLocation });
        parseState.setParseInfo(result as string);
    }

    async function get_user_grammar() {
        console.log("get_user_grammar");

        const _g: UserGrammar = await invoke("get_user_grammar", { id: parseState.parseInfo });
        grammarState.setUserGrammar(_g);
    }

    async function saveGrammarFiles(): Promise<void> {
        if (grammarState.userGrammar) {
            for (const key in grammarState.userGrammar.grammar_files) {
                if (Object.prototype.hasOwnProperty.call(grammarState.userGrammar.grammar_files, key)) {
                    const file = grammarState.userGrammar.grammar_files[key];
                    if (file.changed) {
                        try {
                            await writeTextFile(file.path, file.content);
                            file.changed = false;
                        } catch (error) {
                            console.error(`Failed to save file at ${file.path}:`, error);
                        }
                    }
                }
            }
        }
    }

    return {
        load_grammar_file,
        selectMainGrammarFile,
        load_input_file,
        get_parse_info,
        get_user_grammar,
        saveGrammarFiles,
        resetStateVariables,
    };
}

