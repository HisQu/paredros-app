grammar Regest;
import Lexer;

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
WS : [ 	]+ -> skip ;