// frontend/src/pages/CrystalPage/CrystalPage.jsx

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import './CrystalPage.css';

// A simple spinning box to show the canvas is working
function SpinningBox() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'#aaccff'} />
    </mesh>
  );
}

// The new, clean Crystal Page component
export default function CrystalPage() {
  return (
    <div className="crystal-canvas-container">
      <Canvas>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <SpinningBox />
      </Canvas>
    </div>
  );
}