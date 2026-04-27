"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Pcb() {
  return (
    <mesh position={[0, -0.2, 0]} receiveShadow>
      <boxGeometry args={[4.2, 0.12, 2.8]} />
      <meshStandardMaterial color="#0a1a16" metalness={0.35} roughness={0.7} />
      <Edges color="#1d7a5a" scale={1.001} />
    </mesh>
  );
}

function Capacitor({ x, z, h = 1.1, r = 0.28 }: { x: number; z: number; h?: number; r?: number }) {
  return (
    <group position={[x, h / 2 - 0.14, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, h, 36]} />
        <meshStandardMaterial
          color="#d4ad6b"
          metalness={0.8}
          roughness={0.28}
          emissive="#6a4f1f"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, h / 2 + 0.01, 0]}>
        <cylinderGeometry args={[r * 0.95, r * 0.95, 0.04, 36]} />
        <meshStandardMaterial color="#2a2013" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Esp32() {
  return (
    <group position={[-1.3, 0, 0.4]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.6]} />
        <meshStandardMaterial color="#141820" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.1, -0.08]} castShadow>
        <boxGeometry args={[0.9, 0.12, 0.38]} />
        <meshStandardMaterial color="#c7ccd3" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.17, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.36, 0.14]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>
    </group>
  );
}

function SsrRelay({ x }: { x: number }) {
  return (
    <mesh position={[x, 0.18, -0.8]} castShadow>
      <boxGeometry args={[0.55, 0.55, 0.45]} />
      <meshStandardMaterial color="#0b0e12" metalness={0.2} roughness={0.85} />
    </mesh>
  );
}

function Sensor({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.45, 0.42, 0.3]} />
        <meshStandardMaterial color="#1b222b" metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Oled() {
  return (
    <group position={[1.45, 0.06, 0.7]}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.08, 0.5]} />
        <meshStandardMaterial color="#0a0d10" metalness={0.3} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.34]} />
        <meshBasicMaterial color="#0a1218" toneMapped={false} />
      </mesh>
      <mesh position={[-0.2, 0.047, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.04]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>
      <mesh position={[0.15, 0.047, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 0.03]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} opacity={0.65} transparent />
      </mesh>
    </group>
  );
}

function Device({ spin = true }: { spin?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin && g.current) g.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={g} position={[0, -0.1, 0]}>
      <Pcb />
      <Esp32 />
      <Capacitor x={0.25} z={-0.3} h={1.0} r={0.24} />
      <Capacitor x={0.95} z={-0.3} h={1.25} r={0.28} />
      <Capacitor x={1.7} z={-0.3} h={1.55} r={0.32} />
      <SsrRelay x={-0.7} />
      <SsrRelay x={-0.1} />
      <SsrRelay x={0.5} />
      <Sensor x={-1.55} z={0.9} color="#22d3ee" />
      <Sensor x={1.55} z={-0.9} color="#f59e0b" />
      <Oled />
    </group>
  );
}

function Fallback() {
  return (
    <Html center>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
        Cargando 3D…
      </div>
    </Html>
  );
}

export function DeviceScene({ className }: { className?: string }) {
  const dpr = useMemo<[number, number]>(() => [1, 1.8], []);
  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: 320 }}>
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [4.6, 3.6, 5.8], fov: 36 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor("#07090b", 1)}
      >
        <hemisphereLight args={["#a0c8ff", "#0a1020", 0.55]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[5, 7, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#22d3ee" />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffff" distance={8} />

        <Suspense fallback={<Fallback />}>
          <Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.3}>
            <Device spin />
          </Float>
        </Suspense>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
          <planeGeometry args={[14, 10]} />
          <shadowMaterial opacity={0.35} />
        </mesh>
      </Canvas>
    </div>
  );
}
