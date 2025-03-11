from paredros_debugger.ParseInformation import ParseInformation

def get_parse_info(grammar_file_path: str, input_file_path: str):
    try:
        parse_info = ParseInformation(grammar_file_path, input_file_path)

        print(parse_info.traversal.root)

    except Exception as e:
        print(f"\n💥 Parsing failed: {str(e)}")


if __name__ == "__main__":
    get_parse_info("")