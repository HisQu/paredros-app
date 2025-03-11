
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

const longTreeTemplate = {
  root: {
    "LexerRegeln.g4": null,
    "Regest.g4": null,
  },
};

/// END constants for parse node testing

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
  


const grammarFiles = [
    { name: "Regest.g4", language: "antlr4", content: `grammar MyGrammar;

startRule : head sublemma ;

head : HEADTAG headInhalt CLOSEHEADTAG ;
sublemma : SUBLEMMATAG sublemmaInhalt CLOSESUBLEMMATAG ;

headInhalt : natPerson ;
sublemmaInhalt : (provision)+ date fund;

natPerson : personName vita? ;
personName : name alias? ;
provision : mProvision ;
date : INT month INT PUNKT? ;
fund : L INT INT extras? ;

vita : (KOMMA? (inkardination | akadGrad))+ ;
inkardination : (h_weihegrad | n_weihegrad | kein_weihegrad) location?;
h_weihegrad : CLERIC ;
n_weihegrad : ACOL | ACOLIT | LECT (IN orden)? | ACOLUT ;
kein_weihegrad : LAICUS ;

orden : geistlicheOrden | ritterOrden;
geistlicheOrden : zisterzienserOrden;
zisterzienserOrden : (O CIST | O S BERNARDI) ;

ritterOrden : deutscherOrden | johanniterOrden ;
deutscherOrden : HOSP B MARIE THEUTONICORUM JEROSOL | ORD THEOTON ;
johanniterOrden : HOSP S JOHANNIS JEROSOL ;

akadGrad : grad (IN studienfach)? (KOMMA? grad (IN studienfach)?)* ; // Allow multiple degrees
grad : BAC | MAG | DOCT | LIC | PROF ;
studienfach : ART | DECR | IUR CAN | IUR UTR | THEOL | MED | LEG  ;

extras : (SPECIAL | PUNKT | WORD)+ ;

mProvision : mIntro (pfruende | acquType)+ ;
mIntro : M PROV SUPER ;

acquType :  (tod | uebertritt) natPerson ((DE | AD) (orden | pfruende))?;

uebertritt : (uebertrittwirdfrei| uebertrittistfrei| uebertrittwarfrei);
uebertrittwirdfrei: VACAT? (PER | POST)? TRANSGR (AD (orden | pfruende))? ;
uebertrittistfrei: VAC? (PER | POST)? TRANSGR (AD (orden | pfruende))?  ;
uebertrittwarfrei: POST TRANSGR (AD (orden | pfruende))? ((AD | IN | EX) MON)? ;

tod : (todistfrei| todwirdfrei | todwarfrei) ;
todwirdfrei: VACAT? (PER | POST)? OB ;
todistfrei: VAC? (PER | POST)? OB ;
todwarfrei:  POST OB ;

pfruende : pfruendenNorm | pfruendenInst ;
pfruendenNorm : pfruendenNormType location? ;
pfruendenNormType : PAR ECCL | ARCHIBES ;
pfruendenType : ADMIN | DECAN | CAPELL ;

pfruendenInst : (pfruendenType patroName?)* ((ET | AC) pfruendenType)* instType patroName? orden? location? ;
patroName : (B | BB | SS | S ) ( APL | PTRNAME);
instType : instTypeHaupt instTypeSub? ;
instTypeHaupt : CATHEDRAL | MON | CAPELL | ECCL | HOSP | HOSP PAUPER | DOM;
instTypeSub : CAPELL | ECCL | ALT;

location : (stadt+ (bistum | bistuemer)?) | (bistum | bistuemer) ;
stadt : (IN | EM | PROPE VILLAM)? ortsType? (stadtnamen | diocAbks | ET | AC)+ ortsType? IN? WORD? KOMMA? ; // Allow diocAbks in stadt
bistum : diocAbks DIOCESIS?;
bistuemer : diocAbks (AC | ET) diocAbks? ;
ortsType : OP | OPID | CIV | CIVIT | BURGUO | MAIORIS_CASTRI | CASTRO ;

month : IAN | FEBR | MART | APR | MAI | IUN | IUL | AUG | SEPT | OCT | NOV | DEC ;

stadtnamen : STADTNAMEN ;
name : (WORD (DE (stadt | WORD))? ) ;
alias : (AL | D | DICTUS | AL DICTUS | AL D) name ;
diocAbks : STADTNAMEN ;

// Whitespace
WS : [ \t\r\n]+ -> skip ;` },
    { name: "LexerRegeln.g4", language: "antlr4", content: `// Lexer Rules for tags
HEADTAG : '<head>' ;
CLOSEHEADTAG : '</head>' ;
SUBLEMMATAG : '<sublemma>' ;
CLOSESUBLEMMATAG : '</sublemma>' ;


// Lexer Rules for content
VACAT : 'vacat.' ;
VAC : 'vac.' ;
OB : 'ob.' ;
PER : 'per' | 'per.' ;
POST : 'post' ;
TRANSGR : 'transgr.' ;
AD : 'ad' ;
ET : 'et' ;
CUM : 'cum' ;
AC : 'ac' ;
IN : 'in' ;
EX : 'ex' ;
EM : 'e.m.' ;
DE : 'de' ;
PROPE : 'prope' ;
VILLAM : 'villam' ;
M : 'm.' ;
L : 'L' ;


OP : 'op.' ;
OPID : 'opid.' ;
CIV : 'civ.' ;
CIVIT : 'civit.' ;
BURGUO : 'burguo' ;
MAIORIS_CASTRI : 'maioris castri' ;
CASTRO : 'castro' ;

// months
IAN : 'ian.' ;
FEBR : 'febr.' ;
MART : 'mart.' ;
APR : 'apr.' ;
MAI : 'mai.' ;
IUN : 'iun.' ;
IUL : 'iul.' ;
AUG : 'aug.' ;
SEPT : 'sept.' ;
OCT : 'oct.' ;
NOV : 'nov.' ;
DEC : 'dec.' ;

// Namen
STADTNAMEN: 'Traiectum.' | 'Bodegrauen' | 'Traiect.' ;

PTRNAME : MARIE | ANDREE | MICHAELIS | NICOLAI | SALUATORIS | WALBURGIS ;

MARIE : 'Marie' ;
ANDREE : 'Andree' ;
MICHAELIS : 'Michaelis' ;
NICOLAI : 'Nicolai' ;
SALUATORIS : 'Saluatoris' ;
WALBURGIS : 'Walburgis' ;
BERNARDI : 'Bernardi' ;
THEOTON : 'Theoton.' ;
THEUTONICORUM : 'Theutonicorum' ;
JEROSOL : 'Jerosol.' ;
JOHANNIS : 'Johannis' ;

// alias
AL : 'al.' ;
D : 'd.' ;
DICTUS : 'dictus' ;

// title or academia
CLERIC : 'cler.' ;
MAG : 'mag.' ;
BAC : 'bac.' ;
DECR : 'decr.' ;
ART : 'art.' ;
DOCT : 'doct.' ;
LIC : 'lic.' ;
PROF : 'prof.' ;
THEOL: 'theol.' ;
LAICUS: 'laicus' ;
IUR : 'iur.' ;
CAN : 'can.' ;
UTR : 'utr.' ;
MED : 'med.' ;
LEG : 'leg.' ;

// Weihegrad related
ACOL : 'acol.' ;
ACOLIT : 'acolit.' ;
LECT : 'lect.' ;
ACOLUT : 'acolut' ;
ORD : 'ord.' ;
O : 'o.' ;
S : 's.' ;
ANT : 'Ant.' ;
HEREM : 'Herem.' ;
BEN : 'Ben.' ;
CLUN : 'Clun.' ;
PRED : 'Pred.' ;
MIN : 'Min.' ;
CARMEL : 'Carmel.' ;
CIST : 'Cist.' ;
PREM : 'Prem.' ;
DOM : 'dom.' ;
B : 'b.' ;
BB : 'bb.' ;
SS : 'ss.' ;
APL : 'apl.' ;

// location
PROV : 'prov.' ;
SUPER : 'super' ;
PAR : 'par.' ;
ECCL : 'eccl.' ;
CATHEDRAL: 'cathedr.' ;
CAPELLAN : 'capellan.' ;
HOSP : 'hosp.' ;
PAUPER : 'paup.' | 'pauperum' ;
MON : 'mon.' ;
DIOCESIS : 'dioc.' ;
DICTE : 'dicte' ;
ARCHIBES : ('archipresb.' | 'archipresbit.') WORD ;
ADMIN : 'admin.' ;
CAPELL : 'capel.' | 'capell.' ;
DECAN : 'decan.' ;
ALT : 'alt.' ;


// Lexer Tokens for general purpose (at the bottom of the file)
KOMMA : ',' ;
PUNKT : '.' ;
INT : [0-9]+ ;
WORD : [a-zA-Z][a-zA-Z0-9]* ;
SPECIAL : [;:'"\\-_()?!/=+*<>] ;` },
  ];

  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

  const nodeWidth = 172;
const nodeHeight = 36;
  

export {rootNode, additionNode, nodeWidth, nodeHeight, initialNodes, initialEdges, longTreeTemplate, nestedAdditionNode, numberNode12, numberNode4, grammarFiles, sampleInputText, antlr4MonarchLanguage}