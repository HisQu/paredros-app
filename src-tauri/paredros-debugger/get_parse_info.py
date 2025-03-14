from paredros_debugger.ParseInformation import ParseInformation

def get_parse_info(grammar_file_path: str) -> ParseInformation:
    parse_info = ParseInformation(grammar_file_path)
    return parse_info


if __name__ == "__main__":
    get_parse_info("../../examples/Regest/Regest.g4", "../../examples/Regest/input.txt")