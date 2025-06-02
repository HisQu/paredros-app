import {ParseTreeNode} from "./interfaces/ParseTreeNode";
import {Edge} from "@xyflow/react";

export function transformJsonToParseTree(root: any): { nodes: ParseTreeNode[]; edges: Edge[] } {
    const nodes: ParseTreeNode[] = [];
    const edges: Edge[] = [];

    /**
     * Recursively traverses the JSON tree to generate nodes and edges.
     * @param node - The current JSON node.
     * @param parent - The parent JSON node (or null for the root).
     * @param depth - The current depth (used to compute the x position).
     * @param index - The index among siblings (used to compute the y position).
     */
    function traverse(node: any, parent: any | null, depth: number, index: number): void {
        // Compute a simple layout: x based on depth, y based on sibling index.
        const x = depth * 200;
        const y = index * 100;

        // Create a node object and add it to the nodes list.
        nodes.push({
            id: node.id,
            position: {x, y},
            data: {
                nodeType: node.node_type,
                ruleName: node.rule_name,
                token: node.token,
                traceSteps: node.trace_steps
            }
        });

        // If there is a parent, create an edge from the parent to the current node.
        if (parent) {
            edges.push({
                id: `e${parent.id}-${node.id}`,
                source: parent.id,
                target: node.id
            });
        }

        // Recursively process children (if any).
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach((child: any, childIndex: number) => {
                traverse(child, node, depth + 1, childIndex);
            });
        }
    }

    // Start the recursion with the root node.
    traverse(root, null, 0, 0);

    return {nodes, edges};
}