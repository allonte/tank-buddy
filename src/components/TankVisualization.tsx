import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface TankVisualizationProps {
  level: number;
  capacity: number;
  unit?: string;
}

interface BulletTankProps {
  fillPercentage: number;
}

const BulletTank = ({ fillPercentage }: BulletTankProps) => {
  const tankRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Group>(null);

  // Animate rotation
  useFrame((state) => {
    if (tankRef.current) {
      tankRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Tank dimensions
  const cylinderRadius = 1;
  const cylinderLength = 4;
  const hemisphereRadius = 1;

  // Colors based on fill level
  const getLiquidColor = () => {
    if (fillPercentage <= 10) return "#c53030"; // Red/danger
    if (fillPercentage <= 25) return "#d97706"; // Amber/warning
    return "#2563eb"; // Blue (Murban blue)
  };

  const tankColor = "#e5e7eb"; // Light gray tank body
  const strokeColor = "#991b1b"; // Murban red for accents

  // Calculate liquid fill height (from bottom of tank)
  const totalHeight = cylinderRadius * 2;
  const fillHeight = (fillPercentage / 100) * totalHeight;
  const liquidY = -cylinderRadius + fillHeight / 2;

  return (
    <group ref={tankRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Tank body - cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[cylinderRadius, cylinderRadius, cylinderLength, 32]} />
        <meshStandardMaterial
          color={tankColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left hemisphere */}
      <mesh position={[-cylinderLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <sphereGeometry args={[hemisphereRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={tankColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right hemisphere */}
      <mesh position={[cylinderLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[hemisphereRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={tankColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tank wireframe outline */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[cylinderRadius * 1.001, cylinderRadius * 1.001, cylinderLength, 32]} />
        <meshBasicMaterial color={strokeColor} wireframe />
      </mesh>

      {/* Liquid fill - using a clipped box for the main cylinder area */}
      <group ref={liquidRef}>
        {fillPercentage > 0 && (
          <>
            {/* Main liquid body */}
            <mesh position={[0, liquidY, 0]}>
              <boxGeometry args={[cylinderLength, fillHeight, cylinderRadius * 1.8]} />
              <meshStandardMaterial
                color={getLiquidColor()}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Liquid surface wave effect */}
            <mesh position={[0, -cylinderRadius + fillHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[cylinderRadius * 0.85, 32]} />
              <meshStandardMaterial
                color={getLiquidColor()}
                transparent
                opacity={0.95}
                emissive={getLiquidColor()}
                emissiveIntensity={0.2}
              />
            </mesh>
          </>
        )}
      </group>

      {/* Support legs */}
      <mesh position={[-1.2, -cylinderRadius - 0.3, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.5]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[1.2, -cylinderRadius - 0.3, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.5]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Top valve */}
      <mesh position={[0, cylinderRadius + 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0, cylinderRadius + 0.45, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={strokeColor} />
      </mesh>
    </group>
  );
};

const TankVisualization = ({ level, capacity, unit = "L" }: TankVisualizationProps) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const percentage = (level / capacity) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getGlowColor = () => {
    if (percentage <= 10) return "shadow-[0_0_60px_hsl(0_72%_51%/0.4)]";
    if (percentage <= 25) return "shadow-[0_0_60px_hsl(38_92%_50%/0.4)]";
    return "shadow-[0_0_60px_hsl(225_55%_45%/0.3)]";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 3D Bullet Tank */}
      <div className={`relative w-full h-64 rounded-xl overflow-hidden ${getGlowColor()}`}>
        <Canvas
          camera={{ position: [0, 2, 6], fov: 45 }}
          style={{ background: "linear-gradient(180deg, hsl(220 15% 96%) 0%, hsl(220 15% 90%) 100%)" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <pointLight position={[0, -2, 3]} intensity={0.3} color="#2563eb" />
          
          <BulletTank fillPercentage={animatedLevel} />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Level indicators */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium mb-1">Current Level</p>
          <p className="text-4xl font-bold gradient-text font-mono">
            {animatedLevel.toFixed(1)}%
          </p>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium mb-1">Volume</p>
          <p className="text-4xl font-bold text-foreground font-mono">
            {level.toLocaleString()} <span className="text-xl text-muted-foreground">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TankVisualization;
