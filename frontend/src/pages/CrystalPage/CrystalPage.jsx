// frontend/src/pages/CrystalPage/CrystalPage.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import './CrystalPage.css';

// --- 3D Components ---

// A light that follows the mouse cursor
function CursorLight() {
  const lightRef = useRef();
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = (state.mouse.x * viewport.width) / 2;
      lightRef.current.position.y = (state.mouse.y * viewport.height) / 2;
    }
  });

  return <pointLight ref={lightRef} distance={10} intensity={3} color="#aaccff" />;
}

// The central, interactive Nexus
function Nexus({ status, onPointerDown, onPointerUp, chargeProgress }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const isCharging = status === 'charging';
  const isComplete = status === 'complete';

  useFrame(({ clock }, delta) => {
    if (!meshRef.current || !ringRef.current) return;
    const t = clock.getElapsedTime();
    
    // Animate the Nexus pulsing
    meshRef.current.rotation.y += delta * 0.1;
    const scale = isComplete ? 1.5 + Math.sin(t*2) * 0.1 : 1 + Math.sin(t*2) * 0.05;
    meshRef.current.scale.setScalar(scale);

    // Animate the charging ring
    ringRef.current.scale.setScalar(chargeProgress * 2.5);
    ringRef.current.material.opacity = (1 - chargeProgress) * 0.75;
  });

  return (
    <group>
      {/* The main sphere */}
      <mesh
        ref={meshRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerUp} // Also trigger release if mouse leaves
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={isComplete ? '#fff' : '#aaccff'}
          emissive={isComplete ? '#fff' : '#aaccff'}
          emissiveIntensity={isComplete ? 2 : 0.5}
          roughness={0.1}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* The charging ring */}
      {!isComplete && (
          <mesh ref={ringRef} rotation-x={Math.PI / 2}>
            <ringGeometry args={[0.6, 0.65, 64]} />
            <meshBasicMaterial color="#aaccff" transparent opacity={0} />
          </mesh>
      )}
    </group>
  );
}

// The ethereal glyphs that represent the beats
function BeatGlyph({ beat, index, status, chargeProgress }) {
    const groupRef = useRef();
    const isCharging = status === 'charging';

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // When charging, pull the glyph towards the center
        if (isCharging) {
            const chargeTarget = new THREE.Vector3(0,0,0);
            groupRef.current.position.lerp(chargeTarget, delta * (1 + index * 0.2));
            groupRef.current.material.opacity -= delta * 0.8;
        }
    });
    
    // Only render if the system is idle or charging
    if (status === 'complete') return null;

    return(
        <Text
            ref={groupRef}
            position={[(index - 1) * 2.5, 2.5, -2]}
            fontSize={0.3}
            color="#aaccff"
            material-transparent={true}
            material-opacity={isCharging ? 1 : 0.5}
        >
            {beat.title}
        </Text>
    );
}


// --- Main Page Component ---
function CrystalPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle -> charging -> imprinting -> complete -> error
  const [charge, setCharge] = useState(0);
  const chargeIntervalRef = useRef();

  const handlePointerDown = () => {
    if (status !== 'idle' || cartItems.length === 0) return;

    setStatus('charging');
    // Start charging up when mouse is held down
    chargeIntervalRef.current = setInterval(() => {
      setCharge(c => {
        const newCharge = c + 0.02;
        if (newCharge >= 1) {
          clearInterval(chargeIntervalRef.current);
          return 1;
        }
        return newCharge;
      });
    }, 20);
  };

  const handlePointerUp = () => {
    clearInterval(chargeIntervalRef.current);

    if (charge >= 1) {
      // If fully charged, start the purchase process
      setStatus('imprinting');
      const purchasePromises = cartItems.map(item =>
        fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'user1', beatId: item.id }),
        })
      );
      Promise.all(purchasePromises)
        .then(() => {
          setTimeout(() => {
            setStatus('complete');
            clearCart();
            setTimeout(() => navigate('/hub'), 2500);
          }, 1500);
        })
        .catch(() => setStatus('error'));
    } else {
      // If not fully charged, reset
      setStatus('idle');
      setCharge(0);
    }
  };
  
  const infoText = useMemo(() => {
    switch(status) {
        case 'charging': return "Channeling...";
        case 'imprinting': return "Releasing...";
        case 'complete': return "The Echo Resonates...";
        case 'error': return "A Dissonance Was Detected.";
        default: return cartItems.length > 0 ? "Channel the Echoes" : "Manifest is Empty";
    }
  }, [status, cartItems.length]);

  return (
    <div className="nexus-page-wrapper">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#05050a']} />
        <ambientLight intensity={0.1} />
        <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <CursorLight />

        <Nexus
          status={status}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          chargeProgress={charge}
        />

        {cartItems.map((item, index) => (
          <BeatGlyph key={item.id} beat={item} index={index} status={status} chargeProgress={charge}/>
        ))}

        <Text position={[0, -2, 0]} fontSize={0.2} color="white" opacity={0.5}>
          {infoText}
        </Text>
      </Canvas>
    </div>
  );
}

export default CrystalPage;