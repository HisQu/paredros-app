export interface GrammarRule {
    name: string;
    content: string;
    start_line: number;
    end_line: number;
    start_pos: number;
    end_pos: number;
  }
  
  export interface GrammarFile {
    path: string;
    directory: string;
    rules: Record<string, GrammarRule>;
    imports: string[];
    content: string;
    changed: boolean;
  }
  
  export interface UserGrammar {
    grammar_files: Record<string, GrammarFile>;
    processed_files: string[];
  }
  