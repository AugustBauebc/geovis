import React, { useState } from 'react';
import DraggablePoint from '../common/DraggablePoint';

const PointsScene: React.FC = () => {
  const [points, setPoints] = useState([
    { position: [-2, 0, 0] as [number, number, number], color: "red" },
    { position: [0, 2, 0] as [number, number, number], color: "blue" },
    { position: [2, -1, 0] as [number, number, number], color: "green" }
  ]);
  
  return (
    <>
      {points.map((point, i) => (
        <DraggablePoint 
          key={i}
          position={point.position}
          color={point.color}
          onDrag={(newPos) => {
            const newPoints = [...points];
            newPoints[i].position = newPos;
            setPoints(newPoints);
          }}
        />
      ))}
    </>
  );
};

export default PointsScene;