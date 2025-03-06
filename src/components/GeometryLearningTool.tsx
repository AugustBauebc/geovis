import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Vector3 } from 'three';

// Main App Component
const GeometryLearningTool = () => {
  const [step, setStep] = useState(0);
  const [showExploration, setShowExploration] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  
  // Narrative steps for the guided experience
  const narrativeSteps = [
    "Welcome to your geometric journey. Let's start by exploring points in space.",
    "Points connect to form lines. Drag these points to see how lines change.",
    "Lines can enclose space to create shapes. Explore the triangle.",
    "Shapes can transform. Try rotating and scaling the shape.",
    "Now explore freely! Create your own geometric constructions."
  ];
  
  const nextStep = () => {
    if (step < narrativeSteps.length - 1) {
      setStep(step + 1);
    } else {
      setShowExploration(true);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-indigo-800">Geometry Explorer</h1>
          <div className="flex space-x-4">
            <button className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
              Shapes
            </button>
            <button className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
              Transformations
            </button>
            <button className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
              Problems
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex-grow flex">
        {/* 3D Canvas */}
        <div className="flex-grow relative">
          <Canvas camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom={true} enablePan={true} />
            
            {step === 0 && <PointsScene />}
            {step === 1 && <LinesScene />}
            {step === 2 && <ShapesScene />}
            {step === 3 && <TransformationsScene />}
            {showExploration && <ExplorationScene selectedShape={selectedShape} />}
          </Canvas>
          
          {/* Narrative Overlay */}
          {!showExploration && (
            <motion.div 
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg text-gray-800 mb-4">{narrativeSteps[step]}</p>
              <button 
                onClick={nextStep}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                {step < narrativeSteps.length - 1 ? "Continue" : "Start Exploring"}
              </button>
            </motion.div>
          )}
        </div>
        
        {/* Tools Panel (only in exploration mode) */}
        {showExploration && (
          <motion.div 
            className="w-64 bg-white shadow-lg p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-indigo-800">Geometry Tools</h2>
            <div className="space-y-3">
              <button 
                className="w-full py-2 px-4 bg-indigo-100 rounded-lg text-indigo-800 hover:bg-indigo-200 transition-colors text-left"
                onClick={() => setSelectedShape('point')}
              >
                Point
              </button>
              <button 
                className="w-full py-2 px-4 bg-indigo-100 rounded-lg text-indigo-800 hover:bg-indigo-200 transition-colors text-left"
                onClick={() => setSelectedShape('line')}
              >
                Line
              </button>
              <button 
                className="w-full py-2 px-4 bg-indigo-100 rounded-lg text-indigo-800 hover:bg-indigo-200 transition-colors text-left"
                onClick={() => setSelectedShape('triangle')}
              >
                Triangle
              </button>
              <button 
                className="w-full py-2 px-4 bg-indigo-100 rounded-lg text-indigo-800 hover:bg-indigo-200 transition-colors text-left"
                onClick={() => setSelectedShape('circle')}
              >
                Circle
              </button>
              <button 
                className="w-full py-2 px-4 bg-indigo-100 rounded-lg text-indigo-800 hover:bg-indigo-200 transition-colors text-left"
                onClick={() => setSelectedShape('cube')}
              >
                Cube
              </button>
            </div>
            
            <h2 className="text-lg font-semibold mt-6 mb-4 text-indigo-800">Properties</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Scale</label>
                <input type="range" className="w-full" min="0.5" max="2" step="0.1" defaultValue="1" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Rotation</label>
                <input type="range" className="w-full" min="0" max="360" step="1" defaultValue="0" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Color</label>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 cursor-pointer"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer"></div>
                  <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500 cursor-pointer"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Component for Points exploration (Step 1)
const PointsScene = () => {
  const [points, setPoints] = useState([
    { position: [-2, 0, 0], color: "red" },
    { position: [0, 2, 0], color: "blue" },
    { position: [2, -1, 0], color: "green" }
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

// Component for Lines exploration (Step 2)
const LinesScene = () => {
  const [points, setPoints] = useState([
    { position: [-2, 1, 0], color: "red" },
    { position: [2, 1, 0], color: "blue" },
    { position: [0, -2, 0], color: "green" }
  ]);
  
  return (
    <>
      {points.map((point, i) => (
        <DraggablePoint 
          key={`point-${i}`}
          position={point.position}
          color={point.color}
          onDrag={(newPos) => {
            const newPoints = [...points];
            newPoints[i].position = newPos;
            setPoints(newPoints);
          }}
        />
      ))}
      
      <Line 
        points={[
          new Vector3(...points[0].position),
          new Vector3(...points[1].position)
        ]}
        color="rgba(100, 100, 255, 0.8)"
        lineWidth={3}
      />
      
      <Line 
        points={[
          new Vector3(...points[1].position),
          new Vector3(...points[2].position)
        ]}
        color="rgba(100, 255, 100, 0.8)"
        lineWidth={3}
      />
      
      <Line 
        points={[
          new Vector3(...points[2].position),
          new Vector3(...points[0].position)
        ]}
        color="rgba(255, 100, 100, 0.8)"
        lineWidth={3}
      />
    </>
  );
};

// Component for Shapes exploration (Step 3)
const ShapesScene = () => {
  const [points, setPoints] = useState([
    { position: [-2, 1, 0], color: "red" },
    { position: [2, 1, 0], color: "blue" },
    { position: [0, -2, 0], color: "green" }
  ]);
  
  // Calculate center of triangle and area
  const calculateCenter = () => {
    const x = (points[0].position[0] + points[1].position[0] + points[2].position[0]) / 3;
    const y = (points[0].position[1] + points[1].position[1] + points[2].position[1]) / 3;
    const z = (points[0].position[2] + points[1].position[2] + points[2].position[2]) / 3;
    return [x, y, z];
  };
  
  const calculateArea = () => {
    const [x1, y1] = [points[0].position[0], points[0].position[1]];
    const [x2, y2] = [points[1].position[0], points[1].position[1]];
    const [x3, y3] = [points[2].position[0], points[2].position[1]];
    
    return Math.abs(0.5 * ((x1 * (y2 - y3)) + (x2 * (y3 - y1)) + (x3 * (y1 - y2))));
  };
  
  const center = calculateCenter();
  const area = calculateArea().toFixed(2);
  
  return (
    <>
      {points.map((point, i) => (
        <DraggablePoint 
          key={`point-${i}`}
          position={point.position}
          color={point.color}
          onDrag={(newPos) => {
            const newPoints = [...points];
            newPoints[i].position = newPos;
            setPoints(newPoints);
          }}
        />
      ))}
      
      {/* Lines connecting points */}
      <Line 
        points={[
          new Vector3(...points[0].position),
          new Vector3(...points[1].position),
          new Vector3(...points[2].position),
          new Vector3(...points[0].position)
        ]}
        color="rgba(180, 180, 255, 0.8)"
        lineWidth={3}
      />
      
      {/* Area label */}
      <Text
        position={center}
        color="black"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {`Area: ${area}`}
      </Text>
    </>
  );
};

// Component for Transformations exploration (Step 4)
const TransformationsScene = () => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  
  useFrame(() => {
    // Automatic slow rotation for demonstration
    setRotation((prev) => prev + 0.005);
  });
  
  return (
    <group rotation={[0, rotation, 0]} scale={scale}>
      <Box 
        args={[2, 2, 2]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="royalblue" />
      </Box>
      
      <Text
        position={[0, 2.5, 0]}
        color="black"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {`Rotation: ${(rotation * 180 / Math.PI).toFixed(0)}°`}
      </Text>
      
      <Text
        position={[0, -2.5, 0]}
        color="black"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {`Scale: ${scale.toFixed(2)}`}
      </Text>
    </group>
  );
};

// Free exploration mode
const ExplorationScene = ({ selectedShape }) => {
  return (
    <>
      {selectedShape === 'point' && <Sphere args={[0.2]} position={[0, 0, 0]} />}
      {selectedShape === 'line' && (
        <Line 
          points={[new Vector3(-2, 0, 0), new Vector3(2, 0, 0)]}
          color="blue"
          lineWidth={3}
        />
      )}
      {selectedShape === 'triangle' && (
        <Line 
          points={[
            new Vector3(-2, -1, 0),
            new Vector3(2, -1, 0),
            new Vector3(0, 2, 0),
            new Vector3(-2, -1, 0)
          ]}
          color="green"
          lineWidth={3}
        />
      )}
      {selectedShape === 'circle' && <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]} />}
      {selectedShape === 'cube' && <Box args={[2, 2, 2]} position={[0, 0, 0]} />}
      
      {!selectedShape && (
        <Text
          position={[0, 0, 0]}
          color="black"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          Select a shape from the panel
        </Text>
      )}
    </>
  );
};

// Draggable Point Component
const DraggablePoint = ({ position, color, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { camera, raycaster, mouse, size } = useThree();
  const meshRef = useRef();
  
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };
  
  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e) => {
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

export default GeometryLearningTool;