import { readTextFile, writeTextFile, readDir } from '@tauri-apps/plugin-fs';
import { join, dirname } from '@tauri-apps/api/path';

export interface GrammarFileMetadata {
    name: string;
    isMainFile: boolean;
}

/**
 * Reads all .g4 files from a directory and analyzes them
 */
export async function readGrammarDirectory(directory: string): Promise<GrammarFileMetadata[]> {
    console.log("Reading directory entries...");
    const entries = await readDir(directory);
    console.log("Directory entries:", entries);

    const g4FileNames = entries
        .filter(entry => {
            console.log("Entry:", entry);
            return !entry.isDirectory && entry.name.endsWith('.g4');
        })
        .map(entry => entry.name);

    console.log("Found .g4 files:", g4FileNames);

    if (g4FileNames.length === 0) {
        return [];
    }

    // Analyze each file to detect if it's the main file
    const g4FilesWithMetadata = await Promise.all(
        g4FileNames.map(async (fileName) => {
            const filePath = await join(directory, fileName);
            let isMainFile = false;

            try {
                const content = await readTextFile(filePath);
                // Check for "startRule" or "// main file" comment
                isMainFile = content.includes('startRule') ||
                    content.includes('// main file') ||
                    content.includes('//main file');
            } catch (error) {
                console.error(`Failed to read ${fileName}:`, error);
            }

            return { name: fileName, isMainFile };
        })
    );

    console.log("Files with metadata:", g4FilesWithMetadata);
    return g4FilesWithMetadata;
}

/**
 * Tries to load input.txt from the same directory as the grammar file
 */
export async function tryLoadInputFromGrammarDirectory(grammarPath: string): Promise<string | null> {
    try {
        const directory = await dirname(grammarPath);
        const inputPath = await join(directory, 'input.txt');

        console.log("Looking for input file at path:" + inputPath);

        const content = await readTextFile(inputPath);
        console.log("Loaded input.txt from grammar directory");
        return content;
    } catch (error) {
        console.log("No input.txt found in grammar directory (this is optional)");
        return null;
    }
}

/**
 * Saves a file to disk
 */
export async function saveFile(path: string, content: string): Promise<void> {
    try {
        await writeTextFile(path, content);
        console.log(`Saved file: ${path}`);
    } catch (error) {
        console.error(`Failed to save file at ${path}:`, error);
        throw error;
    }
}

