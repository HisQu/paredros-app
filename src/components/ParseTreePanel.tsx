import Flow from "./FlowPlot";
import LoadingOverlay from "./LoadingOverlay";
import {
    GenerateParserOverlay,
    ParserInputOverlay,
    ParseExpressionOverlay,
    ExpressionChangedOverlay,
} from "./ParseTreeOverlays";
import { ParseTreeNode } from "../interfaces/ParseTreeNode";
import { ParseStepInfo, UserGrammar } from "../interfaces/UserGrammar";
import { Edge } from "@xyflow/react";

interface ParseTreePanelProps {
    nodes: ParseTreeNode[] | undefined;
    edges: Edge[] | undefined;
    parseStepInfo: ParseStepInfo | undefined;
    nextInfo: ParseStepInfo | undefined;
    userGrammar: UserGrammar | undefined;
    expressionChanged: boolean;
    isGeneratingParser: boolean;
    isParsingExpression: boolean;
    generateParserResult: string | undefined;
    stepBackwards: () => Promise<void>;
    stepForwards: () => Promise<void>;
    stepToLastDecision: () => Promise<void>;
    stepToNextDecision: () => Promise<void>;
    go_to_step: (step_id: number) => Promise<void>;
    generate_parser_save_grammar_files_parse_input: () => Promise<void>;
    parse_input: () => Promise<void>;
}

function hasChangedGrammarFile(userGrammar: UserGrammar): boolean {
    return Object.values(userGrammar.grammar_files).some(file => file.changed);
}

export function ParseTreePanel({
    nodes,
    edges,
    parseStepInfo,
    nextInfo,
    userGrammar,
    expressionChanged,
    isGeneratingParser,
    isParsingExpression,
    generateParserResult,
    stepBackwards,
    stepForwards,
    stepToLastDecision,
    stepToNextDecision,
    go_to_step,
    generate_parser_save_grammar_files_parse_input,
    parse_input,
}: ParseTreePanelProps) {
    return (
        <div className="flex-1 min-h-0">
            {isGeneratingParser ? (
                <LoadingOverlay message="Generating parser..." />
            ) : isParsingExpression ? (
                <LoadingOverlay message="Parsing expression..." />
            ) : nodes && edges ? (
                userGrammar && (hasChangedGrammarFile(userGrammar) || expressionChanged) ? (
                    hasChangedGrammarFile(userGrammar) ? (
                        <ParserInputOverlay onClick={generate_parser_save_grammar_files_parse_input} />
                    ) : (
                        <ExpressionChangedOverlay onClick={parse_input} />
                    )
                ) : (
                    <Flow
                        node={nodes}
                        edge={edges}
                        step_backwards={stepBackwards}
                        step_forwards={stepForwards}
                        step_to_last_decision={stepToLastDecision}
                        step_to_next_decision={stepToNextDecision}
                        current_step={parseStepInfo?.step_id}
                        step_action={go_to_step}
                        generate_parser={generate_parser_save_grammar_files_parse_input}
                        next_parse_step_info={nextInfo}
                    />
                )
            ) : generateParserResult ? (
                <ParseExpressionOverlay onClick={parse_input} />
            ) : (
                <GenerateParserOverlay onClick={generate_parser_save_grammar_files_parse_input} />
            )}
        </div>
    );
}

