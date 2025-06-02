import {
  Node,
  Edge
} from '@xyflow/react';

const sampleInputText = `<head>Henricus de Bocholdia al. d. Foet cler. Traiect., mag. in art. bac. in decr.</head>

<sublemma>m. prov. super par. eccl. in Bodegrauen Traiect. dioc. vacat. per transgr. Ghiselberti de Lochorst ad decan. eccl. s. Saluatoris Traiect. 9 apr. 1410. L 138 254v.</sublemma>
`;

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

export { tempFileName, nodeWidth, nodeHeight, initialNodes, initialEdges, sampleInputText, antlr4MonarchLanguage }