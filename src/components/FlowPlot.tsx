import { useCallback, useEffect, useState } from "react";
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
  Position,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";

import { Button } from "../components/ui/button.tsx";
import { nodeHeight, nodeWidth } from "../constants";
import { ParseTreeNode } from "../interfaces/ParseTreeNode";
import ParseTreeNodeComponent from "../components/ParseTreeNodeComponent";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

// Helper function to build a node tree map for easy access
const buildNodeTreeMap = (nodes: ParseTreeNode[], edges: Edge[]) => {
  const nodeMap = new Map<string, { node: ParseTreeNode, children: string[] }>();
  
  // Initialize all nodes with empty children arrays
  nodes.forEach(node => {
    nodeMap.set(node.id, { node, children: [] });
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
  
  // Return only the visible nodes
  return allNodes.filter(node => visibleNodeIds.has(node.id)).map(node => {
    const nodeInfo = nodeMap.get(node.id);
    return {
      ...node,
      data: {
        ...node.data,
        hasChildren: nodeInfo?.children.length ? true : false,
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
  direction = "TB"
) => {
  // Filter visible edges to only those connecting visible nodes
  const visibleNodes = getVisibleNodes(nodes, edges, expandedNodes);
  const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
  
  const visibleEdges = edges.filter(
    edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );
  
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  visibleNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
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

  return { nodes: newNodes, edges: newEdges };
};

const Flow = ({
  node: paramNodes,
  edge: paramEdges,
  step_backwards,
  step_forwards
}: {
  node: ParseTreeNode[];
  edge: Edge[];
  step_forwards: (event: React.MouseEvent<HTMLButtonElement>) => void;
  step_backwards: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  // Track expanded nodes in a Set, with root nodes expanded by default
  const [expandedNodes, setExpandedNodes] = useState(() => {
    const rootNodeIds = paramNodes
      .filter(node => !paramEdges.some(edge => edge.target === node.id))
      .map(node => node.id);
    return new Set(rootNodeIds);
  });

  // Toggle function to expand/collapse nodes
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

  const { nodes: initNodes, edges: initEdges } = getLayoutedElements(
    paramNodes,
    paramEdges,
    expandedNodes,
    onToggleNode
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // Update layout when the input nodes, edges, or expanded state changes
  useEffect(() => {
    const { nodes: newLayoutNodes, edges: newLayoutEdges } = getLayoutedElements(
      paramNodes,
      paramEdges,
      expandedNodes,
      onToggleNode
    );
    
    setNodes(newLayoutNodes);
    setEdges(newLayoutEdges);
  }, [paramNodes, paramEdges, expandedNodes, onToggleNode, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    [setEdges]
  );

  const onLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        paramNodes,
        paramEdges,
        expandedNodes,
        onToggleNode,
        direction
      );
      
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [paramNodes, paramEdges, expandedNodes, onToggleNode, setNodes, setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={{ parseTreeNode: ParseTreeNodeComponent }}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={true}
    >
      <Panel position="top-right" className="grid grid-cols-2 gap-4">
        <Button onClick={() => onLayout("TB")} className="mr-2">
          vertical layout
        </Button>
        <Button onClick={() => onLayout("LR")}>horizontal layout</Button>
        <Button color="green" onClick={step_backwards}>Step Back</Button>
        <Button color="green" onClick={step_forwards}>Step Forward</Button>
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};

export default Flow;
