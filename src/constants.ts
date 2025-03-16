import {
  Node,
  Edge
} from '@xyflow/react';

const sampleInputText = `<head>Henricus de Bocholdia al. d. Foet cler. Traiect., mag. in art. bac. in decr.</head>

<sublemma>m. prov. super par. eccl. in Bodegrauen Traiect. dioc. vacat. per transgr. Ghiselberti de Lochorst ad decan. eccl. s. Saluatoris Traiect. 9 apr. 1410. L 138 254v.</sublemma>
`;

const sampleParseTree = {
  "id": "ptn_0",
  "node_type": "rule",
  "ruleName": "startRule",
  "token": null,
  "exploring_alternatives": false,
  "trace_steps": [
    {
      "id": "0",
      "node_type": "Rule entry",
      "state": "486",
      "current_token": "startRule",
      "chosen": -1,
      "input_text": "⏺ <head> Henricus de",
      "matching_error": false,
      "next_input_token": null,
      "next_input_literal": null
    }
  ],
  "children": [
    {
      "id": "ptn_1",
      "node_type": "rule",
      "ruleName": "head",
      "token": null,
      "exploring_alternatives": false,
      "trace_steps": [
        {
          "id": "1",
          "node_type": "Rule entry",
          "state": "110",
          "current_token": "head",
          "chosen": 1,
          "input_text": "⏺ <head> Henricus de",
          "matching_error": false,
          "next_input_token": null,
          "next_input_literal": null
        }
      ],
      "children": [
        {
          "id": "ptn_2",
          "node_type": "token",
          "ruleName": null,
          "token": "HEADTAG ('<head>')",
          "exploring_alternatives": false,
          "trace_steps": [
            {
              "id": "2",
              "node_type": "Token consume",
              "state": "113",
              "current_token": "HEADTAG ('<head>')",
              "chosen": 1,
              "input_text": "⏺ <head> Henricus de",
              "matching_error": false,
              "next_input_token": null,
              "next_input_literal": null
            }
          ],
          "children": []
        },
        {
          "id": "ptn_3",
          "node_type": "rule",
          "ruleName": "headInhalt",
          "token": null,
          "exploring_alternatives": false,
          "trace_steps": [
            {
              "id": "3",
              "node_type": "Rule entry",
              "state": "114",
              "current_token": "headInhalt",
              "chosen": 1,
              "input_text": "<head>⏺ Henricus de Bocholdia",
              "matching_error": false,
              "next_input_token": null,
              "next_input_literal": null
            }
          ],
          "children": [
            {
              "id": "ptn_4",
              "node_type": "rule",
              "ruleName": "natPerson",
              "token": null,
              "exploring_alternatives": false,
              "trace_steps": [
                {
                  "id": "4",
                  "node_type": "Rule entry",
                  "state": "121",
                  "current_token": "natPerson",
                  "chosen": 1,
                  "input_text": "<head>⏺ Henricus de Bocholdia",
                  "matching_error": false,
                  "next_input_token": null,
                  "next_input_literal": null
                },
                {
                  "id": "24",
                  "node_type": "Sync",
                  "state": "133",
                  "current_token": "CLERIC ('cler.')",
                  "chosen": 1,
                  "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                  "matching_error": false,
                  "next_input_token": null,
                  "next_input_literal": null
                }
              ],
              "children": [
                {
                  "id": "ptn_5",
                  "node_type": "rule",
                  "ruleName": "personName",
                  "token": null,
                  "exploring_alternatives": false,
                  "trace_steps": [
                    {
                      "id": "5",
                      "node_type": "Rule entry",
                      "state": "131",
                      "current_token": "personName",
                      "chosen": 1,
                      "input_text": "<head>⏺ Henricus de Bocholdia",
                      "matching_error": false,
                      "next_input_token": null,
                      "next_input_literal": null
                    },
                    {
                      "id": "13",
                      "node_type": "Sync",
                      "state": "137",
                      "current_token": "AL ('al.')",
                      "chosen": 1,
                      "input_text": "<head> Henricus de Bocholdia⏺ al. d. Foet",
                      "matching_error": false,
                      "next_input_token": null,
                      "next_input_literal": null
                    },
                    {
                      "id": "23",
                      "node_type": "Rule exit",
                      "state": "136",
                      "current_token": "Rule exit: personName",
                      "chosen": 1,
                      "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                      "matching_error": false,
                      "next_input_token": null,
                      "next_input_literal": null
                    }
                  ],
                  "children": [
                    {
                      "id": "ptn_6",
                      "node_type": "rule",
                      "ruleName": "name",
                      "token": null,
                      "exploring_alternatives": false,
                      "trace_steps": [
                        {
                          "id": "6",
                          "node_type": "Rule entry",
                          "state": "135",
                          "current_token": "name",
                          "chosen": 1,
                          "input_text": "<head>⏺ Henricus de Bocholdia",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        },
                        {
                          "id": "8",
                          "node_type": "Decision",
                          "state": "471",
                          "current_token": "DE ('de')",
                          "chosen": 1,
                          "input_text": "<head> Henricus⏺ de Bocholdia al.",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        },
                        {
                          "id": "10",
                          "node_type": "Sync",
                          "state": "469",
                          "current_token": "WORD ('Bocholdia')",
                          "chosen": -1,
                          "input_text": "<head> Henricus de⏺ Bocholdia al. d.",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        },
                        {
                          "id": "12",
                          "node_type": "Rule exit",
                          "state": "468",
                          "current_token": "Rule exit: name",
                          "chosen": 1,
                          "input_text": "<head> Henricus de Bocholdia⏺ al. d. Foet",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        }
                      ],
                      "children": [
                        {
                          "id": "ptn_7",
                          "node_type": "token",
                          "ruleName": null,
                          "token": "WORD ('Henricus')",
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "7",
                              "node_type": "Token consume",
                              "state": "465",
                              "current_token": "WORD ('Henricus')",
                              "chosen": 1,
                              "input_text": "<head>⏺ Henricus de Bocholdia",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": []
                        },
                        {
                          "id": "ptn_8",
                          "node_type": "token",
                          "ruleName": null,
                          "token": "DE ('de')",
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "9",
                              "node_type": "Token consume",
                              "state": "466",
                              "current_token": "DE ('de')",
                              "chosen": 1,
                              "input_text": "<head> Henricus⏺ de Bocholdia al.",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": []
                        },
                        {
                          "id": "ptn_9",
                          "node_type": "token",
                          "ruleName": null,
                          "token": "WORD ('Bocholdia')",
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "11",
                              "node_type": "Token consume",
                              "state": "468",
                              "current_token": "WORD ('Bocholdia')",
                              "chosen": 1,
                              "input_text": "<head> Henricus de⏺ Bocholdia al. d.",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": []
                        }
                      ]
                    },
                    {
                      "id": "ptn_10",
                      "node_type": "rule",
                      "ruleName": "alias",
                      "token": null,
                      "exploring_alternatives": false,
                      "trace_steps": [
                        {
                          "id": "14",
                          "node_type": "Rule entry",
                          "state": "136",
                          "current_token": "alias",
                          "chosen": 1,
                          "input_text": "<head> Henricus de Bocholdia⏺ al. d. Foet",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        },
                        {
                          "id": "15",
                          "node_type": "Decision",
                          "state": "480",
                          "current_token": "AL ('al.')",
                          "chosen": 5,
                          "input_text": "<head> Henricus de Bocholdia⏺ al. d. Foet",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        },
                        {
                          "id": "22",
                          "node_type": "Rule exit",
                          "state": "482",
                          "current_token": "Rule exit: alias",
                          "chosen": 1,
                          "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        }
                      ],
                      "children": [
                        {
                          "id": "ptn_11",
                          "node_type": "token",
                          "ruleName": null,
                          "token": "AL ('al.')",
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "16",
                              "node_type": "Token consume",
                              "state": "478",
                              "current_token": "AL ('al.')",
                              "chosen": 1,
                              "input_text": "<head> Henricus de Bocholdia⏺ al. d. Foet",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": []
                        },
                        {
                          "id": "ptn_12",
                          "node_type": "token",
                          "ruleName": null,
                          "token": "D ('d.')",
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "17",
                              "node_type": "Token consume",
                              "state": "479",
                              "current_token": "D ('d.')",
                              "chosen": 1,
                              "input_text": "<head> Henricus de Bocholdia al.⏺ d. Foet cler.",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": []
                        },
                        {
                          "id": "ptn_13",
                          "node_type": "rule",
                          "ruleName": "name",
                          "token": null,
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "18",
                              "node_type": "Rule entry",
                              "state": "482",
                              "current_token": "name",
                              "chosen": 1,
                              "input_text": "<head> Henricus de Bocholdia al. d.⏺ Foet cler. Traiect.",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            },
                            {
                              "id": "20",
                              "node_type": "Decision",
                              "state": "471",
                              "current_token": "CLERIC ('cler.')",
                              "chosen": 2,
                              "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            },
                            {
                              "id": "21",
                              "node_type": "Rule exit",
                              "state": "471",
                              "current_token": "Rule exit: name",
                              "chosen": 1,
                              "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": [
                            {
                              "id": "ptn_14",
                              "node_type": "token",
                              "ruleName": null,
                              "token": "WORD ('Foet')",
                              "exploring_alternatives": false,
                              "trace_steps": [
                                {
                                  "id": "19",
                                  "node_type": "Token consume",
                                  "state": "465",
                                  "current_token": "WORD ('Foet')",
                                  "chosen": 1,
                                  "input_text": "<head> Henricus de Bocholdia al. d.⏺ Foet cler. Traiect.",
                                  "matching_error": false,
                                  "next_input_token": null,
                                  "next_input_literal": null
                                }
                              ],
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "ptn_15",
                  "node_type": "rule",
                  "ruleName": "vita",
                  "token": null,
                  "exploring_alternatives": false,
                  "trace_steps": [
                    {
                      "id": "25",
                      "node_type": "Rule entry",
                      "state": "132",
                      "current_token": "vita",
                      "chosen": 1,
                      "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                      "matching_error": false,
                      "next_input_token": null,
                      "next_input_literal": null
                    },
                    {
                      "id": "26",
                      "node_type": "Merged Sync",
                      "state": "160",
                      "current_token": "CLERIC ('cler.')",
                      "chosen": 2,
                      "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                      "matching_error": false,
                      "next_input_token": null,
                      "next_input_literal": null
                    }
                  ],
                  "children": [
                    {
                      "id": "ptn_16",
                      "node_type": "rule",
                      "ruleName": "inkardination",
                      "token": null,
                      "exploring_alternatives": false,
                      "trace_steps": [
                        {
                          "id": "27",
                          "node_type": "Rule entry",
                          "state": "156",
                          "current_token": "inkardination",
                          "chosen": 1,
                          "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        },
                        {
                          "id": "28",
                          "node_type": "Sync",
                          "state": "167",
                          "current_token": "CLERIC ('cler.')",
                          "chosen": 1,
                          "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                          "matching_error": false,
                          "next_input_token": null,
                          "next_input_literal": null
                        }
                      ],
                      "children": [
                        {
                          "id": "ptn_17",
                          "node_type": "rule",
                          "ruleName": "h_weihegrad",
                          "token": null,
                          "exploring_alternatives": false,
                          "trace_steps": [
                            {
                              "id": "29",
                              "node_type": "Rule entry",
                              "state": "164",
                              "current_token": "h_weihegrad",
                              "chosen": 1,
                              "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                              "matching_error": false,
                              "next_input_token": null,
                              "next_input_literal": null
                            }
                          ],
                          "children": [
                            {
                              "id": "ptn_18",
                              "node_type": "token",
                              "ruleName": null,
                              "token": "CLERIC ('cler.')",
                              "exploring_alternatives": false,
                              "trace_steps": [
                                {
                                  "id": "30",
                                  "node_type": "Token consume",
                                  "state": "172",
                                  "current_token": "CLERIC ('cler.')",
                                  "chosen": 1,
                                  "input_text": "<head> Henricus de Bocholdia al. d. Foet⏺ cler. Traiect. ,",
                                  "matching_error": false,
                                  "next_input_token": null,
                                  "next_input_literal": null
                                }
                              ],
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}


const antlr4MonarchLanguage = {
  // Default token and file extension postfix
  defaultToken: '',
  tokenPostfix: '.g4',

  // ANTLR4 keywords
  keywords: [
    'grammar', 'options', 'tokens', 'import', 'fragment',
    'lexer', 'parser', 'channels', 'mode'
  ],

  // Some common operators and punctuation in ANTLR4 grammars
  operators: [
    ';', ':', '::', '=', '->', '|', '.', '!', '?', '*', '+'
  ],

  // A regex for miscellaneous symbol characters
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // Escapes for string literals
  escapes: /\\(?:[btnfr"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4})/,

  tokenizer: {
    root: [
      // Whitespace and comments
      { include: '@whitespace' },

      // Keywords
      [/\b(grammar|options|tokens|import|fragment|lexer|parser|channels|mode)\b/, 'keyword'],

      // Lexer rules: usually written in all-caps or starting with an uppercase letter
      [/[A-Z][A-Z0-9_]*/, 'type.identifier'],

      // Parser rules: typically begin with a lowercase letter
      [/[a-z][a-zA-Z0-9_]*/, 'identifier'],

      // Brackets and delimiters
      [/[{}()\[\]]/, '@brackets'],
      [/[;:]/, 'delimiter'],

      // String literals (double-quoted and single-quoted)
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string error
      [/"/, 'string', '@string."'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated string error
      [/'/, 'string', "@string.'"],

      // Numbers (if needed)
      [/\d+/, 'number'],

      // Operators and other symbols
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],

      // Code blocks (action code) that begin with '{' and can nest
      [/\{/, { token: 'delimiter.bracket', next: '@action' }],
    ],

    // Whitespace and comment handling
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*.*?\*\//, 'comment'],
      [/\/\/.*$/, 'comment']
    ],

    // String state to handle escapes and proper termination
    string: [
      [/[^\\"']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"|'/, {
        cases: {
          '$#==$S2': { token: 'string', next: '@pop' },
          '@default': 'string'
        }
      }]
    ],

    // Action state to handle nested code blocks in { ... }
    action: [
      [/\{/, 'delimiter.bracket', '@push'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'root' }
    ]
  }
};

const initialNodes:Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges:Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeWidth = 172;
const nodeHeight = 36;

const tempFileName = "temporaryParedrosInput.txt";

export { tempFileName, nodeWidth, nodeHeight, initialNodes, initialEdges, sampleParseTree, sampleInputText, antlr4MonarchLanguage }