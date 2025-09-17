import {UserGrammar} from "./interfaces/UserGrammar";
import {TreeItem} from "react-complex-tree";

/**
 * Normalizes a file path by replacing all backslashes with forward slashes.
 * @param path The file path to normalize.
 * @returns The normalized path.
 */
function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

function getCommonBasename(paths: string[]): string {
    if (!paths || paths.length === 0) {
        return "";
    }

    // Normalize all paths to use forward slashes for consistent processing
    const normalizedPaths = paths.map(normalizePath);

    // Handle the single path case separately and correctly
    if (normalizedPaths.length === 1) {
        const path = normalizedPaths[0];
        const lastSlashIndex = path.lastIndexOf('/');
        // If no slash, it's a root file; common base is empty. Otherwise, return the directory part.
        return lastSlashIndex === -1 ? '' : path.substring(0, lastSlashIndex + 1);
    }

    // Find the common prefix among all paths
    let commonPrefix = '';
    const firstPath = normalizedPaths[0];
    for (let i = 0; i < firstPath.length; i++) {
        const char = firstPath[i];
        if (normalizedPaths.every(p => p.length > i && p[i] === char)) {
            commonPrefix += char;
        } else {
            break;
        }
    }

    // The common base is the directory part of the common prefix
    const lastSlashIndex = commonPrefix.lastIndexOf('/');
    if (lastSlashIndex === -1) {
        return ''; // No common directory
    }

    return commonPrefix.substring(0, lastSlashIndex + 1);
}

// Convert userGrammar.grammar_files into the item structure expected by react-complex-tree
export function buildItemsFromUserGrammar(userGrammar: UserGrammar | undefined): Record<string, TreeItem> {
    // DEBUG
    console.log("buildItemsFromUserGrammar");

    const filePaths = Object.keys(userGrammar?.grammar_files ?? []);
    if (filePaths.length === 0) {
        return { root: { index: 'root', data: 'Root Node', children: [] } };
    }

    const commonBasename = getCommonBasename(filePaths);
    const normalizedBasename = normalizePath(commonBasename);

    // The "root" item's children should be the original, un-normalized paths
    const rootItem: TreeItem = {
        index: 'root',
        data: 'Root Node',
        children: filePaths
    };

    // Each file becomes its own item
    const fileItems = filePaths.reduce<Record<string, TreeItem>>((acc, originalPath) => {
        const normalizedPath = normalizePath(originalPath);
        acc[originalPath] = {
            index: originalPath,
            // Display path relative to the common base
            data: normalizedPath.replace(normalizedBasename, ''),
            children: []
        };
        return acc;
    }, {});

    return {
        root: rootItem,
        ...fileItems
    };
}