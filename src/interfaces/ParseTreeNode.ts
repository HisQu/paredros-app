import { Node } from "@xyflow/react";

export interface ParseStep {
  id: string;
  node_type: string;
  state: string;
  current_token: string;
  chosen: number;
  input_text: string;
  matching_error: string;
  next_input_token: string;
  next_input_literal: string;
}

export interface ParseTreeNodeData extends Record<string, unknown> {
  nodeType: string;
  ruleName: string;
  token: string;
  traceSteps: ParseStep[];
}

export interface ParseTreeNode extends Node<ParseTreeNodeData> { }