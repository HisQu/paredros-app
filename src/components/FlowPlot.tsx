import { useCallback, useEffect } from "react";
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
  Node,
  Edge,
  Position,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";

import { Button } from "../components/ui/button.tsx";
import { nodeHeight, nodeWidth } from "../constants";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? ("left" as Position) : ("top" as Position),
      sourcePosition: isHorizontal ? ("right" as Position) : ("bottom" as Position),
      // Adjust the position to account for the React Flow node anchor (top-left)
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const Flow = ({ node: paramNodes, edge: paramEdges }: { node: Node[]; edge: Edge[] }) => {
  const { nodes: initNodes, edges: initEdges } = getLayoutedElements(paramNodes, paramEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // Update layout when the input nodes or edges change
  useEffect(() => {
    const { nodes: newLayoutNodes, edges: newLayoutEdges } = getLayoutedElements(paramNodes, paramEdges);
    setNodes(newLayoutNodes);
    setEdges(newLayoutEdges);
  }, [paramNodes, paramEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    [setEdges]
  );

  const onLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Panel position="top-right" className="grid grid-cols-2 gap-4">
        <Button onClick={() => onLayout("TB")} className="mr-2">
          vertical layout
        </Button>
        <Button onClick={() => onLayout("LR")}>horizontal layout</Button>
        <Button color="green">Step Back</Button>
        <Button color="green">Step Forward</Button>
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};

export default Flow;
