import {UserGrammar} from "./interfaces/UserGrammar";
import {TreeItem} from "react-complex-tree";

function getCommonBasename(paths: string[]): string {
    if (paths.length === 0) {
        return ""; // Return an empty string if there are no paths
    }

    // Special case: only one path
    if (paths.length === 1) {
        const parts = paths[0].split('/');
        parts.pop(); // Remove the filename
        return parts.join('/') + (parts.length > 0 ? '/' : '');
    }

    // Normalize paths and split into components
    const splitPaths = paths.map(path => path.split('/'));

    // Find the common base path
    let minLength = Math.min(...splitPaths.map(p => p.length));
    let commonBaseIndex = 0;

    for (let i = 0; i < minLength; i++) {
        const segment = splitPaths[0][i];
        if (!splitPaths.every(p => p[i] === segment)) {
            break;
        }
        commonBaseIndex = i;
    }

    // Join the common base path into a string
    return splitPaths[0].slice(0, commonBaseIndex + 1).join('/') + '/';
}

// Convert userGrammar.grammar_files into the item structure expected by react-complex-tree
export function buildItemsFromUserGrammar(userGrammar: UserGrammar | undefined): Record<string, TreeItem> {
    // DEBUG
    console.log("buildItemsFromUserGrammar");

    // The keys of userGrammar.grammar_files become child items under the "root"
    const fileNames = Object.keys(userGrammar?.grammar_files ?? []);

    const commonBasename = getCommonBasename(fileNames);

    // The "root" item
    const rootItem: TreeItem = {
        index: 'root',
        data: 'Root Node',
        children: fileNames
    };

    // Each file becomes its own item
    const fileItems = fileNames.reduce<Record<string, TreeItem>>((acc, fileName) => {
        acc[fileName] = {
            index: fileName,
            data: fileName.replace(commonBasename, ''),
            children: []
        };
        return acc;
    }, {});

    return {
        root: rootItem,
        ...fileItems
    };
}