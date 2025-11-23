import React, { useState } from 'react';
import { useReactFlow, useOnViewportChange } from '@xyflow/react';
import { ParseStepInfo } from '../interfaces/UserGrammar';
import { ParseTreeNode } from '../interfaces/ParseTreeNode';
import { nodeWidth, nodeHeight } from '../constants';

interface ParseOptionsOverlayProps {
    nextParseStepInfo: ParseStepInfo | undefined;
    lastAddedNodeIds: Set<string> | null;
}

export const ParseOptionsOverlay: React.FC<ParseOptionsOverlayProps> = ({
    nextParseStepInfo,
    lastAddedNodeIds
}) => {
    const reactFlowInstance = useReactFlow();
    const getNodes = reactFlowInstance.getNodes;

    // Force re-render when viewport changes (pan/zoom)
    const [, forceUpdate] = useState({});

    useOnViewportChange({
        onChange: () => {
            forceUpdate({});
        }
    });

    // Helper function to convert flow coordinates to screen coordinates
    const flowToScreen = (flowX: number, flowY: number) => {
        const viewport = reactFlowInstance.getViewport();
        return {
            x: flowX * viewport.zoom + viewport.x,
            y: flowY * viewport.zoom + viewport.y
        };
    };

    if (!nextParseStepInfo || !nextParseStepInfo.possible_transitions || nextParseStepInfo.possible_transitions.length === 0) {
        return null;
    }

    const nodes = getNodes() as ParseTreeNode[];

    // Find the current active node
    let currentNode: ParseTreeNode | undefined = nodes.find(n => n.id === nextParseStepInfo.step_id);

    // Fallback: find by lastAddedNodeIds
    if (!currentNode && lastAddedNodeIds && lastAddedNodeIds.size > 0) {
        const lastAddedId = Array.from(lastAddedNodeIds)[0];
        currentNode = nodes.find(n => n.id === lastAddedId);
    }

    if (!currentNode) {
        console.log("ParseOptionsOverlay: No current node found");
        return null;
    }

    const chosenIndex = nextParseStepInfo.chosen_transition_index - 1; // 1-based to 0-based

    // Convert flow coordinates to screen coordinates
    // This ensures perfect alignment regardless of zoom/pan
    const flowNodeCenter = {
        x: currentNode.position.x + nodeWidth / 2,
        y: currentNode.position.y + nodeHeight / 2
    };

    const screenPos = flowToScreen(flowNodeCenter.x, flowNodeCenter.y);

    console.log("ParseOptionsOverlay rendering:", {
        currentNode: currentNode.id,
        flowPosition: currentNode.position,
        screenPosition: screenPos,
        transitions: nextParseStepInfo.possible_transitions.length
    });

    const verticalSpacing = 80;
    const horizontalOffset = 150;

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1000,
                overflow: 'visible',
            }}
        >
            <defs>
                <marker
                    id="preview-arrow-green"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                </marker>
                <marker
                    id="preview-arrow-gray"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L9,3 z" fill="#9ca3af" />
                </marker>
            </defs>
            {nextParseStepInfo.possible_transitions.map((transition, index) => {
                const isChosen = index === chosenIndex;
                const transitionText = transition.matches.join(" ").trim();

                // Check if this is an exit transition
                const isExitTransition = transitionText.toLowerCase().includes("exit") ||
                                       transitionText.toLowerCase().includes("return") ||
                                       nextParseStepInfo.step_type === "Rule exit";

                if (isExitTransition && !isChosen) {
                    // Don't draw non-chosen exit transitions
                    return null;
                }

                // Calculate position for this option in flow coordinates
                const offsetY = (index - (nextParseStepInfo.possible_transitions.length - 1) / 2) * verticalSpacing;

                // Flow coordinates for target box
                const flowTargetX = currentNode.position.x + nodeWidth + horizontalOffset;
                const flowTargetY = currentNode.position.y + offsetY;
                const flowTargetCenter = {
                    x: flowTargetX + nodeWidth / 2,
                    y: flowTargetY + nodeHeight / 2
                };

                // Convert to screen coordinates
                const screenTargetTopLeft = flowToScreen(flowTargetX, flowTargetY);
                const screenTargetCenter = flowToScreen(flowTargetCenter.x, flowTargetCenter.y);

                // Current node edge point (right side, vertically centered)
                const flowCurrentEdge = {
                    x: currentNode.position.x + nodeWidth,
                    y: currentNode.position.y + nodeHeight / 2
                };
                const screenCurrentEdge = flowToScreen(flowCurrentEdge.x, flowCurrentEdge.y);

                const color = isChosen ? '#22c55e' : '#9ca3af';
                const strokeWidth = isChosen ? 3 : 2;
                const opacity = isChosen ? 0.9 : 0.6;

                if (isExitTransition && isChosen) {
                    // Draw arrow back to parent (or upward)
                    const flowExitTarget = {
                        x: currentNode.position.x + nodeWidth / 2,
                        y: currentNode.position.y - 80
                    };
                    const screenExitTarget = flowToScreen(flowExitTarget.x, flowExitTarget.y);

                    // Control point for the curve
                    const flowControlPoint = {
                        x: flowCurrentEdge.x + 30,
                        y: flowCurrentEdge.y - 40
                    };
                    const screenControlPoint = flowToScreen(flowControlPoint.x, flowControlPoint.y);

                    return (
                        <g key={`exit-${index}`}>
                            <path
                                d={`M ${screenCurrentEdge.x},${screenCurrentEdge.y} 
                                   Q ${screenControlPoint.x},${screenControlPoint.y} 
                                   ${screenExitTarget.x},${screenExitTarget.y}`}
                                stroke={color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray="5,5"
                                opacity={opacity}
                                markerEnd="url(#preview-arrow-green)"
                            />
                            <text
                                x={screenExitTarget.x + 20}
                                y={screenExitTarget.y + 30}
                                fill={color}
                                fontSize="12"
                                fontWeight="bold"
                                style={{ pointerEvents: 'none' }}
                            >
                                EXIT
                            </text>
                        </g>
                    );
                }

                // Calculate screen dimensions for the box
                const flowBoxBottomRight = flowToScreen(
                    flowTargetX + nodeWidth,
                    flowTargetY + nodeHeight
                );
                const screenWidth = flowBoxBottomRight.x - screenTargetTopLeft.x;
                const screenHeight = flowBoxBottomRight.y - screenTargetTopLeft.y;

                // Draw regular preview option
                return (
                    <g key={`preview-${index}`}>
                        {/* Connection line */}
                        <path
                            d={`M ${screenCurrentEdge.x},${screenCurrentEdge.y} 
                               L ${screenTargetCenter.x},${screenTargetCenter.y}`}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={isChosen ? "0" : "8,4"}
                            opacity={opacity}
                            markerEnd={isChosen ? "url(#preview-arrow-green)" : "url(#preview-arrow-gray)"}
                        />

                        {/* Preview box */}
                        <rect
                            x={screenTargetTopLeft.x}
                            y={screenTargetTopLeft.y}
                            width={screenWidth}
                            height={screenHeight}
                            fill={isChosen ? '#22c55e' : '#e5e7eb'}
                            stroke={color}
                            strokeWidth={2}
                            strokeDasharray="5,5"
                            opacity={opacity}
                            rx={4}
                        />

                        {/* Text inside preview box */}
                        <text
                            x={screenTargetCenter.x}
                            y={screenTargetCenter.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isChosen ? 'white' : '#374151'}
                            fontSize="12"
                            fontWeight={isChosen ? 'bold' : 'normal'}
                            style={{ pointerEvents: 'none' }}
                        >
                            {transitionText.length > 20 ? transitionText.substring(0, 17) + '...' : transitionText}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

