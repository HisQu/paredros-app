
/// constants for parse node testing

import ParseNode from "./interfaces/ParseNode.ts";

const rootNode: ParseNode = {
    state: 0,
    current_token: '',
    lookahead: ['(', '3'],
    possible_alternatives: [
        [1, ["start: expr '=' expr ';'"]],
        [2, ["start: expr ';'"]]
    ],
    chosen: 1,
    input_text: '(3+4)+12;',
    next_node: null,
    next_node_verbose: 'Expression',
    parent: null,
    alternative_nodes: [],
    alternative_nodes_verbose: [],
    id: 'node-0',
    rule_name: 'start',
    has_error: false,
    node_type: 'StartRule'
};

const additionNode: ParseNode = {
    state: 1,
    current_token: '(',
    lookahead: ['3', '+'],
    possible_alternatives: [
        [3, ["expr '+' expr"]],
        [4, ["expr '*' expr"]],
        [5, ["expr '(' expr ')'"]],
        [6, ["ID"]]
    ],
    chosen: 0,
    input_text: '(3+4)+12',
    next_node: null,
    next_node_verbose: 'NestedExpression',
    parent: rootNode,
    alternative_nodes: [],
    alternative_nodes_verbose: [],
    id: 'node-1',
    rule_name: 'expr',
    has_error: false,
    node_type: 'Expression'
};

const nestedAdditionNode: ParseNode = {
    state: 2,
    current_token: '3',
    lookahead: ['+', '4'],
    possible_alternatives: [
        [7, ["expr '+' expr"]],
        [8, ["NumberLiteral"]]
    ],
    chosen: 0,
    input_text: '3+4',
    next_node: null,
    next_node_verbose: 'RightOperand',
    parent: additionNode,
    alternative_nodes: [],
    alternative_nodes_verbose: [],
    id: 'node-1-1',
    rule_name: 'expr',
    has_error: false,
    node_type: 'Expression'
};

const numberNode4: ParseNode = {
    state: 3,
    current_token: '4',
    lookahead: [')'],
    possible_alternatives: [[9, ["NumberLiteral"]]],
    chosen: 0,
    input_text: '4',
    next_node: null,
    next_node_verbose: null,
    parent: nestedAdditionNode,
    alternative_nodes: [],
    alternative_nodes_verbose: [],
    id: 'node-1-1-2',
    rule_name: 'expr',
    has_error: false,
    node_type: 'Literal'
};

const numberNode12: ParseNode = {
    state: 4,
    current_token: '12',
    lookahead: [';'],
    possible_alternatives: [[10, ["NumberLiteral"]]],
    chosen: 0,
    input_text: '12',
    next_node: null,
    next_node_verbose: null,
    parent: additionNode,
    alternative_nodes: [],
    alternative_nodes_verbose: [],
    id: 'node-1-2',
    rule_name: 'expr',
    has_error: false,
    node_type: 'Literal'
};

// Link nodes together
rootNode.next_node = additionNode;
additionNode.next_node = nestedAdditionNode;
nestedAdditionNode.next_node = numberNode4;
numberNode4.next_node = numberNode12;

// Complete the circular references
additionNode.alternative_nodes = [nestedAdditionNode, numberNode12];
nestedAdditionNode.alternative_nodes = [numberNode4];

/// END constants for parse node testing

export {rootNode, additionNode, nestedAdditionNode, numberNode12, numberNode4}