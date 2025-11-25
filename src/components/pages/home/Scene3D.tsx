import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OceanWaves() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (
      meshRef.current &&
      (meshRef.current as any).userData.originalPositions
    ) {
      const time = state.clock.getElapsedTime();
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.attributes.position;
      const originalPositions = (meshRef.current as any).userData
        .originalPositions;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = originalPositions[i].x;
        const y = originalPositions[i].y;

        const waveX = Math.sin(x * 0.4 + time * 0.5) * 0.25;
        const waveY = Math.sin(y * 0.4 + time * 0.4) * 0.25;
        const waveXY = Math.sin((x + y) * 0.25 + time * 0.6) * 0.15;

        positionAttribute.setZ(i, waveX + waveY + waveXY);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.2, 0, 0]}
      position={[0, -3, -2]}
    >
      <planeGeometry args={[30, 30, 80, 80]} />
      <meshStandardMaterial
        color="#06b6d4"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        wireframe={false}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}

function IslandWithHome() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        -1.2 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
      meshRef.current.rotation.z =
        Math.sin(state.clock.getElapsedTime() * 0.6) * 0.03;
    }
  });

  return (
    <group ref={meshRef} position={[3, -1, -3]}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.8, 16]} />
        <meshStandardMaterial color="#f4d03f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color="#e8d4a0" />
      </mesh>
      <mesh position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.8, 4]} />
        <meshStandardMaterial color="#c44536" />
      </mesh>
      <mesh position={[0, 0.5, 0.81]}>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[-0.5, 0.9, 0.81]}>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      <mesh position={[0.5, 0.9, 0.81]}>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      <mesh position={[1.2, 0.8, 0.8]}>
        <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      {[0, 1, 2, 3, 4].map((j) => (
        <mesh
          key={j}
          position={[
            1.2 + Math.cos((j * Math.PI) / 2.5) * 0.25,
            1.8,
            0.8 + Math.sin((j * Math.PI) / 2.5) * 0.25,
          ]}
          rotation={[0, (j * Math.PI) / 2.5, Math.PI / 3.5]}
        >
          <boxGeometry args={[0.7, 0.08, 0.15]} />
          <meshStandardMaterial color="#2d5016" />
        </mesh>
      ))}
    </group>
  );
}

function Home() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        -1.2 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
      meshRef.current.rotation.z =
        Math.sin(state.clock.getElapsedTime() * 0.6) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[3, -1, -3]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.3, 1.8]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color="#e8d4a0" />
      </mesh>
      <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.8, 4]} />
        <meshStandardMaterial color="#c44536" />
      </mesh>
      <mesh position={[0, 0.7, 0.81]}>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[-0.5, 1.1, 0.81]}>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      <mesh position={[0.5, 1.1, 0.81]}>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
    </group>
  );
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffd700" />
      <OceanWaves />
      <Home />
      <IslandWithHome />
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#87ceeb" />
      </mesh>
    </Canvas>
  );
}
