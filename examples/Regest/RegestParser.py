from paredros_debugger.CustomParser import CustomParser
# Generated from Regest.g4 by ANTLR 4.13.2
# encoding: utf-8
from antlr4 import *
from io import StringIO
import sys
if sys.version_info[1] > 5:
	from typing import TextIO
else:
	from typing.io import TextIO

def serializedATN():
    return [
        4,1,115,487,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,
        7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,
        13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
        20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,
        26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,
        33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,
        39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
        46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,
        52,2,53,7,53,2,54,7,54,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,
        2,1,3,1,3,1,4,4,4,125,8,4,11,4,12,4,126,1,4,1,4,1,4,1,5,1,5,3,5,
        134,8,5,1,6,1,6,3,6,138,8,6,1,7,1,7,1,8,1,8,1,8,1,8,3,8,146,8,8,
        1,9,1,9,1,9,1,9,3,9,152,8,9,1,10,3,10,155,8,10,1,10,1,10,3,10,159,
        8,10,4,10,161,8,10,11,10,12,10,162,1,11,1,11,1,11,3,11,168,8,11,
        1,11,3,11,171,8,11,1,12,1,12,1,13,1,13,1,13,1,13,1,13,3,13,180,8,
        13,1,13,3,13,183,8,13,1,14,1,14,1,15,1,15,3,15,189,8,15,1,16,1,16,
        1,17,1,17,1,17,1,17,1,17,3,17,198,8,17,1,18,1,18,3,18,202,8,18,1,
        19,1,19,1,19,1,19,1,19,1,19,1,19,3,19,211,8,19,1,20,1,20,1,20,1,
        20,1,20,1,21,1,21,1,21,3,21,221,8,21,1,21,3,21,224,8,21,1,21,1,21,
        1,21,3,21,229,8,21,5,21,231,8,21,10,21,12,21,234,9,21,1,22,1,22,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,3,23,247,8,23,1,24,
        4,24,250,8,24,11,24,12,24,251,1,25,1,25,1,25,4,25,257,8,25,11,25,
        12,25,258,1,26,1,26,1,26,1,26,1,27,1,27,3,27,267,8,27,1,27,1,27,
        1,27,1,27,3,27,273,8,27,3,27,275,8,27,1,28,1,28,1,28,3,28,280,8,
        28,1,29,3,29,283,8,29,1,29,3,29,286,8,29,1,29,1,29,1,29,1,29,3,29,
        292,8,29,3,29,294,8,29,1,30,3,30,297,8,30,1,30,3,30,300,8,30,1,30,
        1,30,1,30,1,30,3,30,306,8,30,3,30,308,8,30,1,31,1,31,1,31,1,31,1,
        31,3,31,315,8,31,3,31,317,8,31,1,31,1,31,3,31,321,8,31,1,32,1,32,
        1,32,3,32,326,8,32,1,33,3,33,329,8,33,1,33,3,33,332,8,33,1,33,1,
        33,1,34,3,34,337,8,34,1,34,3,34,340,8,34,1,34,1,34,1,35,1,35,1,35,
        1,36,1,36,3,36,349,8,36,1,37,1,37,3,37,353,8,37,1,38,1,38,1,38,3,
        38,358,8,38,1,39,1,39,1,40,1,40,3,40,364,8,40,5,40,366,8,40,10,40,
        12,40,369,9,40,1,40,1,40,5,40,373,8,40,10,40,12,40,376,9,40,1,40,
        1,40,3,40,380,8,40,1,40,3,40,383,8,40,1,40,3,40,386,8,40,1,41,1,
        41,1,41,1,42,1,42,3,42,393,8,42,1,43,1,43,1,43,1,43,1,43,1,43,1,
        43,1,43,3,43,403,8,43,1,44,1,44,1,45,4,45,408,8,45,11,45,12,45,409,
        1,45,1,45,3,45,414,8,45,1,45,1,45,3,45,418,8,45,3,45,420,8,45,1,
        46,1,46,1,46,1,46,3,46,426,8,46,1,46,3,46,429,8,46,1,46,1,46,1,46,
        1,46,4,46,435,8,46,11,46,12,46,436,1,46,3,46,440,8,46,1,46,3,46,
        443,8,46,1,46,3,46,446,8,46,1,46,3,46,449,8,46,1,47,1,47,3,47,453,
        8,47,1,48,1,48,1,48,3,48,458,8,48,1,49,1,49,1,50,1,50,1,51,1,51,
        1,52,1,52,1,52,1,52,3,52,470,8,52,3,52,472,8,52,1,53,1,53,1,53,1,
        53,1,53,1,53,1,53,3,53,481,8,53,1,53,1,53,1,54,1,54,1,54,0,0,55,
        0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,
        46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,
        90,92,94,96,98,100,102,104,106,108,0,12,2,0,60,61,64,66,2,0,112,
        112,114,115,2,0,12,12,19,19,1,0,9,10,2,0,12,12,16,17,1,0,107,109,
        2,0,13,13,15,15,2,0,80,80,91,93,2,0,44,44,94,94,3,0,98,98,108,108,
        110,110,1,0,24,30,1,0,31,42,526,0,110,1,0,0,0,2,113,1,0,0,0,4,117,
        1,0,0,0,6,121,1,0,0,0,8,124,1,0,0,0,10,131,1,0,0,0,12,135,1,0,0,
        0,14,139,1,0,0,0,16,141,1,0,0,0,18,147,1,0,0,0,20,160,1,0,0,0,22,
        167,1,0,0,0,24,172,1,0,0,0,26,182,1,0,0,0,28,184,1,0,0,0,30,188,
        1,0,0,0,32,190,1,0,0,0,34,197,1,0,0,0,36,201,1,0,0,0,38,210,1,0,
        0,0,40,212,1,0,0,0,42,217,1,0,0,0,44,235,1,0,0,0,46,246,1,0,0,0,
        48,249,1,0,0,0,50,253,1,0,0,0,52,260,1,0,0,0,54,266,1,0,0,0,56,279,
        1,0,0,0,58,282,1,0,0,0,60,296,1,0,0,0,62,309,1,0,0,0,64,325,1,0,
        0,0,66,328,1,0,0,0,68,336,1,0,0,0,70,343,1,0,0,0,72,348,1,0,0,0,
        74,350,1,0,0,0,76,357,1,0,0,0,78,359,1,0,0,0,80,367,1,0,0,0,82,387,
        1,0,0,0,84,390,1,0,0,0,86,402,1,0,0,0,88,404,1,0,0,0,90,419,1,0,
        0,0,92,425,1,0,0,0,94,450,1,0,0,0,96,454,1,0,0,0,98,459,1,0,0,0,
        100,461,1,0,0,0,102,463,1,0,0,0,104,465,1,0,0,0,106,480,1,0,0,0,
        108,484,1,0,0,0,110,111,3,2,1,0,111,112,3,4,2,0,112,1,1,0,0,0,113,
        114,5,2,0,0,114,115,3,6,3,0,115,116,5,3,0,0,116,3,1,0,0,0,117,118,
        5,4,0,0,118,119,3,8,4,0,119,120,5,5,0,0,120,5,1,0,0,0,121,122,3,
        10,5,0,122,7,1,0,0,0,123,125,3,14,7,0,124,123,1,0,0,0,125,126,1,
        0,0,0,126,124,1,0,0,0,126,127,1,0,0,0,127,128,1,0,0,0,128,129,3,
        16,8,0,129,130,3,18,9,0,130,9,1,0,0,0,131,133,3,12,6,0,132,134,3,
        20,10,0,133,132,1,0,0,0,133,134,1,0,0,0,134,11,1,0,0,0,135,137,3,
        104,52,0,136,138,3,106,53,0,137,136,1,0,0,0,137,138,1,0,0,0,138,
        13,1,0,0,0,139,140,3,50,25,0,140,15,1,0,0,0,141,142,5,113,0,0,142,
        143,3,100,50,0,143,145,5,113,0,0,144,146,5,112,0,0,145,144,1,0,0,
        0,145,146,1,0,0,0,146,17,1,0,0,0,147,148,5,23,0,0,148,149,5,113,
        0,0,149,151,5,113,0,0,150,152,3,48,24,0,151,150,1,0,0,0,151,152,
        1,0,0,0,152,19,1,0,0,0,153,155,5,111,0,0,154,153,1,0,0,0,154,155,
        1,0,0,0,155,158,1,0,0,0,156,159,3,22,11,0,157,159,3,42,21,0,158,
        156,1,0,0,0,158,157,1,0,0,0,159,161,1,0,0,0,160,154,1,0,0,0,161,
        162,1,0,0,0,162,160,1,0,0,0,162,163,1,0,0,0,163,21,1,0,0,0,164,168,
        3,24,12,0,165,168,3,26,13,0,166,168,3,28,14,0,167,164,1,0,0,0,167,
        165,1,0,0,0,167,166,1,0,0,0,168,170,1,0,0,0,169,171,3,90,45,0,170,
        169,1,0,0,0,170,171,1,0,0,0,171,23,1,0,0,0,172,173,5,59,0,0,173,
        25,1,0,0,0,174,183,5,74,0,0,175,183,5,75,0,0,176,179,5,76,0,0,177,
        178,5,16,0,0,178,180,3,30,15,0,179,177,1,0,0,0,179,180,1,0,0,0,180,
        183,1,0,0,0,181,183,5,77,0,0,182,174,1,0,0,0,182,175,1,0,0,0,182,
        176,1,0,0,0,182,181,1,0,0,0,183,27,1,0,0,0,184,185,5,68,0,0,185,
        29,1,0,0,0,186,189,3,32,16,0,187,189,3,36,18,0,188,186,1,0,0,0,188,
        187,1,0,0,0,189,31,1,0,0,0,190,191,3,34,17,0,191,33,1,0,0,0,192,
        193,5,79,0,0,193,198,5,88,0,0,194,195,5,79,0,0,195,196,5,80,0,0,
        196,198,5,51,0,0,197,192,1,0,0,0,197,194,1,0,0,0,198,35,1,0,0,0,
        199,202,3,38,19,0,200,202,3,40,20,0,201,199,1,0,0,0,201,200,1,0,
        0,0,202,37,1,0,0,0,203,204,5,101,0,0,204,205,5,91,0,0,205,206,5,
        45,0,0,206,207,5,53,0,0,207,211,5,54,0,0,208,209,5,78,0,0,209,211,
        5,52,0,0,210,203,1,0,0,0,210,208,1,0,0,0,211,39,1,0,0,0,212,213,
        5,101,0,0,213,214,5,80,0,0,214,215,5,55,0,0,215,216,5,54,0,0,216,
        41,1,0,0,0,217,220,3,44,22,0,218,219,5,16,0,0,219,221,3,46,23,0,
        220,218,1,0,0,0,220,221,1,0,0,0,221,232,1,0,0,0,222,224,5,111,0,
        0,223,222,1,0,0,0,223,224,1,0,0,0,224,225,1,0,0,0,225,228,3,44,22,
        0,226,227,5,16,0,0,227,229,3,46,23,0,228,226,1,0,0,0,228,229,1,0,
        0,0,229,231,1,0,0,0,230,223,1,0,0,0,231,234,1,0,0,0,232,230,1,0,
        0,0,232,233,1,0,0,0,233,43,1,0,0,0,234,232,1,0,0,0,235,236,7,0,0,
        0,236,45,1,0,0,0,237,247,5,63,0,0,238,247,5,62,0,0,239,240,5,69,
        0,0,240,247,5,70,0,0,241,242,5,69,0,0,242,247,5,71,0,0,243,247,5,
        67,0,0,244,247,5,72,0,0,245,247,5,73,0,0,246,237,1,0,0,0,246,238,
        1,0,0,0,246,239,1,0,0,0,246,241,1,0,0,0,246,243,1,0,0,0,246,244,
        1,0,0,0,246,245,1,0,0,0,247,47,1,0,0,0,248,250,7,1,0,0,249,248,1,
        0,0,0,250,251,1,0,0,0,251,249,1,0,0,0,251,252,1,0,0,0,252,49,1,0,
        0,0,253,256,3,52,26,0,254,257,3,72,36,0,255,257,3,54,27,0,256,254,
        1,0,0,0,256,255,1,0,0,0,257,258,1,0,0,0,258,256,1,0,0,0,258,259,
        1,0,0,0,259,51,1,0,0,0,260,261,5,22,0,0,261,262,5,95,0,0,262,263,
        5,96,0,0,263,53,1,0,0,0,264,267,3,64,32,0,265,267,3,56,28,0,266,
        264,1,0,0,0,266,265,1,0,0,0,267,268,1,0,0,0,268,274,3,10,5,0,269,
        272,7,2,0,0,270,273,3,30,15,0,271,273,3,72,36,0,272,270,1,0,0,0,
        272,271,1,0,0,0,273,275,1,0,0,0,274,269,1,0,0,0,274,275,1,0,0,0,
        275,55,1,0,0,0,276,280,3,58,29,0,277,280,3,60,30,0,278,280,3,62,
        31,0,279,276,1,0,0,0,279,277,1,0,0,0,279,278,1,0,0,0,280,57,1,0,
        0,0,281,283,5,6,0,0,282,281,1,0,0,0,282,283,1,0,0,0,283,285,1,0,
        0,0,284,286,7,3,0,0,285,284,1,0,0,0,285,286,1,0,0,0,286,287,1,0,
        0,0,287,293,5,11,0,0,288,291,5,12,0,0,289,292,3,30,15,0,290,292,
        3,72,36,0,291,289,1,0,0,0,291,290,1,0,0,0,292,294,1,0,0,0,293,288,
        1,0,0,0,293,294,1,0,0,0,294,59,1,0,0,0,295,297,5,7,0,0,296,295,1,
        0,0,0,296,297,1,0,0,0,297,299,1,0,0,0,298,300,7,3,0,0,299,298,1,
        0,0,0,299,300,1,0,0,0,300,301,1,0,0,0,301,307,5,11,0,0,302,305,5,
        12,0,0,303,306,3,30,15,0,304,306,3,72,36,0,305,303,1,0,0,0,305,304,
        1,0,0,0,306,308,1,0,0,0,307,302,1,0,0,0,307,308,1,0,0,0,308,61,1,
        0,0,0,309,310,5,10,0,0,310,316,5,11,0,0,311,314,5,12,0,0,312,315,
        3,30,15,0,313,315,3,72,36,0,314,312,1,0,0,0,314,313,1,0,0,0,315,
        317,1,0,0,0,316,311,1,0,0,0,316,317,1,0,0,0,317,320,1,0,0,0,318,
        319,7,4,0,0,319,321,5,103,0,0,320,318,1,0,0,0,320,321,1,0,0,0,321,
        63,1,0,0,0,322,326,3,68,34,0,323,326,3,66,33,0,324,326,3,70,35,0,
        325,322,1,0,0,0,325,323,1,0,0,0,325,324,1,0,0,0,326,65,1,0,0,0,327,
        329,5,6,0,0,328,327,1,0,0,0,328,329,1,0,0,0,329,331,1,0,0,0,330,
        332,7,3,0,0,331,330,1,0,0,0,331,332,1,0,0,0,332,333,1,0,0,0,333,
        334,5,8,0,0,334,67,1,0,0,0,335,337,5,7,0,0,336,335,1,0,0,0,336,337,
        1,0,0,0,337,339,1,0,0,0,338,340,7,3,0,0,339,338,1,0,0,0,339,340,
        1,0,0,0,340,341,1,0,0,0,341,342,5,8,0,0,342,69,1,0,0,0,343,344,5,
        10,0,0,344,345,5,8,0,0,345,71,1,0,0,0,346,349,3,74,37,0,347,349,
        3,80,40,0,348,346,1,0,0,0,348,347,1,0,0,0,349,73,1,0,0,0,350,352,
        3,76,38,0,351,353,3,90,45,0,352,351,1,0,0,0,352,353,1,0,0,0,353,
        75,1,0,0,0,354,355,5,97,0,0,355,358,5,98,0,0,356,358,5,106,0,0,357,
        354,1,0,0,0,357,356,1,0,0,0,358,77,1,0,0,0,359,360,7,5,0,0,360,79,
        1,0,0,0,361,363,3,78,39,0,362,364,3,82,41,0,363,362,1,0,0,0,363,
        364,1,0,0,0,364,366,1,0,0,0,365,361,1,0,0,0,366,369,1,0,0,0,367,
        365,1,0,0,0,367,368,1,0,0,0,368,374,1,0,0,0,369,367,1,0,0,0,370,
        371,7,6,0,0,371,373,3,78,39,0,372,370,1,0,0,0,373,376,1,0,0,0,374,
        372,1,0,0,0,374,375,1,0,0,0,375,377,1,0,0,0,376,374,1,0,0,0,377,
        379,3,84,42,0,378,380,3,82,41,0,379,378,1,0,0,0,379,380,1,0,0,0,
        380,382,1,0,0,0,381,383,3,30,15,0,382,381,1,0,0,0,382,383,1,0,0,
        0,383,385,1,0,0,0,384,386,3,90,45,0,385,384,1,0,0,0,385,386,1,0,
        0,0,386,81,1,0,0,0,387,388,7,7,0,0,388,389,7,8,0,0,389,83,1,0,0,
        0,390,392,3,86,43,0,391,393,3,88,44,0,392,391,1,0,0,0,392,393,1,
        0,0,0,393,85,1,0,0,0,394,403,5,99,0,0,395,403,5,103,0,0,396,403,
        5,108,0,0,397,403,5,98,0,0,398,403,5,101,0,0,399,400,5,101,0,0,400,
        403,5,102,0,0,401,403,5,90,0,0,402,394,1,0,0,0,402,395,1,0,0,0,402,
        396,1,0,0,0,402,397,1,0,0,0,402,398,1,0,0,0,402,399,1,0,0,0,402,
        401,1,0,0,0,403,87,1,0,0,0,404,405,7,9,0,0,405,89,1,0,0,0,406,408,
        3,92,46,0,407,406,1,0,0,0,408,409,1,0,0,0,409,407,1,0,0,0,409,410,
        1,0,0,0,410,413,1,0,0,0,411,414,3,94,47,0,412,414,3,96,48,0,413,
        411,1,0,0,0,413,412,1,0,0,0,413,414,1,0,0,0,414,420,1,0,0,0,415,
        418,3,94,47,0,416,418,3,96,48,0,417,415,1,0,0,0,417,416,1,0,0,0,
        418,420,1,0,0,0,419,407,1,0,0,0,419,417,1,0,0,0,420,91,1,0,0,0,421,
        426,5,16,0,0,422,426,5,18,0,0,423,424,5,20,0,0,424,426,5,21,0,0,
        425,421,1,0,0,0,425,422,1,0,0,0,425,423,1,0,0,0,425,426,1,0,0,0,
        426,428,1,0,0,0,427,429,3,98,49,0,428,427,1,0,0,0,428,429,1,0,0,
        0,429,434,1,0,0,0,430,435,3,102,51,0,431,435,3,108,54,0,432,435,
        5,13,0,0,433,435,5,15,0,0,434,430,1,0,0,0,434,431,1,0,0,0,434,432,
        1,0,0,0,434,433,1,0,0,0,435,436,1,0,0,0,436,434,1,0,0,0,436,437,
        1,0,0,0,437,439,1,0,0,0,438,440,3,98,49,0,439,438,1,0,0,0,439,440,
        1,0,0,0,440,442,1,0,0,0,441,443,5,16,0,0,442,441,1,0,0,0,442,443,
        1,0,0,0,443,445,1,0,0,0,444,446,5,114,0,0,445,444,1,0,0,0,445,446,
        1,0,0,0,446,448,1,0,0,0,447,449,5,111,0,0,448,447,1,0,0,0,448,449,
        1,0,0,0,449,93,1,0,0,0,450,452,3,108,54,0,451,453,5,104,0,0,452,
        451,1,0,0,0,452,453,1,0,0,0,453,95,1,0,0,0,454,455,3,108,54,0,455,
        457,7,6,0,0,456,458,3,108,54,0,457,456,1,0,0,0,457,458,1,0,0,0,458,
        97,1,0,0,0,459,460,7,10,0,0,460,99,1,0,0,0,461,462,7,11,0,0,462,
        101,1,0,0,0,463,464,5,43,0,0,464,103,1,0,0,0,465,471,5,114,0,0,466,
        469,5,19,0,0,467,470,3,92,46,0,468,470,5,114,0,0,469,467,1,0,0,0,
        469,468,1,0,0,0,470,472,1,0,0,0,471,466,1,0,0,0,471,472,1,0,0,0,
        472,105,1,0,0,0,473,481,5,56,0,0,474,481,5,57,0,0,475,481,5,58,0,
        0,476,477,5,56,0,0,477,481,5,58,0,0,478,479,5,56,0,0,479,481,5,57,
        0,0,480,473,1,0,0,0,480,474,1,0,0,0,480,475,1,0,0,0,480,476,1,0,
        0,0,480,478,1,0,0,0,481,482,1,0,0,0,482,483,3,104,52,0,483,107,1,
        0,0,0,484,485,5,43,0,0,485,109,1,0,0,0,72,126,133,137,145,151,154,
        158,162,167,170,179,182,188,197,201,210,220,223,228,232,246,251,
        256,258,266,272,274,279,282,285,291,293,296,299,305,307,314,316,
        320,325,328,331,336,339,348,352,357,363,367,374,379,382,385,392,
        402,409,413,417,419,425,428,434,436,439,442,445,448,452,457,469,
        471,480
    ]

class RegestParser ( CustomParser ):

    grammarFileName = "Regest.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "<INVALID>", "'<head>'", "'</head>'", 
                     "'<sublemma>'", "'</sublemma>'", "'vacat.'", "'vac.'", 
                     "'ob.'", "<INVALID>", "'post'", "'transgr.'", "'ad'", 
                     "'et'", "'cum'", "'ac'", "'in'", "'ex'", "'e.m.'", 
                     "'de'", "'prope'", "'villam'", "'m.'", "'L'", "'op.'", 
                     "'opid.'", "'civ.'", "'civit.'", "'burguo'", "'maioris castri'", 
                     "'castro'", "'ian.'", "'febr.'", "'mart.'", "'apr.'", 
                     "'mai.'", "'iun.'", "'iul.'", "'aug.'", "'sept.'", 
                     "'oct.'", "'nov.'", "'dec.'", "<INVALID>", "<INVALID>", 
                     "'Marie'", "'Andree'", "'Michaelis'", "'Nicolai'", 
                     "'Saluatoris'", "'Walburgis'", "'Bernardi'", "'Theoton.'", 
                     "'Theutonicorum'", "'Jerosol.'", "'Johannis'", "'al.'", 
                     "'d.'", "'dictus'", "'cler.'", "'mag.'", "'bac.'", 
                     "'decr.'", "'art.'", "'doct.'", "'lic.'", "'prof.'", 
                     "'theol.'", "'laicus'", "'iur.'", "'can.'", "'utr.'", 
                     "'med.'", "'leg.'", "'acol.'", "'acolit.'", "'lect.'", 
                     "'acolut'", "'ord.'", "'o.'", "'s.'", "'Ant.'", "'Herem.'", 
                     "'Ben.'", "'Clun.'", "'Pred.'", "'Min.'", "'Carmel.'", 
                     "'Cist.'", "'Prem.'", "'dom.'", "'b.'", "'bb.'", "'ss.'", 
                     "'apl.'", "'prov.'", "'super'", "'par.'", "'eccl.'", 
                     "'cathedr.'", "'capellan.'", "'hosp.'", "<INVALID>", 
                     "'mon.'", "'dioc.'", "'dicte'", "<INVALID>", "'admin.'", 
                     "<INVALID>", "'decan.'", "'alt.'", "','", "'.'" ]

    symbolicNames = [ "<INVALID>", "WS", "HEADTAG", "CLOSEHEADTAG", "SUBLEMMATAG", 
                      "CLOSESUBLEMMATAG", "VACAT", "VAC", "OB", "PER", "POST", 
                      "TRANSGR", "AD", "ET", "CUM", "AC", "IN", "EX", "EM", 
                      "DE", "PROPE", "VILLAM", "M", "L", "OP", "OPID", "CIV", 
                      "CIVIT", "BURGUO", "MAIORIS_CASTRI", "CASTRO", "IAN", 
                      "FEBR", "MART", "APR", "MAI", "IUN", "IUL", "AUG", 
                      "SEPT", "OCT", "NOV", "DEC", "STADTNAMEN", "PTRNAME", 
                      "MARIE", "ANDREE", "MICHAELIS", "NICOLAI", "SALUATORIS", 
                      "WALBURGIS", "BERNARDI", "THEOTON", "THEUTONICORUM", 
                      "JEROSOL", "JOHANNIS", "AL", "D", "DICTUS", "CLERIC", 
                      "MAG", "BAC", "DECR", "ART", "DOCT", "LIC", "PROF", 
                      "THEOL", "LAICUS", "IUR", "CAN", "UTR", "MED", "LEG", 
                      "ACOL", "ACOLIT", "LECT", "ACOLUT", "ORD", "O", "S", 
                      "ANT", "HEREM", "BEN", "CLUN", "PRED", "MIN", "CARMEL", 
                      "CIST", "PREM", "DOM", "B", "BB", "SS", "APL", "PROV", 
                      "SUPER", "PAR", "ECCL", "CATHEDRAL", "CAPELLAN", "HOSP", 
                      "PAUPER", "MON", "DIOCESIS", "DICTE", "ARCHIBES", 
                      "ADMIN", "CAPELL", "DECAN", "ALT", "KOMMA", "PUNKT", 
                      "INT", "WORD", "SPECIAL" ]

    RULE_startRule = 0
    RULE_head = 1
    RULE_sublemma = 2
    RULE_headInhalt = 3
    RULE_sublemmaInhalt = 4
    RULE_natPerson = 5
    RULE_personName = 6
    RULE_provision = 7
    RULE_date = 8
    RULE_fund = 9
    RULE_vita = 10
    RULE_inkardination = 11
    RULE_h_weihegrad = 12
    RULE_n_weihegrad = 13
    RULE_kein_weihegrad = 14
    RULE_orden = 15
    RULE_geistlicheOrden = 16
    RULE_zisterzienserOrden = 17
    RULE_ritterOrden = 18
    RULE_deutscherOrden = 19
    RULE_johanniterOrden = 20
    RULE_akadGrad = 21
    RULE_grad = 22
    RULE_studienfach = 23
    RULE_extras = 24
    RULE_mProvision = 25
    RULE_mIntro = 26
    RULE_acquType = 27
    RULE_uebertritt = 28
    RULE_uebertrittwirdfrei = 29
    RULE_uebertrittistfrei = 30
    RULE_uebertrittwarfrei = 31
    RULE_tod = 32
    RULE_todwirdfrei = 33
    RULE_todistfrei = 34
    RULE_todwarfrei = 35
    RULE_pfruende = 36
    RULE_pfruendenNorm = 37
    RULE_pfruendenNormType = 38
    RULE_pfruendenType = 39
    RULE_pfruendenInst = 40
    RULE_patroName = 41
    RULE_instType = 42
    RULE_instTypeHaupt = 43
    RULE_instTypeSub = 44
    RULE_location = 45
    RULE_stadt = 46
    RULE_bistum = 47
    RULE_bistuemer = 48
    RULE_ortsType = 49
    RULE_month = 50
    RULE_stadtnamen = 51
    RULE_name = 52
    RULE_alias = 53
    RULE_diocAbks = 54

    ruleNames =  [ "startRule", "head", "sublemma", "headInhalt", "sublemmaInhalt", 
                   "natPerson", "personName", "provision", "date", "fund", 
                   "vita", "inkardination", "h_weihegrad", "n_weihegrad", 
                   "kein_weihegrad", "orden", "geistlicheOrden", "zisterzienserOrden", 
                   "ritterOrden", "deutscherOrden", "johanniterOrden", "akadGrad", 
                   "grad", "studienfach", "extras", "mProvision", "mIntro", 
                   "acquType", "uebertritt", "uebertrittwirdfrei", "uebertrittistfrei", 
                   "uebertrittwarfrei", "tod", "todwirdfrei", "todistfrei", 
                   "todwarfrei", "pfruende", "pfruendenNorm", "pfruendenNormType", 
                   "pfruendenType", "pfruendenInst", "patroName", "instType", 
                   "instTypeHaupt", "instTypeSub", "location", "stadt", 
                   "bistum", "bistuemer", "ortsType", "month", "stadtnamen", 
                   "name", "alias", "diocAbks" ]

    EOF = Token.EOF
    WS=1
    HEADTAG=2
    CLOSEHEADTAG=3
    SUBLEMMATAG=4
    CLOSESUBLEMMATAG=5
    VACAT=6
    VAC=7
    OB=8
    PER=9
    POST=10
    TRANSGR=11
    AD=12
    ET=13
    CUM=14
    AC=15
    IN=16
    EX=17
    EM=18
    DE=19
    PROPE=20
    VILLAM=21
    M=22
    L=23
    OP=24
    OPID=25
    CIV=26
    CIVIT=27
    BURGUO=28
    MAIORIS_CASTRI=29
    CASTRO=30
    IAN=31
    FEBR=32
    MART=33
    APR=34
    MAI=35
    IUN=36
    IUL=37
    AUG=38
    SEPT=39
    OCT=40
    NOV=41
    DEC=42
    STADTNAMEN=43
    PTRNAME=44
    MARIE=45
    ANDREE=46
    MICHAELIS=47
    NICOLAI=48
    SALUATORIS=49
    WALBURGIS=50
    BERNARDI=51
    THEOTON=52
    THEUTONICORUM=53
    JEROSOL=54
    JOHANNIS=55
    AL=56
    D=57
    DICTUS=58
    CLERIC=59
    MAG=60
    BAC=61
    DECR=62
    ART=63
    DOCT=64
    LIC=65
    PROF=66
    THEOL=67
    LAICUS=68
    IUR=69
    CAN=70
    UTR=71
    MED=72
    LEG=73
    ACOL=74
    ACOLIT=75
    LECT=76
    ACOLUT=77
    ORD=78
    O=79
    S=80
    ANT=81
    HEREM=82
    BEN=83
    CLUN=84
    PRED=85
    MIN=86
    CARMEL=87
    CIST=88
    PREM=89
    DOM=90
    B=91
    BB=92
    SS=93
    APL=94
    PROV=95
    SUPER=96
    PAR=97
    ECCL=98
    CATHEDRAL=99
    CAPELLAN=100
    HOSP=101
    PAUPER=102
    MON=103
    DIOCESIS=104
    DICTE=105
    ARCHIBES=106
    ADMIN=107
    CAPELL=108
    DECAN=109
    ALT=110
    KOMMA=111
    PUNKT=112
    INT=113
    WORD=114
    SPECIAL=115

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.13.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None




    class StartRuleContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def head(self):
            return self.getTypedRuleContext(RegestParser.HeadContext,0)


        def sublemma(self):
            return self.getTypedRuleContext(RegestParser.SublemmaContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_startRule

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterStartRule" ):
                listener.enterStartRule(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitStartRule" ):
                listener.exitStartRule(self)




    def startRule(self):

        localctx = RegestParser.StartRuleContext(self, self._ctx, self.state)
        self.enterRule(localctx, 0, self.RULE_startRule)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 110
            self.head()
            self.state = 111
            self.sublemma()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class HeadContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def HEADTAG(self):
            return self.getToken(RegestParser.HEADTAG, 0)

        def headInhalt(self):
            return self.getTypedRuleContext(RegestParser.HeadInhaltContext,0)


        def CLOSEHEADTAG(self):
            return self.getToken(RegestParser.CLOSEHEADTAG, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_head

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterHead" ):
                listener.enterHead(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitHead" ):
                listener.exitHead(self)




    def head(self):

        localctx = RegestParser.HeadContext(self, self._ctx, self.state)
        self.enterRule(localctx, 2, self.RULE_head)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 113
            self.match(RegestParser.HEADTAG)
            self.state = 114
            self.headInhalt()
            self.state = 115
            self.match(RegestParser.CLOSEHEADTAG)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class SublemmaContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def SUBLEMMATAG(self):
            return self.getToken(RegestParser.SUBLEMMATAG, 0)

        def sublemmaInhalt(self):
            return self.getTypedRuleContext(RegestParser.SublemmaInhaltContext,0)


        def CLOSESUBLEMMATAG(self):
            return self.getToken(RegestParser.CLOSESUBLEMMATAG, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_sublemma

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterSublemma" ):
                listener.enterSublemma(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitSublemma" ):
                listener.exitSublemma(self)




    def sublemma(self):

        localctx = RegestParser.SublemmaContext(self, self._ctx, self.state)
        self.enterRule(localctx, 4, self.RULE_sublemma)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 117
            self.match(RegestParser.SUBLEMMATAG)
            self.state = 118
            self.sublemmaInhalt()
            self.state = 119
            self.match(RegestParser.CLOSESUBLEMMATAG)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class HeadInhaltContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def natPerson(self):
            return self.getTypedRuleContext(RegestParser.NatPersonContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_headInhalt

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterHeadInhalt" ):
                listener.enterHeadInhalt(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitHeadInhalt" ):
                listener.exitHeadInhalt(self)




    def headInhalt(self):

        localctx = RegestParser.HeadInhaltContext(self, self._ctx, self.state)
        self.enterRule(localctx, 6, self.RULE_headInhalt)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 121
            self.natPerson()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class SublemmaInhaltContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def date(self):
            return self.getTypedRuleContext(RegestParser.DateContext,0)


        def fund(self):
            return self.getTypedRuleContext(RegestParser.FundContext,0)


        def provision(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.ProvisionContext)
            else:
                return self.getTypedRuleContext(RegestParser.ProvisionContext,i)


        def getRuleIndex(self):
            return RegestParser.RULE_sublemmaInhalt

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterSublemmaInhalt" ):
                listener.enterSublemmaInhalt(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitSublemmaInhalt" ):
                listener.exitSublemmaInhalt(self)




    def sublemmaInhalt(self):

        localctx = RegestParser.SublemmaInhaltContext(self, self._ctx, self.state)
        self.enterRule(localctx, 8, self.RULE_sublemmaInhalt)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 124 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 123
                self.provision()
                self.state = 126 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not (_la==22):
                    break

            self.state = 128
            self.date()
            self.state = 129
            self.fund()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class NatPersonContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def personName(self):
            return self.getTypedRuleContext(RegestParser.PersonNameContext,0)


        def vita(self):
            return self.getTypedRuleContext(RegestParser.VitaContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_natPerson

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterNatPerson" ):
                listener.enterNatPerson(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitNatPerson" ):
                listener.exitNatPerson(self)




    def natPerson(self):

        localctx = RegestParser.NatPersonContext(self, self._ctx, self.state)
        self.enterRule(localctx, 10, self.RULE_natPerson)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 131
            self.personName()
            self.state = 133
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if ((((_la - 59)) & ~0x3f) == 0 and ((1 << (_la - 59)) & 4503599627862759) != 0):
                self.state = 132
                self.vita()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PersonNameContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def name(self):
            return self.getTypedRuleContext(RegestParser.NameContext,0)


        def alias(self):
            return self.getTypedRuleContext(RegestParser.AliasContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_personName

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPersonName" ):
                listener.enterPersonName(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPersonName" ):
                listener.exitPersonName(self)




    def personName(self):

        localctx = RegestParser.PersonNameContext(self, self._ctx, self.state)
        self.enterRule(localctx, 12, self.RULE_personName)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 135
            self.name()
            self.state = 137
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if (((_la) & ~0x3f) == 0 and ((1 << _la) & 504403158265495552) != 0):
                self.state = 136
                self.alias()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ProvisionContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def mProvision(self):
            return self.getTypedRuleContext(RegestParser.MProvisionContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_provision

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterProvision" ):
                listener.enterProvision(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitProvision" ):
                listener.exitProvision(self)




    def provision(self):

        localctx = RegestParser.ProvisionContext(self, self._ctx, self.state)
        self.enterRule(localctx, 14, self.RULE_provision)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 139
            self.mProvision()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DateContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def INT(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.INT)
            else:
                return self.getToken(RegestParser.INT, i)

        def month(self):
            return self.getTypedRuleContext(RegestParser.MonthContext,0)


        def PUNKT(self):
            return self.getToken(RegestParser.PUNKT, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_date

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterDate" ):
                listener.enterDate(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitDate" ):
                listener.exitDate(self)




    def date(self):

        localctx = RegestParser.DateContext(self, self._ctx, self.state)
        self.enterRule(localctx, 16, self.RULE_date)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 141
            self.match(RegestParser.INT)
            self.state = 142
            self.month()
            self.state = 143
            self.match(RegestParser.INT)
            self.state = 145
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==112:
                self.state = 144
                self.match(RegestParser.PUNKT)


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class FundContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def L(self):
            return self.getToken(RegestParser.L, 0)

        def INT(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.INT)
            else:
                return self.getToken(RegestParser.INT, i)

        def extras(self):
            return self.getTypedRuleContext(RegestParser.ExtrasContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_fund

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterFund" ):
                listener.enterFund(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitFund" ):
                listener.exitFund(self)




    def fund(self):

        localctx = RegestParser.FundContext(self, self._ctx, self.state)
        self.enterRule(localctx, 18, self.RULE_fund)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 147
            self.match(RegestParser.L)
            self.state = 148
            self.match(RegestParser.INT)
            self.state = 149
            self.match(RegestParser.INT)
            self.state = 151
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if ((((_la - 112)) & ~0x3f) == 0 and ((1 << (_la - 112)) & 13) != 0):
                self.state = 150
                self.extras()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class VitaContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def inkardination(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.InkardinationContext)
            else:
                return self.getTypedRuleContext(RegestParser.InkardinationContext,i)


        def akadGrad(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.AkadGradContext)
            else:
                return self.getTypedRuleContext(RegestParser.AkadGradContext,i)


        def KOMMA(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.KOMMA)
            else:
                return self.getToken(RegestParser.KOMMA, i)

        def getRuleIndex(self):
            return RegestParser.RULE_vita

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterVita" ):
                listener.enterVita(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitVita" ):
                listener.exitVita(self)




    def vita(self):

        localctx = RegestParser.VitaContext(self, self._ctx, self.state)
        self.enterRule(localctx, 20, self.RULE_vita)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 160 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 154
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if _la==111:
                    self.state = 153
                    self.match(RegestParser.KOMMA)


                self.state = 158
                self._errHandler.sync(self)
                token = self._input.LA(1)
                if token in [59, 68, 74, 75, 76, 77]:
                    self.state = 156
                    self.inkardination()
                    pass
                elif token in [60, 61, 64, 65, 66]:
                    self.state = 157
                    self.akadGrad()
                    pass
                else:
                    raise NoViableAltException(self)

                self.state = 162 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not (((((_la - 59)) & ~0x3f) == 0 and ((1 << (_la - 59)) & 4503599627862759) != 0)):
                    break

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class InkardinationContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def h_weihegrad(self):
            return self.getTypedRuleContext(RegestParser.H_weihegradContext,0)


        def n_weihegrad(self):
            return self.getTypedRuleContext(RegestParser.N_weihegradContext,0)


        def kein_weihegrad(self):
            return self.getTypedRuleContext(RegestParser.Kein_weihegradContext,0)


        def location(self):
            return self.getTypedRuleContext(RegestParser.LocationContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_inkardination

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterInkardination" ):
                listener.enterInkardination(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitInkardination" ):
                listener.exitInkardination(self)




    def inkardination(self):

        localctx = RegestParser.InkardinationContext(self, self._ctx, self.state)
        self.enterRule(localctx, 22, self.RULE_inkardination)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 167
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [59]:
                self.state = 164
                self.h_weihegrad()
                pass
            elif token in [74, 75, 76, 77]:
                self.state = 165
                self.n_weihegrad()
                pass
            elif token in [68]:
                self.state = 166
                self.kein_weihegrad()
                pass
            else:
                raise NoViableAltException(self)

            self.state = 170
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,9,self._ctx)
            if la_ == 1:
                self.state = 169
                self.location()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class H_weihegradContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def CLERIC(self):
            return self.getToken(RegestParser.CLERIC, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_h_weihegrad

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterH_weihegrad" ):
                listener.enterH_weihegrad(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitH_weihegrad" ):
                listener.exitH_weihegrad(self)




    def h_weihegrad(self):

        localctx = RegestParser.H_weihegradContext(self, self._ctx, self.state)
        self.enterRule(localctx, 24, self.RULE_h_weihegrad)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 172
            self.match(RegestParser.CLERIC)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class N_weihegradContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def ACOL(self):
            return self.getToken(RegestParser.ACOL, 0)

        def ACOLIT(self):
            return self.getToken(RegestParser.ACOLIT, 0)

        def LECT(self):
            return self.getToken(RegestParser.LECT, 0)

        def IN(self):
            return self.getToken(RegestParser.IN, 0)

        def orden(self):
            return self.getTypedRuleContext(RegestParser.OrdenContext,0)


        def ACOLUT(self):
            return self.getToken(RegestParser.ACOLUT, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_n_weihegrad

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterN_weihegrad" ):
                listener.enterN_weihegrad(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitN_weihegrad" ):
                listener.exitN_weihegrad(self)




    def n_weihegrad(self):

        localctx = RegestParser.N_weihegradContext(self, self._ctx, self.state)
        self.enterRule(localctx, 26, self.RULE_n_weihegrad)
        try:
            self.state = 182
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [74]:
                self.enterOuterAlt(localctx, 1)
                self.state = 174
                self.match(RegestParser.ACOL)
                pass
            elif token in [75]:
                self.enterOuterAlt(localctx, 2)
                self.state = 175
                self.match(RegestParser.ACOLIT)
                pass
            elif token in [76]:
                self.enterOuterAlt(localctx, 3)
                self.state = 176
                self.match(RegestParser.LECT)
                self.state = 179
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,10,self._ctx)
                if la_ == 1:
                    self.state = 177
                    self.match(RegestParser.IN)
                    self.state = 178
                    self.orden()


                pass
            elif token in [77]:
                self.enterOuterAlt(localctx, 4)
                self.state = 181
                self.match(RegestParser.ACOLUT)
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class Kein_weihegradContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LAICUS(self):
            return self.getToken(RegestParser.LAICUS, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_kein_weihegrad

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterKein_weihegrad" ):
                listener.enterKein_weihegrad(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitKein_weihegrad" ):
                listener.exitKein_weihegrad(self)




    def kein_weihegrad(self):

        localctx = RegestParser.Kein_weihegradContext(self, self._ctx, self.state)
        self.enterRule(localctx, 28, self.RULE_kein_weihegrad)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 184
            self.match(RegestParser.LAICUS)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class OrdenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def geistlicheOrden(self):
            return self.getTypedRuleContext(RegestParser.GeistlicheOrdenContext,0)


        def ritterOrden(self):
            return self.getTypedRuleContext(RegestParser.RitterOrdenContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_orden

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterOrden" ):
                listener.enterOrden(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitOrden" ):
                listener.exitOrden(self)




    def orden(self):

        localctx = RegestParser.OrdenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 30, self.RULE_orden)
        try:
            self.state = 188
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [79]:
                self.enterOuterAlt(localctx, 1)
                self.state = 186
                self.geistlicheOrden()
                pass
            elif token in [78, 101]:
                self.enterOuterAlt(localctx, 2)
                self.state = 187
                self.ritterOrden()
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class GeistlicheOrdenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def zisterzienserOrden(self):
            return self.getTypedRuleContext(RegestParser.ZisterzienserOrdenContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_geistlicheOrden

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterGeistlicheOrden" ):
                listener.enterGeistlicheOrden(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitGeistlicheOrden" ):
                listener.exitGeistlicheOrden(self)




    def geistlicheOrden(self):

        localctx = RegestParser.GeistlicheOrdenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 32, self.RULE_geistlicheOrden)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 190
            self.zisterzienserOrden()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ZisterzienserOrdenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def O(self):
            return self.getToken(RegestParser.O, 0)

        def CIST(self):
            return self.getToken(RegestParser.CIST, 0)

        def S(self):
            return self.getToken(RegestParser.S, 0)

        def BERNARDI(self):
            return self.getToken(RegestParser.BERNARDI, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_zisterzienserOrden

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterZisterzienserOrden" ):
                listener.enterZisterzienserOrden(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitZisterzienserOrden" ):
                listener.exitZisterzienserOrden(self)




    def zisterzienserOrden(self):

        localctx = RegestParser.ZisterzienserOrdenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 34, self.RULE_zisterzienserOrden)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 197
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,13,self._ctx)
            if la_ == 1:
                self.state = 192
                self.match(RegestParser.O)
                self.state = 193
                self.match(RegestParser.CIST)
                pass

            elif la_ == 2:
                self.state = 194
                self.match(RegestParser.O)
                self.state = 195
                self.match(RegestParser.S)
                self.state = 196
                self.match(RegestParser.BERNARDI)
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class RitterOrdenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def deutscherOrden(self):
            return self.getTypedRuleContext(RegestParser.DeutscherOrdenContext,0)


        def johanniterOrden(self):
            return self.getTypedRuleContext(RegestParser.JohanniterOrdenContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_ritterOrden

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterRitterOrden" ):
                listener.enterRitterOrden(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitRitterOrden" ):
                listener.exitRitterOrden(self)




    def ritterOrden(self):

        localctx = RegestParser.RitterOrdenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 36, self.RULE_ritterOrden)
        try:
            self.state = 201
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,14,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 199
                self.deutscherOrden()
                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 200
                self.johanniterOrden()
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DeutscherOrdenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def HOSP(self):
            return self.getToken(RegestParser.HOSP, 0)

        def B(self):
            return self.getToken(RegestParser.B, 0)

        def MARIE(self):
            return self.getToken(RegestParser.MARIE, 0)

        def THEUTONICORUM(self):
            return self.getToken(RegestParser.THEUTONICORUM, 0)

        def JEROSOL(self):
            return self.getToken(RegestParser.JEROSOL, 0)

        def ORD(self):
            return self.getToken(RegestParser.ORD, 0)

        def THEOTON(self):
            return self.getToken(RegestParser.THEOTON, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_deutscherOrden

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterDeutscherOrden" ):
                listener.enterDeutscherOrden(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitDeutscherOrden" ):
                listener.exitDeutscherOrden(self)




    def deutscherOrden(self):

        localctx = RegestParser.DeutscherOrdenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 38, self.RULE_deutscherOrden)
        try:
            self.state = 210
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [101]:
                self.enterOuterAlt(localctx, 1)
                self.state = 203
                self.match(RegestParser.HOSP)
                self.state = 204
                self.match(RegestParser.B)
                self.state = 205
                self.match(RegestParser.MARIE)
                self.state = 206
                self.match(RegestParser.THEUTONICORUM)
                self.state = 207
                self.match(RegestParser.JEROSOL)
                pass
            elif token in [78]:
                self.enterOuterAlt(localctx, 2)
                self.state = 208
                self.match(RegestParser.ORD)
                self.state = 209
                self.match(RegestParser.THEOTON)
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class JohanniterOrdenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def HOSP(self):
            return self.getToken(RegestParser.HOSP, 0)

        def S(self):
            return self.getToken(RegestParser.S, 0)

        def JOHANNIS(self):
            return self.getToken(RegestParser.JOHANNIS, 0)

        def JEROSOL(self):
            return self.getToken(RegestParser.JEROSOL, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_johanniterOrden

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterJohanniterOrden" ):
                listener.enterJohanniterOrden(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitJohanniterOrden" ):
                listener.exitJohanniterOrden(self)




    def johanniterOrden(self):

        localctx = RegestParser.JohanniterOrdenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 40, self.RULE_johanniterOrden)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 212
            self.match(RegestParser.HOSP)
            self.state = 213
            self.match(RegestParser.S)
            self.state = 214
            self.match(RegestParser.JOHANNIS)
            self.state = 215
            self.match(RegestParser.JEROSOL)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class AkadGradContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def grad(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.GradContext)
            else:
                return self.getTypedRuleContext(RegestParser.GradContext,i)


        def IN(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.IN)
            else:
                return self.getToken(RegestParser.IN, i)

        def studienfach(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.StudienfachContext)
            else:
                return self.getTypedRuleContext(RegestParser.StudienfachContext,i)


        def KOMMA(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.KOMMA)
            else:
                return self.getToken(RegestParser.KOMMA, i)

        def getRuleIndex(self):
            return RegestParser.RULE_akadGrad

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAkadGrad" ):
                listener.enterAkadGrad(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAkadGrad" ):
                listener.exitAkadGrad(self)




    def akadGrad(self):

        localctx = RegestParser.AkadGradContext(self, self._ctx, self.state)
        self.enterRule(localctx, 42, self.RULE_akadGrad)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 217
            self.grad()
            self.state = 220
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==16:
                self.state = 218
                self.match(RegestParser.IN)
                self.state = 219
                self.studienfach()


            self.state = 232
            self._errHandler.sync(self)
            _alt = self._interp.adaptivePredict(self._input,19,self._ctx)
            while _alt!=2 and _alt!=ATN.INVALID_ALT_NUMBER:
                if _alt==1:
                    self.state = 223
                    self._errHandler.sync(self)
                    _la = self._input.LA(1)
                    if _la==111:
                        self.state = 222
                        self.match(RegestParser.KOMMA)


                    self.state = 225
                    self.grad()
                    self.state = 228
                    self._errHandler.sync(self)
                    _la = self._input.LA(1)
                    if _la==16:
                        self.state = 226
                        self.match(RegestParser.IN)
                        self.state = 227
                        self.studienfach()

             
                self.state = 234
                self._errHandler.sync(self)
                _alt = self._interp.adaptivePredict(self._input,19,self._ctx)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class GradContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def BAC(self):
            return self.getToken(RegestParser.BAC, 0)

        def MAG(self):
            return self.getToken(RegestParser.MAG, 0)

        def DOCT(self):
            return self.getToken(RegestParser.DOCT, 0)

        def LIC(self):
            return self.getToken(RegestParser.LIC, 0)

        def PROF(self):
            return self.getToken(RegestParser.PROF, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_grad

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterGrad" ):
                listener.enterGrad(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitGrad" ):
                listener.exitGrad(self)




    def grad(self):

        localctx = RegestParser.GradContext(self, self._ctx, self.state)
        self.enterRule(localctx, 44, self.RULE_grad)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 235
            _la = self._input.LA(1)
            if not(((((_la - 60)) & ~0x3f) == 0 and ((1 << (_la - 60)) & 115) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class StudienfachContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def ART(self):
            return self.getToken(RegestParser.ART, 0)

        def DECR(self):
            return self.getToken(RegestParser.DECR, 0)

        def IUR(self):
            return self.getToken(RegestParser.IUR, 0)

        def CAN(self):
            return self.getToken(RegestParser.CAN, 0)

        def UTR(self):
            return self.getToken(RegestParser.UTR, 0)

        def THEOL(self):
            return self.getToken(RegestParser.THEOL, 0)

        def MED(self):
            return self.getToken(RegestParser.MED, 0)

        def LEG(self):
            return self.getToken(RegestParser.LEG, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_studienfach

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterStudienfach" ):
                listener.enterStudienfach(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitStudienfach" ):
                listener.exitStudienfach(self)




    def studienfach(self):

        localctx = RegestParser.StudienfachContext(self, self._ctx, self.state)
        self.enterRule(localctx, 46, self.RULE_studienfach)
        try:
            self.state = 246
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,20,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 237
                self.match(RegestParser.ART)
                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 238
                self.match(RegestParser.DECR)
                pass

            elif la_ == 3:
                self.enterOuterAlt(localctx, 3)
                self.state = 239
                self.match(RegestParser.IUR)
                self.state = 240
                self.match(RegestParser.CAN)
                pass

            elif la_ == 4:
                self.enterOuterAlt(localctx, 4)
                self.state = 241
                self.match(RegestParser.IUR)
                self.state = 242
                self.match(RegestParser.UTR)
                pass

            elif la_ == 5:
                self.enterOuterAlt(localctx, 5)
                self.state = 243
                self.match(RegestParser.THEOL)
                pass

            elif la_ == 6:
                self.enterOuterAlt(localctx, 6)
                self.state = 244
                self.match(RegestParser.MED)
                pass

            elif la_ == 7:
                self.enterOuterAlt(localctx, 7)
                self.state = 245
                self.match(RegestParser.LEG)
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ExtrasContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def SPECIAL(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.SPECIAL)
            else:
                return self.getToken(RegestParser.SPECIAL, i)

        def PUNKT(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.PUNKT)
            else:
                return self.getToken(RegestParser.PUNKT, i)

        def WORD(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.WORD)
            else:
                return self.getToken(RegestParser.WORD, i)

        def getRuleIndex(self):
            return RegestParser.RULE_extras

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterExtras" ):
                listener.enterExtras(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitExtras" ):
                listener.exitExtras(self)




    def extras(self):

        localctx = RegestParser.ExtrasContext(self, self._ctx, self.state)
        self.enterRule(localctx, 48, self.RULE_extras)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 249 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 248
                _la = self._input.LA(1)
                if not(((((_la - 112)) & ~0x3f) == 0 and ((1 << (_la - 112)) & 13) != 0)):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()
                self.state = 251 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not (((((_la - 112)) & ~0x3f) == 0 and ((1 << (_la - 112)) & 13) != 0)):
                    break

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class MProvisionContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def mIntro(self):
            return self.getTypedRuleContext(RegestParser.MIntroContext,0)


        def pfruende(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.PfruendeContext)
            else:
                return self.getTypedRuleContext(RegestParser.PfruendeContext,i)


        def acquType(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.AcquTypeContext)
            else:
                return self.getTypedRuleContext(RegestParser.AcquTypeContext,i)


        def getRuleIndex(self):
            return RegestParser.RULE_mProvision

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterMProvision" ):
                listener.enterMProvision(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitMProvision" ):
                listener.exitMProvision(self)




    def mProvision(self):

        localctx = RegestParser.MProvisionContext(self, self._ctx, self.state)
        self.enterRule(localctx, 50, self.RULE_mProvision)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 253
            self.mIntro()
            self.state = 256 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 256
                self._errHandler.sync(self)
                token = self._input.LA(1)
                if token in [13, 15, 90, 97, 98, 99, 101, 103, 106, 107, 108, 109]:
                    self.state = 254
                    self.pfruende()
                    pass
                elif token in [6, 7, 8, 9, 10, 11]:
                    self.state = 255
                    self.acquType()
                    pass
                else:
                    raise NoViableAltException(self)

                self.state = 258 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not ((((_la) & ~0x3f) == 0 and ((1 << _la) & 44992) != 0) or ((((_la - 90)) & ~0x3f) == 0 and ((1 << (_la - 90)) & 994177) != 0)):
                    break

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class MIntroContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def M(self):
            return self.getToken(RegestParser.M, 0)

        def PROV(self):
            return self.getToken(RegestParser.PROV, 0)

        def SUPER(self):
            return self.getToken(RegestParser.SUPER, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_mIntro

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterMIntro" ):
                listener.enterMIntro(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitMIntro" ):
                listener.exitMIntro(self)




    def mIntro(self):

        localctx = RegestParser.MIntroContext(self, self._ctx, self.state)
        self.enterRule(localctx, 52, self.RULE_mIntro)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 260
            self.match(RegestParser.M)
            self.state = 261
            self.match(RegestParser.PROV)
            self.state = 262
            self.match(RegestParser.SUPER)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class AcquTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def natPerson(self):
            return self.getTypedRuleContext(RegestParser.NatPersonContext,0)


        def tod(self):
            return self.getTypedRuleContext(RegestParser.TodContext,0)


        def uebertritt(self):
            return self.getTypedRuleContext(RegestParser.UebertrittContext,0)


        def DE(self):
            return self.getToken(RegestParser.DE, 0)

        def AD(self):
            return self.getToken(RegestParser.AD, 0)

        def orden(self):
            return self.getTypedRuleContext(RegestParser.OrdenContext,0)


        def pfruende(self):
            return self.getTypedRuleContext(RegestParser.PfruendeContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_acquType

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAcquType" ):
                listener.enterAcquType(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAcquType" ):
                listener.exitAcquType(self)




    def acquType(self):

        localctx = RegestParser.AcquTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 54, self.RULE_acquType)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 266
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,24,self._ctx)
            if la_ == 1:
                self.state = 264
                self.tod()
                pass

            elif la_ == 2:
                self.state = 265
                self.uebertritt()
                pass


            self.state = 268
            self.natPerson()
            self.state = 274
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==12 or _la==19:
                self.state = 269
                _la = self._input.LA(1)
                if not(_la==12 or _la==19):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()
                self.state = 272
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,25,self._ctx)
                if la_ == 1:
                    self.state = 270
                    self.orden()
                    pass

                elif la_ == 2:
                    self.state = 271
                    self.pfruende()
                    pass




        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class UebertrittContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def uebertrittwirdfrei(self):
            return self.getTypedRuleContext(RegestParser.UebertrittwirdfreiContext,0)


        def uebertrittistfrei(self):
            return self.getTypedRuleContext(RegestParser.UebertrittistfreiContext,0)


        def uebertrittwarfrei(self):
            return self.getTypedRuleContext(RegestParser.UebertrittwarfreiContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_uebertritt

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterUebertritt" ):
                listener.enterUebertritt(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitUebertritt" ):
                listener.exitUebertritt(self)




    def uebertritt(self):

        localctx = RegestParser.UebertrittContext(self, self._ctx, self.state)
        self.enterRule(localctx, 56, self.RULE_uebertritt)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 279
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,27,self._ctx)
            if la_ == 1:
                self.state = 276
                self.uebertrittwirdfrei()
                pass

            elif la_ == 2:
                self.state = 277
                self.uebertrittistfrei()
                pass

            elif la_ == 3:
                self.state = 278
                self.uebertrittwarfrei()
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class UebertrittwirdfreiContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def TRANSGR(self):
            return self.getToken(RegestParser.TRANSGR, 0)

        def VACAT(self):
            return self.getToken(RegestParser.VACAT, 0)

        def AD(self):
            return self.getToken(RegestParser.AD, 0)

        def PER(self):
            return self.getToken(RegestParser.PER, 0)

        def POST(self):
            return self.getToken(RegestParser.POST, 0)

        def orden(self):
            return self.getTypedRuleContext(RegestParser.OrdenContext,0)


        def pfruende(self):
            return self.getTypedRuleContext(RegestParser.PfruendeContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_uebertrittwirdfrei

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterUebertrittwirdfrei" ):
                listener.enterUebertrittwirdfrei(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitUebertrittwirdfrei" ):
                listener.exitUebertrittwirdfrei(self)




    def uebertrittwirdfrei(self):

        localctx = RegestParser.UebertrittwirdfreiContext(self, self._ctx, self.state)
        self.enterRule(localctx, 58, self.RULE_uebertrittwirdfrei)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 282
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==6:
                self.state = 281
                self.match(RegestParser.VACAT)


            self.state = 285
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==9 or _la==10:
                self.state = 284
                _la = self._input.LA(1)
                if not(_la==9 or _la==10):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()


            self.state = 287
            self.match(RegestParser.TRANSGR)
            self.state = 293
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==12:
                self.state = 288
                self.match(RegestParser.AD)
                self.state = 291
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,30,self._ctx)
                if la_ == 1:
                    self.state = 289
                    self.orden()
                    pass

                elif la_ == 2:
                    self.state = 290
                    self.pfruende()
                    pass




        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class UebertrittistfreiContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def TRANSGR(self):
            return self.getToken(RegestParser.TRANSGR, 0)

        def VAC(self):
            return self.getToken(RegestParser.VAC, 0)

        def AD(self):
            return self.getToken(RegestParser.AD, 0)

        def PER(self):
            return self.getToken(RegestParser.PER, 0)

        def POST(self):
            return self.getToken(RegestParser.POST, 0)

        def orden(self):
            return self.getTypedRuleContext(RegestParser.OrdenContext,0)


        def pfruende(self):
            return self.getTypedRuleContext(RegestParser.PfruendeContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_uebertrittistfrei

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterUebertrittistfrei" ):
                listener.enterUebertrittistfrei(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitUebertrittistfrei" ):
                listener.exitUebertrittistfrei(self)




    def uebertrittistfrei(self):

        localctx = RegestParser.UebertrittistfreiContext(self, self._ctx, self.state)
        self.enterRule(localctx, 60, self.RULE_uebertrittistfrei)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 296
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==7:
                self.state = 295
                self.match(RegestParser.VAC)


            self.state = 299
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==9 or _la==10:
                self.state = 298
                _la = self._input.LA(1)
                if not(_la==9 or _la==10):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()


            self.state = 301
            self.match(RegestParser.TRANSGR)
            self.state = 307
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==12:
                self.state = 302
                self.match(RegestParser.AD)
                self.state = 305
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,34,self._ctx)
                if la_ == 1:
                    self.state = 303
                    self.orden()
                    pass

                elif la_ == 2:
                    self.state = 304
                    self.pfruende()
                    pass




        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class UebertrittwarfreiContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def POST(self):
            return self.getToken(RegestParser.POST, 0)

        def TRANSGR(self):
            return self.getToken(RegestParser.TRANSGR, 0)

        def AD(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.AD)
            else:
                return self.getToken(RegestParser.AD, i)

        def MON(self):
            return self.getToken(RegestParser.MON, 0)

        def IN(self):
            return self.getToken(RegestParser.IN, 0)

        def EX(self):
            return self.getToken(RegestParser.EX, 0)

        def orden(self):
            return self.getTypedRuleContext(RegestParser.OrdenContext,0)


        def pfruende(self):
            return self.getTypedRuleContext(RegestParser.PfruendeContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_uebertrittwarfrei

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterUebertrittwarfrei" ):
                listener.enterUebertrittwarfrei(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitUebertrittwarfrei" ):
                listener.exitUebertrittwarfrei(self)




    def uebertrittwarfrei(self):

        localctx = RegestParser.UebertrittwarfreiContext(self, self._ctx, self.state)
        self.enterRule(localctx, 62, self.RULE_uebertrittwarfrei)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 309
            self.match(RegestParser.POST)
            self.state = 310
            self.match(RegestParser.TRANSGR)
            self.state = 316
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,37,self._ctx)
            if la_ == 1:
                self.state = 311
                self.match(RegestParser.AD)
                self.state = 314
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,36,self._ctx)
                if la_ == 1:
                    self.state = 312
                    self.orden()
                    pass

                elif la_ == 2:
                    self.state = 313
                    self.pfruende()
                    pass




            self.state = 320
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if (((_la) & ~0x3f) == 0 and ((1 << _la) & 200704) != 0):
                self.state = 318
                _la = self._input.LA(1)
                if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 200704) != 0)):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()
                self.state = 319
                self.match(RegestParser.MON)


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TodContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def todistfrei(self):
            return self.getTypedRuleContext(RegestParser.TodistfreiContext,0)


        def todwirdfrei(self):
            return self.getTypedRuleContext(RegestParser.TodwirdfreiContext,0)


        def todwarfrei(self):
            return self.getTypedRuleContext(RegestParser.TodwarfreiContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_tod

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterTod" ):
                listener.enterTod(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitTod" ):
                listener.exitTod(self)




    def tod(self):

        localctx = RegestParser.TodContext(self, self._ctx, self.state)
        self.enterRule(localctx, 64, self.RULE_tod)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 325
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,39,self._ctx)
            if la_ == 1:
                self.state = 322
                self.todistfrei()
                pass

            elif la_ == 2:
                self.state = 323
                self.todwirdfrei()
                pass

            elif la_ == 3:
                self.state = 324
                self.todwarfrei()
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TodwirdfreiContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def OB(self):
            return self.getToken(RegestParser.OB, 0)

        def VACAT(self):
            return self.getToken(RegestParser.VACAT, 0)

        def PER(self):
            return self.getToken(RegestParser.PER, 0)

        def POST(self):
            return self.getToken(RegestParser.POST, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_todwirdfrei

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterTodwirdfrei" ):
                listener.enterTodwirdfrei(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitTodwirdfrei" ):
                listener.exitTodwirdfrei(self)




    def todwirdfrei(self):

        localctx = RegestParser.TodwirdfreiContext(self, self._ctx, self.state)
        self.enterRule(localctx, 66, self.RULE_todwirdfrei)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 328
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==6:
                self.state = 327
                self.match(RegestParser.VACAT)


            self.state = 331
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==9 or _la==10:
                self.state = 330
                _la = self._input.LA(1)
                if not(_la==9 or _la==10):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()


            self.state = 333
            self.match(RegestParser.OB)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TodistfreiContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def OB(self):
            return self.getToken(RegestParser.OB, 0)

        def VAC(self):
            return self.getToken(RegestParser.VAC, 0)

        def PER(self):
            return self.getToken(RegestParser.PER, 0)

        def POST(self):
            return self.getToken(RegestParser.POST, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_todistfrei

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterTodistfrei" ):
                listener.enterTodistfrei(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitTodistfrei" ):
                listener.exitTodistfrei(self)




    def todistfrei(self):

        localctx = RegestParser.TodistfreiContext(self, self._ctx, self.state)
        self.enterRule(localctx, 68, self.RULE_todistfrei)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 336
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==7:
                self.state = 335
                self.match(RegestParser.VAC)


            self.state = 339
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==9 or _la==10:
                self.state = 338
                _la = self._input.LA(1)
                if not(_la==9 or _la==10):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()


            self.state = 341
            self.match(RegestParser.OB)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TodwarfreiContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def POST(self):
            return self.getToken(RegestParser.POST, 0)

        def OB(self):
            return self.getToken(RegestParser.OB, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_todwarfrei

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterTodwarfrei" ):
                listener.enterTodwarfrei(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitTodwarfrei" ):
                listener.exitTodwarfrei(self)




    def todwarfrei(self):

        localctx = RegestParser.TodwarfreiContext(self, self._ctx, self.state)
        self.enterRule(localctx, 70, self.RULE_todwarfrei)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 343
            self.match(RegestParser.POST)
            self.state = 344
            self.match(RegestParser.OB)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PfruendeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def pfruendenNorm(self):
            return self.getTypedRuleContext(RegestParser.PfruendenNormContext,0)


        def pfruendenInst(self):
            return self.getTypedRuleContext(RegestParser.PfruendenInstContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_pfruende

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPfruende" ):
                listener.enterPfruende(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPfruende" ):
                listener.exitPfruende(self)




    def pfruende(self):

        localctx = RegestParser.PfruendeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 72, self.RULE_pfruende)
        try:
            self.state = 348
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [97, 106]:
                self.enterOuterAlt(localctx, 1)
                self.state = 346
                self.pfruendenNorm()
                pass
            elif token in [13, 15, 90, 98, 99, 101, 103, 107, 108, 109]:
                self.enterOuterAlt(localctx, 2)
                self.state = 347
                self.pfruendenInst()
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PfruendenNormContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def pfruendenNormType(self):
            return self.getTypedRuleContext(RegestParser.PfruendenNormTypeContext,0)


        def location(self):
            return self.getTypedRuleContext(RegestParser.LocationContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_pfruendenNorm

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPfruendenNorm" ):
                listener.enterPfruendenNorm(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPfruendenNorm" ):
                listener.exitPfruendenNorm(self)




    def pfruendenNorm(self):

        localctx = RegestParser.PfruendenNormContext(self, self._ctx, self.state)
        self.enterRule(localctx, 74, self.RULE_pfruendenNorm)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 350
            self.pfruendenNormType()
            self.state = 352
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,45,self._ctx)
            if la_ == 1:
                self.state = 351
                self.location()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PfruendenNormTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def PAR(self):
            return self.getToken(RegestParser.PAR, 0)

        def ECCL(self):
            return self.getToken(RegestParser.ECCL, 0)

        def ARCHIBES(self):
            return self.getToken(RegestParser.ARCHIBES, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_pfruendenNormType

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPfruendenNormType" ):
                listener.enterPfruendenNormType(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPfruendenNormType" ):
                listener.exitPfruendenNormType(self)




    def pfruendenNormType(self):

        localctx = RegestParser.PfruendenNormTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 76, self.RULE_pfruendenNormType)
        try:
            self.state = 357
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [97]:
                self.enterOuterAlt(localctx, 1)
                self.state = 354
                self.match(RegestParser.PAR)
                self.state = 355
                self.match(RegestParser.ECCL)
                pass
            elif token in [106]:
                self.enterOuterAlt(localctx, 2)
                self.state = 356
                self.match(RegestParser.ARCHIBES)
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PfruendenTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def ADMIN(self):
            return self.getToken(RegestParser.ADMIN, 0)

        def DECAN(self):
            return self.getToken(RegestParser.DECAN, 0)

        def CAPELL(self):
            return self.getToken(RegestParser.CAPELL, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_pfruendenType

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPfruendenType" ):
                listener.enterPfruendenType(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPfruendenType" ):
                listener.exitPfruendenType(self)




    def pfruendenType(self):

        localctx = RegestParser.PfruendenTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 78, self.RULE_pfruendenType)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 359
            _la = self._input.LA(1)
            if not(((((_la - 107)) & ~0x3f) == 0 and ((1 << (_la - 107)) & 7) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PfruendenInstContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def instType(self):
            return self.getTypedRuleContext(RegestParser.InstTypeContext,0)


        def pfruendenType(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.PfruendenTypeContext)
            else:
                return self.getTypedRuleContext(RegestParser.PfruendenTypeContext,i)


        def patroName(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.PatroNameContext)
            else:
                return self.getTypedRuleContext(RegestParser.PatroNameContext,i)


        def orden(self):
            return self.getTypedRuleContext(RegestParser.OrdenContext,0)


        def location(self):
            return self.getTypedRuleContext(RegestParser.LocationContext,0)


        def ET(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.ET)
            else:
                return self.getToken(RegestParser.ET, i)

        def AC(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.AC)
            else:
                return self.getToken(RegestParser.AC, i)

        def getRuleIndex(self):
            return RegestParser.RULE_pfruendenInst

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPfruendenInst" ):
                listener.enterPfruendenInst(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPfruendenInst" ):
                listener.exitPfruendenInst(self)




    def pfruendenInst(self):

        localctx = RegestParser.PfruendenInstContext(self, self._ctx, self.state)
        self.enterRule(localctx, 80, self.RULE_pfruendenInst)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 367
            self._errHandler.sync(self)
            _alt = self._interp.adaptivePredict(self._input,48,self._ctx)
            while _alt!=2 and _alt!=ATN.INVALID_ALT_NUMBER:
                if _alt==1:
                    self.state = 361
                    self.pfruendenType()
                    self.state = 363
                    self._errHandler.sync(self)
                    _la = self._input.LA(1)
                    if ((((_la - 80)) & ~0x3f) == 0 and ((1 << (_la - 80)) & 14337) != 0):
                        self.state = 362
                        self.patroName()

             
                self.state = 369
                self._errHandler.sync(self)
                _alt = self._interp.adaptivePredict(self._input,48,self._ctx)

            self.state = 374
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while _la==13 or _la==15:
                self.state = 370
                _la = self._input.LA(1)
                if not(_la==13 or _la==15):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()
                self.state = 371
                self.pfruendenType()
                self.state = 376
                self._errHandler.sync(self)
                _la = self._input.LA(1)

            self.state = 377
            self.instType()
            self.state = 379
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if ((((_la - 80)) & ~0x3f) == 0 and ((1 << (_la - 80)) & 14337) != 0):
                self.state = 378
                self.patroName()


            self.state = 382
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,51,self._ctx)
            if la_ == 1:
                self.state = 381
                self.orden()


            self.state = 385
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,52,self._ctx)
            if la_ == 1:
                self.state = 384
                self.location()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PatroNameContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def B(self):
            return self.getToken(RegestParser.B, 0)

        def BB(self):
            return self.getToken(RegestParser.BB, 0)

        def SS(self):
            return self.getToken(RegestParser.SS, 0)

        def S(self):
            return self.getToken(RegestParser.S, 0)

        def APL(self):
            return self.getToken(RegestParser.APL, 0)

        def PTRNAME(self):
            return self.getToken(RegestParser.PTRNAME, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_patroName

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPatroName" ):
                listener.enterPatroName(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPatroName" ):
                listener.exitPatroName(self)




    def patroName(self):

        localctx = RegestParser.PatroNameContext(self, self._ctx, self.state)
        self.enterRule(localctx, 82, self.RULE_patroName)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 387
            _la = self._input.LA(1)
            if not(((((_la - 80)) & ~0x3f) == 0 and ((1 << (_la - 80)) & 14337) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
            self.state = 388
            _la = self._input.LA(1)
            if not(_la==44 or _la==94):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class InstTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def instTypeHaupt(self):
            return self.getTypedRuleContext(RegestParser.InstTypeHauptContext,0)


        def instTypeSub(self):
            return self.getTypedRuleContext(RegestParser.InstTypeSubContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_instType

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterInstType" ):
                listener.enterInstType(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitInstType" ):
                listener.exitInstType(self)




    def instType(self):

        localctx = RegestParser.InstTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 84, self.RULE_instType)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 390
            self.instTypeHaupt()
            self.state = 392
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,53,self._ctx)
            if la_ == 1:
                self.state = 391
                self.instTypeSub()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class InstTypeHauptContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def CATHEDRAL(self):
            return self.getToken(RegestParser.CATHEDRAL, 0)

        def MON(self):
            return self.getToken(RegestParser.MON, 0)

        def CAPELL(self):
            return self.getToken(RegestParser.CAPELL, 0)

        def ECCL(self):
            return self.getToken(RegestParser.ECCL, 0)

        def HOSP(self):
            return self.getToken(RegestParser.HOSP, 0)

        def PAUPER(self):
            return self.getToken(RegestParser.PAUPER, 0)

        def DOM(self):
            return self.getToken(RegestParser.DOM, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_instTypeHaupt

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterInstTypeHaupt" ):
                listener.enterInstTypeHaupt(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitInstTypeHaupt" ):
                listener.exitInstTypeHaupt(self)




    def instTypeHaupt(self):

        localctx = RegestParser.InstTypeHauptContext(self, self._ctx, self.state)
        self.enterRule(localctx, 86, self.RULE_instTypeHaupt)
        try:
            self.state = 402
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,54,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 394
                self.match(RegestParser.CATHEDRAL)
                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 395
                self.match(RegestParser.MON)
                pass

            elif la_ == 3:
                self.enterOuterAlt(localctx, 3)
                self.state = 396
                self.match(RegestParser.CAPELL)
                pass

            elif la_ == 4:
                self.enterOuterAlt(localctx, 4)
                self.state = 397
                self.match(RegestParser.ECCL)
                pass

            elif la_ == 5:
                self.enterOuterAlt(localctx, 5)
                self.state = 398
                self.match(RegestParser.HOSP)
                pass

            elif la_ == 6:
                self.enterOuterAlt(localctx, 6)
                self.state = 399
                self.match(RegestParser.HOSP)
                self.state = 400
                self.match(RegestParser.PAUPER)
                pass

            elif la_ == 7:
                self.enterOuterAlt(localctx, 7)
                self.state = 401
                self.match(RegestParser.DOM)
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class InstTypeSubContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def CAPELL(self):
            return self.getToken(RegestParser.CAPELL, 0)

        def ECCL(self):
            return self.getToken(RegestParser.ECCL, 0)

        def ALT(self):
            return self.getToken(RegestParser.ALT, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_instTypeSub

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterInstTypeSub" ):
                listener.enterInstTypeSub(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitInstTypeSub" ):
                listener.exitInstTypeSub(self)




    def instTypeSub(self):

        localctx = RegestParser.InstTypeSubContext(self, self._ctx, self.state)
        self.enterRule(localctx, 88, self.RULE_instTypeSub)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 404
            _la = self._input.LA(1)
            if not(((((_la - 98)) & ~0x3f) == 0 and ((1 << (_la - 98)) & 5121) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class LocationContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def stadt(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.StadtContext)
            else:
                return self.getTypedRuleContext(RegestParser.StadtContext,i)


        def bistum(self):
            return self.getTypedRuleContext(RegestParser.BistumContext,0)


        def bistuemer(self):
            return self.getTypedRuleContext(RegestParser.BistuemerContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_location

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterLocation" ):
                listener.enterLocation(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitLocation" ):
                listener.exitLocation(self)




    def location(self):

        localctx = RegestParser.LocationContext(self, self._ctx, self.state)
        self.enterRule(localctx, 90, self.RULE_location)
        try:
            self.state = 419
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,58,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 407 
                self._errHandler.sync(self)
                _alt = 1
                while _alt!=2 and _alt!=ATN.INVALID_ALT_NUMBER:
                    if _alt == 1:
                        self.state = 406
                        self.stadt()

                    else:
                        raise NoViableAltException(self)
                    self.state = 409 
                    self._errHandler.sync(self)
                    _alt = self._interp.adaptivePredict(self._input,55,self._ctx)

                self.state = 413
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,56,self._ctx)
                if la_ == 1:
                    self.state = 411
                    self.bistum()

                elif la_ == 2:
                    self.state = 412
                    self.bistuemer()


                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 417
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,57,self._ctx)
                if la_ == 1:
                    self.state = 415
                    self.bistum()
                    pass

                elif la_ == 2:
                    self.state = 416
                    self.bistuemer()
                    pass


                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class StadtContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def IN(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.IN)
            else:
                return self.getToken(RegestParser.IN, i)

        def EM(self):
            return self.getToken(RegestParser.EM, 0)

        def PROPE(self):
            return self.getToken(RegestParser.PROPE, 0)

        def VILLAM(self):
            return self.getToken(RegestParser.VILLAM, 0)

        def ortsType(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.OrtsTypeContext)
            else:
                return self.getTypedRuleContext(RegestParser.OrtsTypeContext,i)


        def stadtnamen(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.StadtnamenContext)
            else:
                return self.getTypedRuleContext(RegestParser.StadtnamenContext,i)


        def diocAbks(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.DiocAbksContext)
            else:
                return self.getTypedRuleContext(RegestParser.DiocAbksContext,i)


        def ET(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.ET)
            else:
                return self.getToken(RegestParser.ET, i)

        def AC(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.AC)
            else:
                return self.getToken(RegestParser.AC, i)

        def WORD(self):
            return self.getToken(RegestParser.WORD, 0)

        def KOMMA(self):
            return self.getToken(RegestParser.KOMMA, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_stadt

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterStadt" ):
                listener.enterStadt(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitStadt" ):
                listener.exitStadt(self)




    def stadt(self):

        localctx = RegestParser.StadtContext(self, self._ctx, self.state)
        self.enterRule(localctx, 92, self.RULE_stadt)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 425
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [16]:
                self.state = 421
                self.match(RegestParser.IN)
                pass
            elif token in [18]:
                self.state = 422
                self.match(RegestParser.EM)
                pass
            elif token in [20]:
                self.state = 423
                self.match(RegestParser.PROPE)
                self.state = 424
                self.match(RegestParser.VILLAM)
                pass
            elif token in [13, 15, 24, 25, 26, 27, 28, 29, 30, 43]:
                pass
            else:
                pass
            self.state = 428
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if (((_la) & ~0x3f) == 0 and ((1 << _la) & 2130706432) != 0):
                self.state = 427
                self.ortsType()


            self.state = 434 
            self._errHandler.sync(self)
            _alt = 1
            while _alt!=2 and _alt!=ATN.INVALID_ALT_NUMBER:
                if _alt == 1:
                    self.state = 434
                    self._errHandler.sync(self)
                    la_ = self._interp.adaptivePredict(self._input,61,self._ctx)
                    if la_ == 1:
                        self.state = 430
                        self.stadtnamen()
                        pass

                    elif la_ == 2:
                        self.state = 431
                        self.diocAbks()
                        pass

                    elif la_ == 3:
                        self.state = 432
                        self.match(RegestParser.ET)
                        pass

                    elif la_ == 4:
                        self.state = 433
                        self.match(RegestParser.AC)
                        pass



                else:
                    raise NoViableAltException(self)
                self.state = 436 
                self._errHandler.sync(self)
                _alt = self._interp.adaptivePredict(self._input,62,self._ctx)

            self.state = 439
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,63,self._ctx)
            if la_ == 1:
                self.state = 438
                self.ortsType()


            self.state = 442
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,64,self._ctx)
            if la_ == 1:
                self.state = 441
                self.match(RegestParser.IN)


            self.state = 445
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,65,self._ctx)
            if la_ == 1:
                self.state = 444
                self.match(RegestParser.WORD)


            self.state = 448
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,66,self._ctx)
            if la_ == 1:
                self.state = 447
                self.match(RegestParser.KOMMA)


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class BistumContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def diocAbks(self):
            return self.getTypedRuleContext(RegestParser.DiocAbksContext,0)


        def DIOCESIS(self):
            return self.getToken(RegestParser.DIOCESIS, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_bistum

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterBistum" ):
                listener.enterBistum(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitBistum" ):
                listener.exitBistum(self)




    def bistum(self):

        localctx = RegestParser.BistumContext(self, self._ctx, self.state)
        self.enterRule(localctx, 94, self.RULE_bistum)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 450
            self.diocAbks()
            self.state = 452
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==104:
                self.state = 451
                self.match(RegestParser.DIOCESIS)


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class BistuemerContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def diocAbks(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(RegestParser.DiocAbksContext)
            else:
                return self.getTypedRuleContext(RegestParser.DiocAbksContext,i)


        def AC(self):
            return self.getToken(RegestParser.AC, 0)

        def ET(self):
            return self.getToken(RegestParser.ET, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_bistuemer

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterBistuemer" ):
                listener.enterBistuemer(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitBistuemer" ):
                listener.exitBistuemer(self)




    def bistuemer(self):

        localctx = RegestParser.BistuemerContext(self, self._ctx, self.state)
        self.enterRule(localctx, 96, self.RULE_bistuemer)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 454
            self.diocAbks()
            self.state = 455
            _la = self._input.LA(1)
            if not(_la==13 or _la==15):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
            self.state = 457
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==43:
                self.state = 456
                self.diocAbks()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class OrtsTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def OP(self):
            return self.getToken(RegestParser.OP, 0)

        def OPID(self):
            return self.getToken(RegestParser.OPID, 0)

        def CIV(self):
            return self.getToken(RegestParser.CIV, 0)

        def CIVIT(self):
            return self.getToken(RegestParser.CIVIT, 0)

        def BURGUO(self):
            return self.getToken(RegestParser.BURGUO, 0)

        def MAIORIS_CASTRI(self):
            return self.getToken(RegestParser.MAIORIS_CASTRI, 0)

        def CASTRO(self):
            return self.getToken(RegestParser.CASTRO, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_ortsType

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterOrtsType" ):
                listener.enterOrtsType(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitOrtsType" ):
                listener.exitOrtsType(self)




    def ortsType(self):

        localctx = RegestParser.OrtsTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 98, self.RULE_ortsType)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 459
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 2130706432) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class MonthContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def IAN(self):
            return self.getToken(RegestParser.IAN, 0)

        def FEBR(self):
            return self.getToken(RegestParser.FEBR, 0)

        def MART(self):
            return self.getToken(RegestParser.MART, 0)

        def APR(self):
            return self.getToken(RegestParser.APR, 0)

        def MAI(self):
            return self.getToken(RegestParser.MAI, 0)

        def IUN(self):
            return self.getToken(RegestParser.IUN, 0)

        def IUL(self):
            return self.getToken(RegestParser.IUL, 0)

        def AUG(self):
            return self.getToken(RegestParser.AUG, 0)

        def SEPT(self):
            return self.getToken(RegestParser.SEPT, 0)

        def OCT(self):
            return self.getToken(RegestParser.OCT, 0)

        def NOV(self):
            return self.getToken(RegestParser.NOV, 0)

        def DEC(self):
            return self.getToken(RegestParser.DEC, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_month

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterMonth" ):
                listener.enterMonth(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitMonth" ):
                listener.exitMonth(self)




    def month(self):

        localctx = RegestParser.MonthContext(self, self._ctx, self.state)
        self.enterRule(localctx, 100, self.RULE_month)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 461
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 8793945538560) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class StadtnamenContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def STADTNAMEN(self):
            return self.getToken(RegestParser.STADTNAMEN, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_stadtnamen

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterStadtnamen" ):
                listener.enterStadtnamen(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitStadtnamen" ):
                listener.exitStadtnamen(self)




    def stadtnamen(self):

        localctx = RegestParser.StadtnamenContext(self, self._ctx, self.state)
        self.enterRule(localctx, 102, self.RULE_stadtnamen)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 463
            self.match(RegestParser.STADTNAMEN)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class NameContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def WORD(self, i:int=None):
            if i is None:
                return self.getTokens(RegestParser.WORD)
            else:
                return self.getToken(RegestParser.WORD, i)

        def DE(self):
            return self.getToken(RegestParser.DE, 0)

        def stadt(self):
            return self.getTypedRuleContext(RegestParser.StadtContext,0)


        def getRuleIndex(self):
            return RegestParser.RULE_name

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterName" ):
                listener.enterName(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitName" ):
                listener.exitName(self)




    def name(self):

        localctx = RegestParser.NameContext(self, self._ctx, self.state)
        self.enterRule(localctx, 104, self.RULE_name)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 465
            self.match(RegestParser.WORD)
            self.state = 471
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,70,self._ctx)
            if la_ == 1:
                self.state = 466
                self.match(RegestParser.DE)
                self.state = 469
                self._errHandler.sync(self)
                token = self._input.LA(1)
                if token in [13, 15, 16, 18, 20, 24, 25, 26, 27, 28, 29, 30, 43]:
                    self.state = 467
                    self.stadt()
                    pass
                elif token in [114]:
                    self.state = 468
                    self.match(RegestParser.WORD)
                    pass
                else:
                    raise NoViableAltException(self)



        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class AliasContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def name(self):
            return self.getTypedRuleContext(RegestParser.NameContext,0)


        def AL(self):
            return self.getToken(RegestParser.AL, 0)

        def D(self):
            return self.getToken(RegestParser.D, 0)

        def DICTUS(self):
            return self.getToken(RegestParser.DICTUS, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_alias

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAlias" ):
                listener.enterAlias(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAlias" ):
                listener.exitAlias(self)




    def alias(self):

        localctx = RegestParser.AliasContext(self, self._ctx, self.state)
        self.enterRule(localctx, 106, self.RULE_alias)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 480
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,71,self._ctx)
            if la_ == 1:
                self.state = 473
                self.match(RegestParser.AL)
                pass

            elif la_ == 2:
                self.state = 474
                self.match(RegestParser.D)
                pass

            elif la_ == 3:
                self.state = 475
                self.match(RegestParser.DICTUS)
                pass

            elif la_ == 4:
                self.state = 476
                self.match(RegestParser.AL)
                self.state = 477
                self.match(RegestParser.DICTUS)
                pass

            elif la_ == 5:
                self.state = 478
                self.match(RegestParser.AL)
                self.state = 479
                self.match(RegestParser.D)
                pass


            self.state = 482
            self.name()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DiocAbksContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def STADTNAMEN(self):
            return self.getToken(RegestParser.STADTNAMEN, 0)

        def getRuleIndex(self):
            return RegestParser.RULE_diocAbks

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterDiocAbks" ):
                listener.enterDiocAbks(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitDiocAbks" ):
                listener.exitDiocAbks(self)




    def diocAbks(self):

        localctx = RegestParser.DiocAbksContext(self, self._ctx, self.state)
        self.enterRule(localctx, 108, self.RULE_diocAbks)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 484
            self.match(RegestParser.STADTNAMEN)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx





