lexer grammar Lexer;

// Lexer Rules for tags
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
SPECIAL : [;:'"\-_()?!/=+*<>] ;