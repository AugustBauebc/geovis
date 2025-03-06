import React, { useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface DraggablePointProps {
  position: [number, number, number];
  color: string;
  onDrag: (newPos: [number, number, number]) => void;
}

const DraggablePoint: React.FC<DraggablePointProps> = ({ position, color, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { camera, raycaster, mouse, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      
      // Calculate mouse position in normalized device coordinates
      const x = (e.clientX / size.width) * 2 - 1;
      const y = -(e.clientY / size.height) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera({ x, y }, camera);
      
      // Find intersection with plane at z=0
      const planeNormal = new Vector3(0, 0, 1);
      const planeConstant = 0; // distance from origin along normal
      const plane = new Vector3().copy(planeNormal).multiplyScalar(-planeConstant);
      
      const ray = raycaster.ray;
      const denominator = planeNormal.dot(ray.direction);
      
      if (Math.abs(denominator) > 0.0001) {
        const t = -(ray.origin.dot(planeNormal) + planeConstant) / denominator;
        if (t >= 0) {
          const intersection = new Vector3().copy(ray.direction).multiplyScalar(t).add(ray.origin);
          onDrag([intersection.x, intersection.y, 0]);
        }
      }
    }
  };
  
  return (
    <Sphere
      ref={meshRef}
      args={[0.3, 32, 32]}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <meshStandardMaterial color={color} />
    </Sphere>
  );
};

export default DraggablePoint;