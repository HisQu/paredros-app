import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {ParseTreeNode, ParseTreeNodeData} from '../interfaces/ParseTreeNode';
import {nodeWidth, nodeHeight} from '../constants';

const handleSize = 8; // in pixels
const handleOffset = -4; // -4px, so that the handle's center is on the border

const ParseTreeNodeComponent = ({
                                    data,
                                    targetPosition,
                                    id,
                                }: NodeProps<ParseTreeNode>) => {
    // If the targetPosition is 'left', assume a horizontal layout; otherwise, vertical.
    const isHorizontal = targetPosition === 'left';

    const containerStyle: React.CSSProperties = {
        width: nodeWidth,   // fixed width
        height: nodeHeight, // fixed height
        cursor: data.hasChildren ? 'pointer' : 'default',
        position: 'relative',
    };

    function NodeContentComponent({data}: { data: ParseTreeNodeData }) {
        // Handle preview nodes
        if (data.isPreview) {
            const previewBackground = data.isChosenPreview ? 'bg-green-500' : 'bg-gray-400';
            const previewText = data.isChosenPreview ? 'text-white' : 'text-gray-700';
            const opacity = data.isChosenPreview ? 'opacity-90' : 'opacity-70';

            return <div
                className={`w-full h-full flex flex-col font-bold justify-center items-center ${previewBackground} ${previewText} ${opacity} border-2 ${data.isChosenPreview ? 'border-green-700' : 'border-gray-500'} border-dashed rounded`}
            >
            <span className="text-xs px-1 text-center break-all">
              {data.token}
            </span>
            </div>
        }

        const isRule = !!data.ruleName;

        const shade = data.isLastAdded ? '600' : (data.isExpanded ? '400' : '300');
        const background = isRule ? `bg-blue-${shade}` : `bg-violet-${shade}`;

        // Add expand/collapse indicator if node has children
        const expandIndicator = data.hasChildren
            ? (data.isExpanded ? "[-]" : "[+]")
            : "";

        return <div
            className={`w-full h-full flex flex-col font-black text-white justify-center ${background} ${data.isLastAdded ? 'ring-2 ring-amber-300 rounded shadow-xl shadow-amber-500/20' : ''}`}
            onClick={() => data.hasChildren && data.toggleNode && data.toggleNode(id)}
        >
        <span>
          {data.ruleName || data.token} {expandIndicator}
        </span>
        </div>
    }

    if (isHorizontal) {
        return (
            <div style={containerStyle}>
                <Handle
                    type="target"
                    position={Position.Left}
                    id="a"
                    style={{
                        top: '50%',
                        left: `${handleOffset}px`, // centers the handle on the left border
                        transform: 'translateY(-50%)',
                        background: '#555',
                        width: `${handleSize}px`,
                        height: `${handleSize}px`,
                    }}
                />
                <NodeContentComponent data={data}/>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="b"
                    style={{
                        top: '50%',
                        right: `${handleOffset}px`, // centers the handle on the right border
                        transform: 'translateY(-50%)',
                        background: '#555',
                        width: `${handleSize}px`,
                        height: `${handleSize}px`,
                    }}
                />
            </div>
        );
    } else {
        return (
            <div style={containerStyle}>
                <Handle
                    type="target"
                    position={Position.Top}
                    id="a"
                    style={{
                        left: '50%',
                        top: `${handleOffset}px`, // centers the handle on the top border
                        transform: 'translateX(-50%)',
                        background: '#555',
                        width: `${handleSize}px`,
                        height: `${handleSize}px`,
                    }}
                />
                <NodeContentComponent data={data}/>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="b"
                    style={{
                        left: '50%',
                        bottom: `${handleOffset}px`, // centers the handle on the bottom border
                        transform: 'translateX(-50%)',
                        background: '#555',
                        width: `${handleSize}px`,
                        height: `${handleSize}px`,
                    }}
                />
            </div>
        );
    }
};

export default ParseTreeNodeComponent;
