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
  
export interface Transition {
  target_state: number;
  matches: string[];
}

export interface GrammarRuleLocation {
  name: string;
  content: string;
  file_path: string;
  start_line: number;
  end_line: number;
  start_pos: number;
  end_pos: number;
}

export interface ParseStepInfo {
  step_id: string;
  node_type: string;
  rule_name: string;
  rule_stack: string[];
  state: string;
  current_token_repr: string;
  token_index: number;
  chosen_transition_index: number;
  input_text_context: string;
  lookahead_repr: string;
  matching_error: boolean;
  is_error_node: boolean;
  next_input_token: string | null;
  next_input_literal: string | null;
  possible_transitions: Transition[];
  grammar_rule_location: GrammarRuleLocation;
  input_context_snippet: string | null;
}