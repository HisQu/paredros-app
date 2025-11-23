import Flow from "./FlowPlot";
import LoadingOverlay from "./LoadingOverlay";
import {
    GenerateParserOverlay,
    ParseExpressionOverlay,
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
    flowLayoutDirection: 'TB' | 'LR';
    setFlowLayoutDirection: (direction: 'TB' | 'LR') => void;
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
    flowLayoutDirection,
    setFlowLayoutDirection,
}: ParseTreePanelProps) {
    return (
        <div className="flex-1 min-h-0">
            {isGeneratingParser ? (
                <LoadingOverlay message="Generating parser..." />
            ) : isParsingExpression ? (
                <LoadingOverlay message="Parsing expression..." />
            ) : nodes && edges ? (
                <div className="relative h-full">
                    <Flow
                        node={nodes}
                        edge={edges}
                        step_backwards={stepBackwards}
                        step_forwards={stepForwards}
                        step_to_last_decision={stepToLastDecision}
                        step_to_next_decision={stepToNextDecision}
                        current_step={parseStepInfo?.step_id}
                        step_action={go_to_step}
                        next_parse_step_info={nextInfo}
                        flowLayoutDirection={flowLayoutDirection}
                        onFlowLayoutDirectionChange={setFlowLayoutDirection}
                    />
                    {userGrammar && hasChangedGrammarFile(userGrammar) && (
                        <>
                            <div className="absolute inset-0 bg-blue-300/30 pointer-events-none" />
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={generate_parser_save_grammar_files_parse_input}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-center transition-colors cursor-pointer animate-pulse"
                                >
                                    <p className="font-semibold">Grammar has been modified</p>
                                    <p className="text-sm mt-1">Click to generate parser and update the parse tree</p>
                                </button>
                            </div>
                        </>
                    )}
                    {userGrammar && !hasChangedGrammarFile(userGrammar) && expressionChanged && (
                        <>
                            <div className="absolute inset-0 bg-violet-300/30 pointer-events-none" />
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={parse_input}
                                    className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg shadow-lg text-center transition-colors cursor-pointer animate-pulse"
                                >
                                    <p className="font-semibold">Expression has been modified</p>
                                    <p className="text-sm mt-1">Click to parse the expression and update the parse tree</p>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : generateParserResult ? (
                <ParseExpressionOverlay onClick={parse_input} />
            ) : (
                <GenerateParserOverlay onClick={generate_parser_save_grammar_files_parse_input} />
            )}
        </div>
    );
}

