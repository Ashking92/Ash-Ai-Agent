
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Mesh, Group, Color } from 'three';

interface ModelProps {
  isSpeaking: boolean;
  emotion?: string;
}

// Realistic male character model
function MaleModel({ isSpeaking, emotion = 'neutral' }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const faceMaterialRef = useRef<any>(null);
  
  // Animation for the model
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Subtle breathing animation
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    
    // Natural head movement when speaking
    if (isSpeaking && headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
      headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.01;
    }
  });

  // Color effects based on emotion
  useEffect(() => {
    if (!faceMaterialRef.current) return;
    
    const material = faceMaterialRef.current;
    
    switch(emotion) {
      case 'happy':
        material.emissive = new Color('#103f8e');
        material.emissiveIntensity = 0.1;
        break;
      case 'sad':
        material.emissive = new Color('#202020');
        material.emissiveIntensity = 0.05;
        break;
      case 'excited':
        material.emissive = new Color('#123456');
        material.emissiveIntensity = 0.15;
        break;
      case 'thoughtful': 
        material.emissive = new Color('#342278');
        material.emissiveIntensity = 0.07;
        break;
      default:
        material.emissive = new Color('#1a2b4c');
        material.emissiveIntensity = 0.05;
    }
  }, [emotion]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={1.2}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          ref={faceMaterialRef}
          color="#e1c4a1"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      
      {/* Face features */}
      {/* Eyes */}
      <group position={[0, 2.1, 0.3]}>
        {/* Left eye */}
        <mesh position={[-0.15, 0.05, 0.18]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Left iris */}
        <mesh position={[-0.15, 0.05, 0.26]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#3a87ad" />
        </mesh>
        {/* Left pupil */}
        <mesh position={[-0.15, 0.05, 0.31]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Right eye */}
        <mesh position={[0.15, 0.05, 0.18]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Right iris */}
        <mesh position={[0.15, 0.05, 0.26]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#3a87ad" />
        </mesh>
        {/* Right pupil */}
        <mesh position={[0.15, 0.05, 0.31]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
      
      {/* Eyebrows */}
      <mesh position={[-0.15, 2.2, 0.45]} rotation={[0.1, 0, 0.1]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>
      <mesh position={[0.15, 2.2, 0.45]} rotation={[0.1, 0, -0.1]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 2.05, 0.4]}>
        <coneGeometry args={[0.07, 0.2, 8]} />
        <meshStandardMaterial color="#d8bc9a" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, 1.9, 0.4]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#b0665c" />
      </mesh>
      
      {/* Hair */}
      <group position={[0, 2.3, 0]}>
        {/* Top hair */}
        <mesh position={[0, 0.2, 0]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        
        {/* Side hair - left */}
        <mesh position={[-0.48, -0.1, 0]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.5]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        
        {/* Side hair - right */}
        <mesh position={[0.48, -0.1, 0]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.5]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
        
        {/* Back hair */}
        <mesh position={[0, -0.1, -0.3]}>
          <boxGeometry args={[0.8, 0.4, 0.2]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#e1c4a1" />
      </mesh>
      
      {/* Body - T-shirt */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.4, 1.0, 12, 16]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      
      {/* T-shirt collar */}
      <mesh position={[0, 1.5, 0.2]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#d5d5d5" />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-0.35, 1.45, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      <mesh position={[0.35, 1.45, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      
      {/* Arms */}
      {/* Left arm */}
      <group position={[-0.5, 1.3, 0]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.13, 0.6, 8, 16]} />
          <meshStandardMaterial color="#e1c4a1" />
        </mesh>
      </group>
      
      {/* Right arm */}
      <group position={[0.5, 1.3, 0]} rotation={[0, 0, 0.1]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.13, 0.6, 8, 16]} />
          <meshStandardMaterial color="#e1c4a1" />
        </mesh>
      </group>
      
      {/* Animation indicator (subtle glow when speaking) */}
      {isSpeaking && (
        <pointLight
          position={[0, 2.0, 0.5]}
          color="#ffffff"
          intensity={0.8}
          distance={1.5}
          decay={2}
        />
      )}
    </group>
  );
}

interface AiModelProps {
  isSpeaking: boolean;
  emotion?: string;
}

const AiModel = ({ isSpeaking, emotion = 'neutral' }: AiModelProps) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 1.5, 3], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} />
        <MaleModel isSpeaking={isSpeaking} emotion={emotion} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AiModel;
