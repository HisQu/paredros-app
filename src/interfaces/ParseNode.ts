interface ParseNode {
    state: number;
    current_token: string;
    lookahead: string[];
    possible_alternatives: [number, string[]][];
    chosen: number;
    input_text: string;
    next_node: ParseNode | null;
    next_node_verbose: string | null;
    parent: ParseNode | null;
    alternative_nodes: ParseNode[];
    alternative_nodes_verbose: string[];
    id: string | number;
    rule_name: string;
    has_error: boolean;
    node_type: string;
}

export default ParseNode;