import {useCallback, useEffect, useState, forwardRef, useImperativeHandle, useRef} from "react";
// React Flow
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    Panel,
    ConnectionLineType,
    Edge,
    Position
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";

import {Button} from "./ui/button.tsx";
import {nodeHeight, nodeWidth} from "../constants";
import {ParseTreeNode} from "../interfaces/ParseTreeNode";
import ParseTreeNodeComponent from "../components/ParseTreeNodeComponent";
import {Input} from "./ui/input.tsx";
import {Badge} from "./ui/badge.tsx";
import {Checkbox, CheckboxField, CheckboxGroup} from "./ui/checkbox.tsx";
import {ParseStepInfo} from "../interfaces/UserGrammar.ts";

type FlowProps = {
    node: ParseTreeNode[];
    edge: Edge[];
    step_forwards: (event: React.MouseEvent<HTMLButtonElement>) => void;
    step_backwards: (event: React.MouseEvent<HTMLButtonElement>) => void;
    step_to_last_decision: (event: React.MouseEvent<HTMLButtonElement>) => void;
    step_to_next_decision: (event: React.MouseEvent<HTMLButtonElement>) => void;
    current_step?: string;
    step_action: (step_id: number) => void;
    next_parse_step_info: ParseStepInfo | undefined;
};

export type FlowHandle = {
    expandAll: () => void;
};

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

type LayoutDirection = "LR" | "TB";

// Helper function to build a node tree map for easy access
const buildNodeTreeMap = (nodes: ParseTreeNode[], edges: Edge[]) => {
    const nodeMap = new Map<string, { node: ParseTreeNode, children: string[] }>();

    // Initialize all nodes with empty children arrays
    nodes.forEach(node => {
        nodeMap.set(node.id, {node, children: []});
    });

    // Fill in children based on edges
    edges.forEach(edge => {
        const sourceNode = nodeMap.get(edge.source);
        if (sourceNode) {
            sourceNode.children.push(edge.target);
        }
    });

    return nodeMap;
};

// Function to filter nodes based on expanded states
const getVisibleNodes = (
    allNodes: ParseTreeNode[],
    edges: Edge[],
    expandedNodes: Set<string>
) => {
    const nodeMap = buildNodeTreeMap(allNodes, edges);
    const visibleNodeIds = new Set<string>();

    // Helper function to recursively check if a node should be visible
    const processNode = (nodeId: string, isAncestorExpanded: boolean) => {
        const nodeInfo = nodeMap.get(nodeId);
        if (!nodeInfo) return;

        // A node is visible if all its ancestors are expanded
        if (isAncestorExpanded) {
            visibleNodeIds.add(nodeId);

            // Process children only if this node is expanded
            if (expandedNodes.has(nodeId)) {
                nodeInfo.children.forEach(childId => {
                    processNode(childId, true);
                });
            }
        }
    };

    // Start with root nodes (nodes with no incoming edges)
    const rootNodeIds = allNodes
        .filter(node => !edges.some(edge => edge.target === node.id))
        .map(node => node.id);

    rootNodeIds.forEach(rootId => {
        processNode(rootId, true);
    });

    // Return only the visible nodes with additional data properties.
    return allNodes.filter(node => visibleNodeIds.has(node.id)).map(node => {
        const nodeInfo = nodeMap.get(node.id);
        return {
            ...node,
            data: {
                ...node.data,
                hasChildren: !!nodeInfo?.children.length,
                isExpanded: expandedNodes.has(node.id),
            }
        };
    });
};

const getLayoutedElements = (
    nodes: ParseTreeNode[],
    edges: Edge[],
    expandedNodes: Set<string>,
    onToggleNode: (nodeId: string) => void,
    _direction: LayoutDirection = "TB"
) => {
    // Filter visible edges to only those connecting visible nodes
    const visibleNodes = getVisibleNodes(nodes, edges, expandedNodes);
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));

    const visibleEdges = edges.filter(
        edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    const isHorizontal = _direction === "LR";
    dagreGraph.setGraph({rankdir: _direction});

    visibleNodes.forEach((node) => {
        dagreGraph.setNode(node.id, {width: nodeWidth, height: nodeHeight});
    });

    visibleEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = visibleNodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            // Set the custom type so React Flow renders our custom node component.
            type: "parseTreeNode",
            targetPosition: isHorizontal ? ("left" as Position) : ("top" as Position),
            sourcePosition: isHorizontal ? ("right" as Position) : ("bottom" as Position),
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
            data: {
                ...node.data,
                toggleNode: onToggleNode
            }
        };
    });

    // Ensure each edge has valid handle IDs matching our custom node:
    const newEdges = visibleEdges.map((edge) => ({
        ...edge,
        sourceHandle: edge.sourceHandle ?? "b",
        targetHandle: edge.targetHandle ?? "a",
    }));

    return {nodes: newNodes, edges: newEdges};
};

const Flow = forwardRef<FlowHandle, FlowProps>(
    ({node: paramNodes, edge: paramEdges, step_backwards, step_forwards, step_to_last_decision, step_to_next_decision, current_step, step_action, next_parse_step_info}, ref) => {
        const rfInstance = useRef<any | null>(null); // not pretty, but typing did not work

        // Track expanded nodes in a Set, with root nodes expanded by default
        const [expandedNodes, setExpandedNodes] = useState(() => {
            const rootNodeIds = paramNodes
                .filter(node => !paramEdges.some(edge => edge.target === node.id))
                .map(node => node.id);
            return new Set(rootNodeIds);
        });

        // Ref to store initial positions of nodes when dragging starts.
        const dragStartPositionsRef = useRef<Map<string, { x: number, y: number }>>(new Map());

        // Layout direction state
        const [direction, setDirection] = useState<LayoutDirection>("TB");

        // Toggle function to expand/collapse individual nodes
        const onToggleNode = useCallback((nodeId: string) => {
            setExpandedNodes(prev => {
                const next = new Set(prev);

                if (next.has(nodeId)) {
                    // When collapsing a node, also collapse all descendants
                    const nodeMap = buildNodeTreeMap(paramNodes, paramEdges);

                    // Helper function to recursively collapse all children
                    const collapseChildren = (id: string) => {
                        next.delete(id);
                        const nodeInfo = nodeMap.get(id);
                        if (nodeInfo) {
                            nodeInfo.children.forEach(childId => {
                                collapseChildren(childId);
                            });
                        }
                    };

                    collapseChildren(nodeId);
                } else {
                    // Just expand this node
                    next.add(nodeId);
                }

                return next;
            });
        }, [paramNodes, paramEdges]);

        const {nodes: initNodes, edges: initEdges} = getLayoutedElements(
            paramNodes,
            paramEdges,
            expandedNodes,
            onToggleNode
        );

        const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

        // Update layout when the input nodes, edges, or expanded state changes
        useEffect(() => {
            onLayout();
        }, [paramNodes, paramEdges, expandedNodes, onToggleNode, setNodes, setEdges]);

        const onConnect = useCallback(
            (params: any) =>
                setEdges((eds) =>
                    addEdge({...params, type: ConnectionLineType.SmoothStep, animated: true}, eds)
                ),
            [setEdges]
        );

        const onLayout = useCallback(
            (_direction?: LayoutDirection) => {
                setDirection(_direction || direction);

                const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(
                    paramNodes,
                    paramEdges,
                    expandedNodes,
                    onToggleNode,
                    _direction || direction
                );

                setNodes([...layoutedNodes]);
                setEdges([...layoutedEdges]);

                fitView();
            },
            [paramNodes, paramEdges, expandedNodes, onToggleNode, setNodes, setEdges]
        );

        const toggle_expand = useCallback(() => {
            // Create a set of all node IDs from the input nodes
            const allNodeIds = new Set(paramNodes.map(node => node.id));
            // If all nodes are already expanded, collapse back to only the root nodes.
            if (expandedNodes.size === allNodeIds.size) {
                const rootNodeIds = paramNodes
                    .filter(node => !paramEdges.some(edge => edge.target === node.id))
                    .map(node => node.id);
                setExpandedNodes(new Set(rootNodeIds));
            } else {
                // Otherwise, expand all nodes.
                setExpandedNodes(allNodeIds);
            }
        }, [paramNodes, paramEdges, expandedNodes]);

        // Function to toggle expansion of all nodes
        const expand_all = () => {
            const allNodeIds = new Set(paramNodes.map(node => node.id));
            setExpandedNodes(allNodeIds);
        }

        // When a node drag starts, store the current positions for all nodes.
        const onNodeDragStart = useCallback((_: any, __: any) => {
            dragStartPositionsRef.current = new Map(
                nodes.map(n => [n.id, {x: n.position.x, y: n.position.y}])
            );
        }, [nodes]);

        // While dragging a node, compute the movement delta and apply it to the entire subtree.
        const onNodeDrag = useCallback((_: any, node: any) => {
            const startPositions = dragStartPositionsRef.current;
            const startPos = startPositions.get(node.id);
            if (!startPos) return;
            const dx = node.position.x - startPos.x;
            const dy = node.position.y - startPos.y;

            // Get the subtree (all descendants including the dragged node) based on the tree structure.
            const nodeMap = buildNodeTreeMap(paramNodes, paramEdges);
            const subtreeIds = new Set<string>();
            const collectSubtree = (id: string) => {
                subtreeIds.add(id);
                const info = nodeMap.get(id);
                if (info) {
                    info.children.forEach(childId => {
                        collectSubtree(childId);
                    });
                }
            };
            collectSubtree(node.id);

            // Update positions for all nodes in the subtree using their initial positions + the movement delta.
            setNodes(nds =>
                nds.map(n => {
                    if (subtreeIds.has(n.id)) {
                        const original = startPositions.get(n.id);
                        return original
                            ? {...n, position: {x: original.x + dx, y: original.y + dy}}
                            : n;
                    }
                    return n;
                })
            );
        }, [paramNodes, paramEdges, setNodes]);

        function onChangeListener(event: React.ChangeEvent<HTMLInputElement>) {
            const value = parseInt(event.target.value, 10);
            if (!isNaN(value)) {
                step_action(value);
            }
        }

        const [automaticExpanding, setAutomaticExpanding] = useState(true);

        function handleAutomaticExpandingChange(checked: boolean) {
            setAutomaticExpanding(checked);
        }

        function checkSameIndex(parse_step_info: ParseStepInfo, index: number): boolean {
            return parse_step_info.chosen_transition_index === index+1;
        }

        function fitView() {
            if (rfInstance.current) {
                rfInstance.current.fitView();
            }
        }

        const automaticExpandingWrapper = () => {
            if (automaticExpanding) {
                expand_all();
            }
            fitView();
        }

        // when the input nodes change, run several actions
        useEffect(() => {
            automaticExpandingWrapper();
        }, [paramNodes]);

        // Expose methods to parent
        useImperativeHandle(ref, () => ({
            expandAll: automaticExpandingWrapper,
        }));

        return (
            <ReactFlow
                onInit={(inst) => {
                    rfInstance.current = inst;
                }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                connectionLineType={ConnectionLineType.SmoothStep}
                nodeTypes={{parseTreeNode: ParseTreeNodeComponent}}
                fitView
                style={{backgroundColor: "#F7F9FB"}}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
                className="h-full w-full"
            >
                <Panel position="top-right" className="grid grid-cols-2 gap-4">
                    <Button onClick={() => onLayout("TB")} className="mr-2">
                        vertical layout
                    </Button>
                    <Button onClick={() => onLayout("LR")}>horizontal layout</Button>
                    <Button color="green" onClick={step_backwards}>Step Back</Button>
                    <Button color="green" onClick={step_forwards}>Step Forward</Button>
                    <Button color="green" onClick={step_to_last_decision}>Step to Last Decision</Button>
                    <Button color="green" onClick={step_to_next_decision}>Step to Next Decision</Button>
                    <Badge color={"blue"}>Current step:</Badge>
                    <Input type={"number"} min={0} max={500} step={1} value={parseInt(current_step || "0")}
                           onChange={onChangeListener}
                           className="text-black bg-blue-100 rounded-sm"
                    />
                    <Button color="fuchsia" onClick={toggle_expand}>Toggle Expand</Button>
                    <CheckboxGroup>
                        <CheckboxField>
                            <Checkbox onChange={handleAutomaticExpandingChange} defaultChecked={true}/>
                            <span data-slot="label">Expand when stepping</span>
                        </CheckboxField>
                    </CheckboxGroup>
                </Panel>
                <Panel position="top-left">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Rule Stack</h3>
                    <div className="mb-5 p-3 bg-slate-100 rounded-md border border-slate-200 max-h-60 overflow-y-auto shadow-sm">
                        {next_parse_step_info?.rule_stack && next_parse_step_info.rule_stack.length > 0 ? (
                            <ul className="divide-y divide-slate-300">
                                {[...next_parse_step_info.rule_stack].reverse().map((rule, index) => (
                                    <li key={index} className="py-1.5">
                                        <code className="text-sm text-gray-800">{rule}</code>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 italic">Empty stack</p>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Type: {next_parse_step_info?.step_type || "N/A"}</h3>


                    <div className="mb-5 p-3 bg-slate-100 rounded-md border border-slate-200 shadow-sm">
                        {next_parse_step_info?.step_type === "Token consume" ? (
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium text-gray-700">Consuming:</h3>
                                <code className="px-2 py-1 bg-violet-100 text-violet-800 rounded-md text-sm font-mono">{next_parse_step_info.current_token_repr}</code>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-base font-semibold mb-2 text-gray-700">
                                    Possible Alternatives ({next_parse_step_info?.possible_transitions?.length ?? 0})
                                </h3>
                                <div className="max-h-60 overflow-y-auto">
                                    {next_parse_step_info?.possible_transitions && next_parse_step_info.possible_transitions.length > 0 ? (
                                        <ul className="divide-y divide-slate-300">
                                            {next_parse_step_info.possible_transitions.map((t, i) => {
                                                const isChosen = checkSameIndex(next_parse_step_info, i);
                                                return (
                                                    <li key={i} className={`py-1.5 px-2 rounded-md ${isChosen ? "bg-blue-100" : ""}`}>
                                                        <code className={`text-sm flex items-center gap-2 ${isChosen ? "text-blue-700 font-bold" : "text-gray-800"}`}>
                                                            {isChosen && <span className="text-lg">&#8594;</span>}
                                                            <span>{t.matches}</span>
                                                            {isChosen && <span className="font-medium text-xs bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded-full">(chosen)</span>}
                                                        </code>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-500 italic">No alternatives</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Panel>
                <Controls/>
                <MiniMap/>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
            </ReactFlow>
        );
    });

export default Flow;
