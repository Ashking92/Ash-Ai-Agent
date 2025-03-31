
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Mesh, Group } from 'three';

interface ModelProps {
  isSpeaking: boolean;
  emotion?: string;
}

function AIHead({ isSpeaking, emotion = 'neutral' }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  
  // Simple animation based on speaking state
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle floating animation
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.05;
    
    // Rotation animation when speaking
    if (isSpeaking) {
      groupRef.current.rotation.y += 0.005;
    } else {
      // Slowly return to default position when not speaking
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Change color based on emotion
  useEffect(() => {
    if (!meshRef.current?.material) return;
    
    const material = meshRef.current.material as any;
    
    switch(emotion) {
      case 'happy':
        material.color.set('#4287f5'); // Blue
        break;
      case 'sad':
        material.color.set('#6c757d'); // Grey
        break;
      case 'excited':
        material.color.set('#39e75f'); // Green
        break;
      case 'thoughtful': 
        material.color.set('#a55eea'); // Purple
        break;
      default:
        material.color.set('#3498db'); // Default blue
    }
  }, [emotion]);

  return (
    <group ref={groupRef}>
      {/* Simple glowing sphere as placeholder for more complex model */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          emissive={isSpeaking ? "#ffffff" : "#3498db"} 
          emissiveIntensity={isSpeaking ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Orbital ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#1a73e8" 
          emissive="#1a73e8"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Second orbital ring at different angle */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#34a0f2" 
          emissive="#34a0f2"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Particles/small spheres around the main sphere */}
      {[...Array(12)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos(i / 12 * Math.PI * 2) * 1.8,
            Math.sin(i / 12 * Math.PI * 2) * 1.8,
            0
          ]}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={isSpeaking ? 0.8 : 0.3}
          />
        </mesh>
      ))}
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
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <AIHead isSpeaking={isSpeaking} emotion={emotion} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AiModel;
