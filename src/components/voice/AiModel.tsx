
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Mesh, Group } from 'three';

interface ModelProps {
  isSpeaking: boolean;
  emotion?: string;
}

// Male character model
function MaleModel({ isSpeaking, emotion = 'neutral' }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  
  // Animation for the model
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle breathing animation
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    
    // Subtle head movement when speaking
    if (isSpeaking && headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
      headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }
  });

  // Color effects based on emotion
  useEffect(() => {
    if (!headRef.current?.material) return;
    
    // Apply subtle lighting effects based on emotion
    const material = headRef.current.material as any;
    
    switch(emotion) {
      case 'happy':
        material.emissive.set('#103f8e');
        material.emissiveIntensity = 0.2;
        break;
      case 'sad':
        material.emissive.set('#202020');
        material.emissiveIntensity = 0.1;
        break;
      case 'excited':
        material.emissive.set('#123456');
        material.emissiveIntensity = 0.3;
        break;
      case 'thoughtful': 
        material.emissive.set('#342278');
        material.emissiveIntensity = 0.15;
        break;
      default:
        material.emissive.set('#1a2b4c');
        material.emissiveIntensity = 0.2;
    }
  }, [emotion]);

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={1.5}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#d4b996"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.4, 1.4, 8, 16]} />
        <meshStandardMaterial 
          color="#2c5282" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <meshStandardMaterial 
          color="#e1c4a1"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Left arm */}
      <group position={[-0.6, 1.3, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
          <meshStandardMaterial color="#2c5282" roughness={0.8} />
        </mesh>
        
        {/* Left hand */}
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#e1c4a1" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Right arm */}
      <group position={[0.6, 1.3, 0]} rotation={[0, 0, Math.PI / 8]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
          <meshStandardMaterial color="#2c5282" roughness={0.8} />
        </mesh>
        
        {/* Right hand */}
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#e1c4a1" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Legs */}
      <group position={[0, 0.3, 0]}>
        {/* Left leg */}
        <mesh position={[-0.22, -0.5, 0]}>
          <capsuleGeometry args={[0.15, 1, 8, 16]} />
          <meshStandardMaterial color="#1a365d" roughness={0.8} />
        </mesh>
        
        {/* Right leg */}
        <mesh position={[0.22, -0.5, 0]}>
          <capsuleGeometry args={[0.15, 1, 8, 16]} />
          <meshStandardMaterial color="#1a365d" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Animation indicator (glowing when speaking) */}
      {isSpeaking && (
        <pointLight
          position={[0, 2.2, 0.7]}
          color="#ffffff"
          intensity={2}
          distance={3}
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
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <MaleModel isSpeaking={isSpeaking} emotion={emotion} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AiModel;
