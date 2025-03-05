import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import ParseNode from "./interfaces/ParseNode.ts";

import { rootNode, additionNode, nestedAdditionNode, numberNode12, numberNode4 } from "./constants.ts";

import * as d3 from 'd3';

function buildHierarchy(nodes: ParseNode[]): d3.HierarchyNode<ParseNode> {
  const nodeMap = new Map<number, ParseNode>();
  const d3Nodes = new Map<number, d3.HierarchyNode<ParseNode>>();

  // Create map of original nodes and initialize D3 nodes
  nodes.forEach(node => {
    nodeMap.set(node.state, node);
    d3Nodes.set(node.state, d3.hierarchy(node));
  });

  console.log(nodes)

  // Initialize with type that allows null
  let currentD3Node: d3.HierarchyNode<ParseNode> | null = d3Nodes.get(nodes[0].state)!;
  const visited = new Set<number>();
  const root = currentD3Node;

  console.log("currentd3node", currentD3Node)

  while (currentD3Node) {
    console.log("currentd3node", currentD3Node)

    const parseNode:ParseNode = currentD3Node.data;
    if (visited.has(parseNode.state)) break;
    visited.add(parseNode.state);

    if (parseNode.next_node) {
      const nextParseNode = parseNode.next_node;
      const nextD3Node = d3Nodes.get(nextParseNode.state)!;
      
      // Check if next node is parent using null-safe optional chaining
      if (parseNode.parent?.state === nextParseNode.state) {
        currentD3Node = d3Nodes.get(parseNode.parent.state) ?? null;
      } else {
        if (!currentD3Node.children) currentD3Node.children = [];
        currentD3Node.children.push(nextD3Node);
        nextD3Node.parent = currentD3Node;
        currentD3Node = nextD3Node;
      }
    } else {
      // Explicitly allow null assignment
      currentD3Node = currentD3Node.parent as d3.HierarchyNode<ParseNode> | null;
    }
  }

  return root!;
}

function visualizeParseTree(nodes: ParseNode[], containerId: string) {
  const hierarchy = buildHierarchy(nodes);
  const treeLayout = d3.tree<ParseNode>()
    .nodeSize([100, 200])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.5);

  const root = treeLayout(hierarchy);
  const svg = d3.select(`#${containerId}`)
  .append('svg')
  .attr('width', 1280)
  .attr('height', 800);

  // Create a group for all zoomable content
  const g = svg.append('g')
    .attr('transform', 'translate(100,50)');

  // Create zoom behavior
  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  // Apply zoom to the SVG
  svg.call(zoom);

  // Draw nodes
  const drawNodes = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // Node circles
  drawNodes.append('circle')
    .attr('r', 10)
    .attr('fill', (d:any) => d.data.has_error ? 'red' : '#69b3a2');

  // Node labels
  drawNodes.append('text')
    .attr('dx', 15)
    .attr('dy', 5)
    .text(d => 
      `State: ${d.data.state}\n` +
      `Rule: ${d.data.rule_name}\n` +
      `Token: ${d.data.current_token}`
    )
    .style('font-size', '10px')
    .clone(true).lower()
    .attr('stroke', 'white');
}

// Usage
const parseNodes: ParseNode[] = [ rootNode, additionNode, nestedAdditionNode, numberNode12, numberNode4 ];

visualizeParseTree(parseNodes, 'tree-container');

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main>
      <h1 className="text-lg text-black">Hello</h1>
      <div id="tree-container"></div>
    </main>
  );
}

export default App;
