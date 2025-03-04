import antlr4
from ParseStep import ParseStep

def get_parse_steps(grammar: str, input: str) -> ParseStep:
    return ParseStep(grammar)