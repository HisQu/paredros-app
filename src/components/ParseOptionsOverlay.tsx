import React from 'react';
import { useReactFlow } from '@xyflow/react';
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
    const { getNodes, getZoom, getViewport } = useReactFlow();

    if (!nextParseStepInfo || !nextParseStepInfo.possible_transitions || nextParseStepInfo.possible_transitions.length === 0) {
        return null;
    }

    const nodes = getNodes() as ParseTreeNode[];
    const zoom = getZoom();
    const viewport = getViewport();

    // Find the current active node
    let currentNode: ParseTreeNode | undefined = nodes.find(n => n.id === nextParseStepInfo.step_id);

    // Fallback: find by lastAddedNodeIds
    if (!currentNode && lastAddedNodeIds && lastAddedNodeIds.size > 0) {
        const lastAddedId = Array.from(lastAddedNodeIds)[0];
        currentNode = nodes.find(n => n.id === lastAddedId);
    }

    if (!currentNode) {
        console.log("No current node found for preview overlay");
        return null;
    }

    const chosenIndex = nextParseStepInfo.chosen_transition_index - 1; // 1-based to 0-based

    // Calculate the position of preview boxes
    const currentX = currentNode.position.x;
    const currentY = currentNode.position.y;
    const currentCenterY = currentY + nodeHeight / 2;

    // Transform positions to screen coordinates
    const toScreenX = (x: number) => x * zoom + viewport.x;
    const toScreenY = (y: number) => y * zoom + viewport.y;

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
                zIndex: 10,
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

                // Calculate position for this option
                const offsetY = (index - (nextParseStepInfo.possible_transitions.length - 1) / 2) * verticalSpacing;
                const targetX = currentX + nodeWidth + horizontalOffset;
                const targetY = currentY + offsetY;
                const targetCenterY = targetY + nodeHeight / 2;

                // Screen coordinates
                const screenCurrentX = toScreenX(currentX + nodeWidth);
                const screenCurrentY = toScreenY(currentCenterY);
                const screenTargetX = toScreenX(targetX);
                const screenTargetY = toScreenY(targetCenterY);
                const screenBoxX = toScreenX(targetX);
                const screenBoxY = toScreenY(targetY);

                const color = isChosen ? '#22c55e' : '#9ca3af';
                const strokeWidth = isChosen ? 3 : 2;
                const opacity = isChosen ? 0.9 : 0.6;

                if (isExitTransition && isChosen) {
                    // Draw arrow back to parent (or upward)
                    const exitTargetY = toScreenY(currentY - 80);
                    return (
                        <g key={`exit-${index}`}>
                            <path
                                d={`M ${screenCurrentX},${screenCurrentY} 
                                   Q ${screenCurrentX + 30},${screenCurrentY - 40} 
                                   ${screenCurrentX},${exitTargetY}`}
                                stroke={color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray="5,5"
                                opacity={opacity}
                                markerEnd="url(#preview-arrow-green)"
                            />
                            <text
                                x={screenCurrentX + 20}
                                y={exitTargetY + 30}
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

                // Draw regular preview option
                return (
                    <g key={`preview-${index}`}>
                        {/* Connection line */}
                        <path
                            d={`M ${screenCurrentX},${screenCurrentY} 
                               L ${screenTargetX},${screenTargetY}`}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={isChosen ? "0" : "8,4"}
                            opacity={opacity}
                            markerEnd={isChosen ? "url(#preview-arrow-green)" : "url(#preview-arrow-gray)"}
                        />

                        {/* Preview box */}
                        <rect
                            x={screenBoxX}
                            y={screenBoxY}
                            width={nodeWidth * zoom}
                            height={nodeHeight * zoom}
                            fill={isChosen ? '#22c55e' : '#e5e7eb'}
                            stroke={color}
                            strokeWidth={2}
                            strokeDasharray="5,5"
                            opacity={opacity}
                            rx={4}
                        />

                        {/* Text inside preview box */}
                        <text
                            x={screenBoxX + (nodeWidth * zoom) / 2}
                            y={screenBoxY + (nodeHeight * zoom) / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isChosen ? 'white' : '#374151'}
                            fontSize={Math.max(10, 12 * zoom)}
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

