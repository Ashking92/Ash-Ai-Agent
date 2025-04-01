
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Bounds } from '@react-three/drei';
import { Mesh, Group, Color, MathUtils } from 'three';

interface ModelProps {
  isSpeaking: boolean;
  emotion?: string;
}

// More realistic male character model
function MaleModel({ isSpeaking, emotion = 'neutral' }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const faceMaterialRef = useRef<any>(null);
  const mouthRef = useRef<Mesh>(null);
  
  // Enhanced animation for the model with more realistic movements
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Realistic breathing animation
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    
    // More natural head movements when speaking
    if (isSpeaking && headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
      headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.01;
      
      // Mouth animation when speaking
      if (mouthRef.current) {
        mouthRef.current.scale.y = 0.5 + Math.abs(Math.sin(state.clock.getElapsedTime() * 10)) * 0.5;
      }
    } else if (mouthRef.current) {
      // Return mouth to normal when not speaking
      mouthRef.current.scale.y = MathUtils.lerp(mouthRef.current.scale.y, 1, 0.1);
    }
  });

  // Enhanced color effects based on emotion
  useEffect(() => {
    if (!faceMaterialRef.current) return;
    
    const material = faceMaterialRef.current;
    
    switch(emotion) {
      case 'happy':
        material.emissive = new Color('#2a5caa');
        material.emissiveIntensity = 0.08;
        material.color = new Color('#e8c9a3');
        break;
      case 'sad':
        material.emissive = new Color('#202020');
        material.emissiveIntensity = 0.05;
        material.color = new Color('#d8b996');
        break;
      case 'excited':
        material.emissive = new Color('#3a6fb5');
        material.emissiveIntensity = 0.12;
        material.color = new Color('#f0d5b7');
        break;
      case 'thoughtful': 
        material.emissive = new Color('#342278');
        material.emissiveIntensity = 0.07;
        material.color = new Color('#e1c4a1');
        break;
      default:
        material.emissive = new Color('#1a2b4c');
        material.emissiveIntensity = 0.05;
        material.color = new Color('#e1c4a1');
    }
  }, [emotion]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={1.2}>
      {/* Enhanced Head with better shading */}
      <mesh ref={headRef} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          ref={faceMaterialRef}
          color="#e1c4a1"
          roughness={0.35}
          metalness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Enhanced Face features */}
      {/* Improved Eyes */}
      <group position={[0, 2.1, 0.3]}>
        {/* Left eye socket */}
        <mesh position={[-0.15, 0.05, 0.15]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#d8b59a" roughness={0.6} />
        </mesh>
        
        {/* Left eye */}
        <mesh position={[-0.15, 0.05, 0.18]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        
        {/* Left iris with depth */}
        <mesh position={[-0.15, 0.05, 0.26]}>
          <sphereGeometry args={[0.05, 24, 24]} />
          <meshPhysicalMaterial 
            color="#3a87ad" 
            roughness={0.1} 
            clearcoat={0.8}
            clearcoatRoughness={0.2}
          />
        </mesh>
        
        {/* Left pupil with natural shine */}
        <mesh position={[-0.15, 0.05, 0.31]}>
          <sphereGeometry args={[0.02, 24, 24]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Right eye socket */}
        <mesh position={[0.15, 0.05, 0.15]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#d8b59a" roughness={0.6} />
        </mesh>
        
        {/* Right eye */}
        <mesh position={[0.15, 0.05, 0.18]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        
        {/* Right iris with depth */}
        <mesh position={[0.15, 0.05, 0.26]}>
          <sphereGeometry args={[0.05, 24, 24]} />
          <meshPhysicalMaterial 
            color="#3a87ad" 
            roughness={0.1} 
            clearcoat={0.8}
            clearcoatRoughness={0.2}
          />
        </mesh>
        
        {/* Right pupil with natural shine */}
        <mesh position={[0.15, 0.05, 0.31]}>
          <sphereGeometry args={[0.02, 24, 24]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
      
      {/* Improved Eyebrows with better shape */}
      <mesh position={[-0.15, 2.2, 0.45]} rotation={[0.1, 0, 0.1]}>
        <boxGeometry args={[0.15, 0.025, 0.03]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 2.2, 0.45]} rotation={[0.1, 0, -0.1]}>
        <boxGeometry args={[0.15, 0.025, 0.03]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      
      {/* More realistic Nose */}
      <mesh position={[0, 2.05, 0.4]}>
        <coneGeometry args={[0.07, 0.2, 16]} />
        <meshStandardMaterial color="#d8bc9a" roughness={0.6} />
      </mesh>
      
      {/* Animated Mouth */}
      <mesh ref={mouthRef} position={[0, 1.9, 0.4]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#b0665c" roughness={0.5} />
      </mesh>
      
      {/* Enhanced Hair with better styling */}
      <group position={[0, 2.3, 0]}>
        {/* Top hair with volume */}
        <mesh position={[0, 0.2, 0]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        
        {/* Side hair - left with better detail */}
        <mesh position={[-0.48, -0.1, 0]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.18, 0.3, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        
        {/* Side hair - right with better detail */}
        <mesh position={[0.48, -0.1, 0]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.18, 0.3, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        
        {/* Back hair with better styling */}
        <mesh position={[0, -0.1, -0.3]}>
          <boxGeometry args={[0.85, 0.4, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
      </group>
      
      {/* Improved Neck with better shading */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#e1c4a1" roughness={0.5} metalness={0.05} />
      </mesh>
      
      {/* Body - Better T-shirt with realistic materials */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.4, 1.0, 16, 24]} />
        <meshStandardMaterial color="#e9e9e9" roughness={0.7} />
      </mesh>
      
      {/* Better T-shirt collar */}
      <mesh position={[0, 1.5, 0.2]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#d9d9d9" roughness={0.7} />
      </mesh>
      
      {/* Better shaped Shoulders */}
      <mesh position={[-0.35, 1.45, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e9e9e9" roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 1.45, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e9e9e9" roughness={0.7} />
      </mesh>
      
      {/* Better looking Arms */}
      {/* Left arm */}
      <group position={[-0.5, 1.3, 0]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.13, 0.6, 12, 24]} />
          <meshStandardMaterial color="#e1c4a1" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Right arm */}
      <group position={[0.5, 1.3, 0]} rotation={[0, 0, 0.1]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.13, 0.6, 12, 24]} />
          <meshStandardMaterial color="#e1c4a1" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Enhanced animation indicator (better glow when speaking) */}
      {isSpeaking && (
        <>
          <pointLight
            position={[0, 2.0, 0.5]}
            color="#60a5fa"
            intensity={0.6}
            distance={1.5}
            decay={2}
          />
          <pointLight
            position={[0, 1.9, 0.5]}
            color="#ffffff"
            intensity={0.4}
            distance={1.0}
            decay={2}
          />
        </>
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
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} />
        <directionalLight position={[0, 5, 5]} intensity={0.4} castShadow />
        <MaleModel isSpeaking={isSpeaking} emotion={emotion} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          rotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default AiModel;
