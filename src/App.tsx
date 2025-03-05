import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import ParseNode from "./interfaces/ParseNode.ts";
import { rootNode, additionNode, nestedAdditionNode, numberNode12, numberNode4 } from "./constants";

function App() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const parseNodes = [rootNode, additionNode, nestedAdditionNode, numberNode12, numberNode4];
    visualizeParseTree(parseNodes, containerRef.current);
  }, []);

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

  function visualizeParseTree(nodes: ParseNode[], container: HTMLDivElement) {
    // Clear previous visualization
    d3.select(container).selectAll("*").remove();

    const hierarchy = buildHierarchy(nodes);
    const treeLayout = d3.tree<ParseNode>()
    .nodeSize([150, 300])  // Adjusted node spacing [x, y]
    .separation((a, b) => a.parent === b.parent ? 1.2 : 2); // Increased separation

    const root = treeLayout(hierarchy);
    
    // Calculate view dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG element
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create zoomable group
    const g = svg.append('g')
      .attr('transform', `translate(${width/4},${height/4})`);

    // Set up zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Calculate tree layout
    const graphNodes = root.descendants();
    const links = root.links();

    // Draw links first
    g.selectAll<SVGPathElement, d3.HierarchyPointLink<ParseNode>>('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<ParseNode>, d3.HierarchyPointNode<ParseNode>>()
        .x(d => d.y)  // Note: x corresponds to y in hierarchy layout
        .y(d => d.x)  // Note: y corresponds to x in hierarchy layout
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc');

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(graphNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    nodeGroups.append('circle')
      .attr('r', 10)
      .attr('fill', d => d.data.has_error ? 'red' : '#69b3a2');

    nodeGroups.append('text')
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

  return (
    <main>
      <h1 className="text-lg text-black">Parse Tree Visualization</h1>
      <div 
        ref={containerRef}
        id="tree-container"
        style={{ width: '100%', height: '600px' }}
      ></div>
    </main>
  );
}

export default App;