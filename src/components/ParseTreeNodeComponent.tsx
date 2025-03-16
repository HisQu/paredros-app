import React from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { ParseTreeNode, ParseTreeNodeData } from '../interfaces/ParseTreeNode';
import { nodeWidth, nodeHeight } from '../constants';

const handleSize = 8; // in pixels
const handleOffset = -(handleSize / 2); // -4px, so that the handle’s center is on the border

const ParseTreeNodeComponent = ({
  data,
  targetPosition,
}: NodeProps<ParseTreeNode>) => {
  // If targetPosition is 'left', assume horizontal layout; otherwise, vertical.
  const isHorizontal = targetPosition === 'left';

  const containerStyle: React.CSSProperties = {
    width: nodeWidth,   // fixed width
    height: nodeHeight, // fixed height
  };

  function NodeContentComponent({data} : {data: ParseTreeNodeData}) {
    const isRule = !!data.ruleName;
    const background = isRule ? 'bg-blue-400' : 'bg-violet-400'

    return <div className={`w-full h-full flex flex-col font-black text-white justify-center ${background}`}>
        <span>
          {data.ruleName || data.token}
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
        <NodeContentComponent data={data} />
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
        <NodeContentComponent data={data} />
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
