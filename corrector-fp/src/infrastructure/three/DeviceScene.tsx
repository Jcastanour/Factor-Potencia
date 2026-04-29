"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges, Environment, Grid, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  COMPONENTS,
  type DeviceComponent,
} from "@presentation/components/device/components-data";

export interface DeviceSceneApi {
  reset: () => void;
}

export interface DeviceSceneProps {
  readonly view: "externa" | "interna";
  readonly oled: { fp: number; pKw: number; sKva: number; qKvar: number };
  readonly mask: number;
  readonly selectedId: string | null;
  readonly onSelectHotspot: (id: string) => void;
  readonly className?: string;
  readonly apiRef?: React.MutableRefObject<DeviceSceneApi | null>;
}

/* ───────── PCB e internos ───────── */

function Pcb() {
  return (
    <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
      <boxGeometry args={[5.0, 0.08, 2.1]} />
      <meshStandardMaterial color="#1a5d3e" metalness={0.15} roughness={0.65} />
      <Edges color="#2a8a5c" scale={1.001} />
    </mesh>
  );
}

function Capacitor({ x, z, h, r, on }: { x: number; z: number; h: number; r: number; on: boolean }) {
  return (
    <group position={[x, 0.1 + h / 2, z]}>
      {/* Cuerpo aluminio cepillado */}
      <mesh castShadow>
        <cylinderGeometry args={[r, r, h, 36]} />
        <meshStandardMaterial
          color={on ? "#a8e8f5" : "#bcc4cd"}
          metalness={0.85}
          roughness={0.32}
          emissive={on ? "#22d3ee" : "#000000"}
          emissiveIntensity={on ? 0.45 : 0}
        />
      </mesh>
      {/* Banda lateral plástica */}
      <mesh position={[0, h * 0.18, 0]}>
        <cylinderGeometry args={[r * 1.005, r * 1.005, 0.06, 36]} />
        <meshStandardMaterial color="#1a1f27" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Tapa superior oscura con cruz */}
      <mesh position={[0, h / 2 + 0.005, 0]}>
        <cylinderGeometry args={[r * 0.96, r * 0.96, 0.04, 36]} />
        <meshStandardMaterial color="#1c1f24" metalness={0.4} roughness={0.65} />
      </mesh>
      {on && (
        <pointLight position={[0, h / 2, 0]} intensity={0.5} color="#22d3ee" distance={1.2} />
      )}
    </group>
  );
}

function Esp32() {
  return (
    <group>
      {/* PCB azul oscuro tipo módulo */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.7]} />
        <meshStandardMaterial color="#0a1f3a" metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Lata metálica del WROOM */}
      <mesh position={[0, 0.1, -0.1]} castShadow>
        <boxGeometry args={[0.9, 0.1, 0.45]} />
        <meshStandardMaterial color="#a8aeb6" metalness={0.95} roughness={0.18} />
      </mesh>
      {/* Sello impreso */}
      <mesh position={[0, 0.151, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.55, 0.18]} />
        <meshBasicMaterial color="#272d36" toneMapped={false} />
      </mesh>
      {/* Pines laterales */}
      {[-0.5, 0.5].map((zx) => (
        <mesh key={zx} position={[0, 0.04, zx > 0 ? 0.3 : -0.4]}>
          <boxGeometry args={[1.0, 0.02, 0.05]} />
          <meshStandardMaterial color="#1a1f27" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function PsuAcDc() {
  return (
    <group>
      {/* Caja plateada perforada tipo Mean Well */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.85, 0.4, 0.55]} />
        <meshStandardMaterial color="#c0c5cc" metalness={0.85} roughness={0.32} />
      </mesh>
      {/* Etiqueta frontal */}
      <mesh position={[0, 0.15, 0.276]}>
        <planeGeometry args={[0.7, 0.3]} />
        <meshStandardMaterial color="#dee2e8" metalness={0.1} roughness={0.65} />
      </mesh>
      {/* Borneras */}
      <mesh position={[0, 0.05, -0.27]}>
        <boxGeometry args={[0.7, 0.09, 0.06]} />
        <meshStandardMaterial color="#0a1218" metalness={0.4} roughness={0.7} />
      </mesh>
    </group>
  );
}

function SsrRelay({ x, z = 0, on }: { x: number; z?: number; on: boolean }) {
  return (
    <group position={[x, 0.38, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.55, 0.45]} />
        <meshStandardMaterial color="#15181d" metalness={0.25} roughness={0.7} />
      </mesh>
      {/* Disipador trasero (aletas) */}
      {[-0.18, -0.06, 0.06, 0.18].map((zx) => (
        <mesh key={zx} position={[zx, 0.05, -0.18]}>
          <boxGeometry args={[0.04, 0.4, 0.1]} />
          <meshStandardMaterial color="#a8aeb6" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
      {/* Etiqueta superior */}
      <mesh position={[0, 0.276, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.46, 0.34]} />
        <meshBasicMaterial color="#dde2ea" toneMapped={false} />
      </mesh>
      {/* LED activo */}
      <mesh position={[0.18, 0.28, 0.18]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={on ? "#ef4444" : "#3a1414"} toneMapped={false} />
      </mesh>
      {on && <pointLight position={[0.18, 0.28, 0.22]} intensity={0.45} color="#ef4444" distance={0.9} />}
    </group>
  );
}

function Sensor({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0.13, z]}>
      {/* PCB azul */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.4]} />
        <meshStandardMaterial color={color === "#22d3ee" ? "#0e3a5e" : "#102a4a"} metalness={0.25} roughness={0.55} />
      </mesh>
      {/* Transformador (caja amarilla/negra) */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.34, 0.18, 0.22]} />
        <meshStandardMaterial color="#1c2027" metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.262, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.2]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Fuse() {
  return (
    <group position={[-2.0, 0.18, 0.55]} rotation={[0, Math.PI / 2, 0]}>
      {/* Soporte */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.45]} />
        <meshStandardMaterial color="#0e1218" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Cilindro fusible cristal */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.34, 24]} />
        <meshPhysicalMaterial
          color="#dde6ee"
          metalness={0.1}
          roughness={0.05}
          transmission={0.85}
          thickness={0.3}
          ior={1.5}
        />
      </mesh>
      {/* Tapas metálicas */}
      {[-0.15, 0.15].map((zx) => (
        <mesh key={zx} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, zx]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
          <meshStandardMaterial color="#cdd3dc" metalness={0.95} roughness={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function Lcd() {
  return (
    <group position={[1.3, 0.05, 0.7]}>
      {/* PCB verde detrás */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[1.0, 0.04, 0.55]} />
        <meshStandardMaterial color="#1a5d3e" metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Display azul */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.85, 0.05, 0.42]} />
        <meshStandardMaterial color="#1a3a78" metalness={0.3} roughness={0.4} emissive="#0a4070" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

/* ───────── Carcasa exterior ───────── */

function Screw({ x, y, z = 1.205 }: { x: number; y: number; z?: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.025, 20]} />
        <meshStandardMaterial color="#9aa1ab" metalness={0.95} roughness={0.25} />
      </mesh>
      {/* Cruz Phillips */}
      <mesh position={[0, 0, 0.014]}>
        <boxGeometry args={[0.085, 0.012, 0.005]} />
        <meshStandardMaterial color="#2a2f37" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.014]}>
        <boxGeometry args={[0.012, 0.085, 0.005]} />
        <meshStandardMaterial color="#2a2f37" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Prensaestopas saliendo del lateral. side=-1 izquierda, side=1 derecha. */
function CableGland({ y, side }: { y: number; side: -1 | 1 }) {
  const xBase = side * 2.7; // pegado al borde lateral del cuerpo (5.4 / 2)
  const rot: [number, number, number] = side === -1 ? [0, 0, Math.PI / 2] : [0, 0, -Math.PI / 2];
  return (
    <group position={[xBase, y, 0]} rotation={rot}>
      {/* Tuerca hexagonal pegada al cuerpo */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 6]} />
        <meshStandardMaterial color="#3a4049" metalness={0.6} roughness={0.45} />
      </mesh>
      {/* Cuerpo del gland */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.18, 24]} />
        <meshStandardMaterial color="#2a3038" metalness={0.55} roughness={0.5} />
      </mesh>
      {/* Tapa exterior */}
      <mesh position={[0, 0.27, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.14, 0.1, 24]} />
        <meshStandardMaterial color="#1a1f27" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Cable saliendo */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.32, 16]} />
        <meshStandardMaterial color="#0a0d11" metalness={0.2} roughness={0.85} />
      </mesh>
    </group>
  );
}

interface EnclosureProps {
  /** Desplazamiento Y de la tapa (0 = cerrada, valor positivo = retirada hacia arriba). */
  readonly lidLift: number;
  readonly visible: boolean;
  /** 0 = totalmente sólido (vista externa), 1 = modo rayos X (vista interna). */
  readonly xray: number;
  readonly oled: DeviceSceneProps["oled"];
}

/* Dimensiones de la carcasa — más alargada y plana, fiel al boceto. */
const BOX_W = 5.4;
const BOX_H = 1.35;
const BOX_D = 2.4;

function OledScreen({ oled }: { oled: DeviceSceneProps["oled"] }) {
  return (
    <Html
      transform
      distanceFactor={1}
      position={[-1.25, 0.18, 0.008]}
      occlude="blending"
      zIndexRange={[100, 0]}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div
        style={{
          width: 360,
          height: 130,
          padding: "12px 18px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: "#7df3ff",
          fontSize: 26,
          lineHeight: 1.2,
          letterSpacing: "0.03em",
          textShadow: "0 0 6px rgba(34,211,238,0.9), 0 0 14px rgba(34,211,238,0.45)",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          rowGap: 2,
          columnGap: 14,
          alignContent: "center",
          background: "transparent",
          fontWeight: 500,
        }}
      >
        <span style={{ opacity: 0.85 }}>FP</span>
        <span style={{ textAlign: "right" }}>{oled.fp.toFixed(2)}</span>
        <span style={{ opacity: 0.85 }}>P</span>
        <span style={{ textAlign: "right" }}>{oled.pKw.toFixed(2)} kW</span>
        <span style={{ opacity: 0.85 }}>S</span>
        <span style={{ textAlign: "right" }}>{oled.sKva.toFixed(2)} kVA</span>
        <span style={{ opacity: 0.85 }}>Q</span>
        <span style={{ textAlign: "right" }}>{oled.qKvar.toFixed(2)} kVAr</span>
      </div>
    </Html>
  );
}

function Enclosure({ lidLift, visible, xray, oled }: EnclosureProps) {
  const bodyOpacity = 1 - xray * 0.88;
  const isXray = xray > 0.02;
  const frontOpacity = 1 - xray * 0.95;
  const halfH = BOX_H / 2;
  const halfD = BOX_D / 2;
  const cy = halfH; // centro vertical del cuerpo (apoyado en y=0)
  return (
    <group visible={visible}>
      {/* Cuerpo gris claro tipo ABS industrial */}
      <RoundedBox
        args={[BOX_W, BOX_H, BOX_D]}
        radius={0.08}
        smoothness={4}
        position={[0, cy, 0]}
        castShadow={!isXray}
        receiveShadow={!isXray}
      >
        <meshStandardMaterial
          color="#c8ccd1"
          metalness={0.04}
          roughness={0.72}
          transparent={isXray}
          opacity={bodyOpacity}
          depthWrite={!isXray}
        />
        {isXray && <Edges color="#22d3ee" scale={1.001} threshold={15} />}
      </RoundedBox>
      {/* Tapa superior — solo visible en vista externa */}
      {!isXray && (
        <group position={[0, BOX_H + 0.04 + lidLift, 0]}>
          <RoundedBox args={[BOX_W + 0.04, 0.08, BOX_D + 0.04]} radius={0.04} smoothness={3} castShadow>
            <meshStandardMaterial color="#d2d6db" metalness={0.06} roughness={0.68} />
          </RoundedBox>
        </group>
      )}
      {/* Detalles exteriores — sin texto, solo geometría */}
      {frontOpacity > 0.05 && (
        <group>
          {/* Frente */}
          <group position={[0, cy, halfD + 0.001]}>
            {/* OLED — marco recesado y vidrio oscuro */}
            <mesh position={[-1.25, 0.18, 0.001]}>
              <planeGeometry args={[1.95, 0.78]} />
              <meshStandardMaterial color="#15191e" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[-1.25, 0.18, 0.003]}>
              <planeGeometry args={[1.78, 0.62]} />
              <meshStandardMaterial
                color="#03070b"
                metalness={0.5}
                roughness={0.18}
                emissive="#0a3a4a"
                emissiveIntensity={0.65}
              />
            </mesh>
            {/* Texto OLED encendido — solo en vista externa para no colarse de espaldas */}
            {!isXray && <OledScreen oled={oled} />}
            {/* Glow tenue del cristal */}
            <pointLight position={[-1.25, 0.18, 0.4]} intensity={0.35} color="#22d3ee" distance={1.2} />
            {/* LEDs físicos sin texto */}
            <mesh position={[0.95, 0.32, 0.002]}>
              <sphereGeometry args={[0.06, 18, 18]} />
              <meshBasicMaterial color="#10B981" toneMapped={false} />
            </mesh>
            <pointLight position={[0.95, 0.32, 0.05]} intensity={0.25} color="#10B981" distance={0.5} />
            <mesh position={[0.95, 0.05, 0.002]}>
              <sphereGeometry args={[0.06, 18, 18]} />
              <meshBasicMaterial color="#F59E0B" toneMapped={false} />
            </mesh>
            <pointLight position={[0.95, 0.05, 0.05]} intensity={0.25} color="#F59E0B" distance={0.5} />
            <mesh position={[0.95, -0.22, 0.002]}>
              <sphereGeometry args={[0.06, 18, 18]} />
              <meshBasicMaterial color="#EF4444" toneMapped={false} />
            </mesh>
            <pointLight position={[0.95, -0.22, 0.05]} intensity={0.25} color="#EF4444" distance={0.5} />
            {/* Banda inferior — relieve para futura serigrafía, sin texto */}
            <mesh position={[0, -0.5, 0.001]}>
              <planeGeometry args={[BOX_W - 0.4, 0.18]} />
              <meshStandardMaterial color="#b8bcc1" metalness={0.06} roughness={0.7} />
            </mesh>
          </group>
          {/* Tornillos en las 4 esquinas del frente */}
          <Screw x={-2.45} y={cy + halfH - 0.18} />
          <Screw x={2.45} y={cy + halfH - 0.18} />
          <Screw x={-2.45} y={cy - halfH + 0.18} />
          <Screw x={2.45} y={cy - halfH + 0.18} />
          {/* Prensaestopas — uno a cada lado (entrada / salida) */}
          <CableGland y={cy} side={-1} />
          <CableGland y={cy} side={1} />
        </group>
      )}
    </group>
  );
}

/* ───────── Hotspot 3D ───────── */

interface HotspotProps {
  readonly comp: DeviceComponent;
  readonly selected: boolean;
  readonly onSelect: (id: string) => void;
}

function Hotspot({ comp, selected, onSelect }: HotspotProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 1.4;
  });
  const [hovered, setHovered] = useState(false);
  return (
    <group position={comp.position3D}>
      {/* Hit target invisible — generoso para que el click sea fácil */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}
        onClick={(e) => { e.stopPropagation(); onSelect(comp.id); }}
        renderOrder={998}
      >
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
      </mesh>
      <group ref={ref}>
        <mesh renderOrder={999}>
          <sphereGeometry args={[selected || hovered ? 0.13 : 0.1, 16, 16]} />
          <meshBasicMaterial
            color="#22D3EE"
            toneMapped={false}
            transparent
            opacity={0.95}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
        <mesh renderOrder={999}>
          <ringGeometry args={[0.16, 0.2, 32]} />
          <meshBasicMaterial
            color="#22D3EE"
            toneMapped={false}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      </group>
      <pointLight intensity={0.18} color="#22D3EE" distance={0.8} />
    </group>
  );
}

/* ───────── Interior (componentes en 3D) ───────── */

interface InternalsProps {
  readonly mask: number;
  readonly visible: boolean;
  readonly hotspots: ReactNode;
}

function Internals({ mask, visible, hotspots }: InternalsProps) {
  if (!visible) return null;
  // Layout en filas claras dentro del interior real (x∈[-2.5,2.5], z∈[-0.95,0.95])
  return (
    <group>
      <Pcb />
      {/* ── Columna alimentación (izquierda) ── */}
      <group position={[-2.0, 0.1, -0.55]}>
        <PsuAcDc />
      </group>
      <Fuse />
      {/* ── Control: ESP32 atrás-centro-izquierda ── */}
      <group position={[-0.7, 0.13, -0.5]}>
        <Esp32 />
      </group>
      {/* ── Fila central de SSRs ── */}
      <SsrRelay x={-0.7} z={0.0} on={(mask & 1) !== 0} />
      <SsrRelay x={-0.1} z={0.0} on={(mask & 2) !== 0} />
      <SsrRelay x={0.5} z={0.0} on={(mask & 4) !== 0} />
      {/* ── Condensadores en fila frontal-derecha ── */}
      <Capacitor x={1.4} z={0.6} h={0.85} r={0.2} on={(mask & 1) !== 0} />
      <Capacitor x={1.85} z={0.6} h={0.95} r={0.22} on={(mask & 2) !== 0} />
      <Capacitor x={2.3} z={0.6} h={0.95} r={0.22} on={(mask & 4) !== 0} />
      {/* ── Sensores en fila trasera ── */}
      <Sensor x={0.9} z={-0.55} color="#22d3ee" />
      <Sensor x={2.0} z={-0.55} color="#f59e0b" />
      {hotspots}
    </group>
  );
}

/* ───────── Lid lift animado por modo ───────── */

function useAnimatedNumber(target: number, speed = 6) {
  const [val, setVal] = useState(target);
  const valRef = useRef(target);
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * speed);
    valRef.current += (target - valRef.current) * k;
    if (Math.abs(valRef.current - val) > 0.001) setVal(valRef.current);
  });
  return val;
}

/* ───────── Auto-rotación con desactivación por interacción ───────── */

function useIdleAutoRotate(controlsRef: React.RefObject<OrbitControlsImpl | null>, idleMs = 2000) {
  const lastInteractionRef = useRef(performance.now());
  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    const onStart = () => { lastInteractionRef.current = performance.now(); };
    const onEnd = () => { lastInteractionRef.current = performance.now(); };
    c.addEventListener("start", onStart);
    c.addEventListener("end", onEnd);
    return () => {
      c.removeEventListener("start", onStart);
      c.removeEventListener("end", onEnd);
    };
  }, [controlsRef]);
  useFrame(() => {
    const c = controlsRef.current;
    if (!c) return;
    const idle = performance.now() - lastInteractionRef.current > idleMs;
    if (c.autoRotate !== idle) c.autoRotate = idle;
  });
}

/* ───────── Escena ───────── */

interface SceneInnerProps {
  readonly view: "externa" | "interna";
  readonly oled: DeviceSceneProps["oled"];
  readonly mask: number;
  readonly selectedId: string | null;
  readonly onSelectHotspot: (id: string) => void;
  readonly apiRef?: React.MutableRefObject<DeviceSceneApi | null>;
}

function SceneInner({ view, oled, mask, selectedId, onSelectHotspot, apiRef }: SceneInnerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const lidTarget = view === "interna" ? 0.55 : 0;
  const lidLift = useAnimatedNumber(lidTarget, 5);
  const internalAlpha = useAnimatedNumber(view === "interna" ? 1 : 0, 6);
  const xray = internalAlpha;
  const { camera } = useThree();
  const initialCam = useRef(new THREE.Vector3(2.4, 1.5, 3.2));

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      reset: () => {
        const c = controlsRef.current;
        if (!c) return;
        camera.position.copy(initialCam.current);
        c.target.set(0, 0.7, 0);
        c.update();
      },
    };
    return () => { if (apiRef) apiRef.current = null; };
  }, [apiRef, camera]);

  useIdleAutoRotate(controlsRef);

  const hotspots = useMemo(
    () => (
      <>
        {COMPONENTS.map((c) => (
          <Hotspot key={c.id} comp={c} selected={selectedId === c.id} onSelect={onSelectHotspot} />
        ))}
      </>
    ),
    [selectedId, onSelectHotspot],
  );

  return (
    <>
      <hemisphereLight args={["#e8f1ff", "#1a1f2a", 0.85]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={2.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 3, -3]} intensity={1.4} color="#9be8ff" />
      <directionalLight position={[0, 4, -6]} intensity={1.0} color="#ffd9a0" />
      <pointLight position={[0, 3.5, 2]} intensity={1.2} color="#ffffff" distance={10} />

      <Environment preset="warehouse" environmentIntensity={0.55} />

      <Enclosure lidLift={lidLift} xray={xray} visible oled={oled} />
      <Internals mask={mask} visible={internalAlpha > 0.02} hotspots={hotspots} />

      {/* Suelo: grid infinito + sombra suave de contacto, sin plano negro */}
      <Grid
        position={[0, -0.001, 0]}
        args={[30, 30]}
        cellSize={0.4}
        cellThickness={0.5}
        cellColor="#1a3a4a"
        sectionSize={2}
        sectionThickness={0.9}
        sectionColor="#22d3ee"
        fadeDistance={18}
        fadeStrength={1.4}
        infiniteGrid
      />
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.45}
        scale={10}
        blur={2.6}
        far={3}
        resolution={512}
        color="#000000"
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={2.8}
        maxDistance={10}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        autoRotate
        autoRotateSpeed={0.5}
        target={[0, 0.7, 0]}
      />
    </>
  );
}

/* ───────── Fallback ───────── */

function Fallback() {
  return (
    <Html center>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(232,238,245,0.5)",
        }}
      >
        Cargando 3D…
      </div>
    </Html>
  );
}

/* ───────── Componente público ───────── */

export function DeviceScene({
  view,
  oled,
  mask,
  selectedId,
  onSelectHotspot,
  className,
  apiRef,
}: DeviceSceneProps) {
  const dpr = useMemo<[number, number]>(() => [1, 1.8], []);
  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: 320 }}>
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [2.4, 1.5, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#0b1118", 1);
          scene.fog = new THREE.Fog("#0b1118", 12, 22);
        }}
      >
        <Suspense fallback={<Fallback />}>
          <SceneInner
            view={view}
            oled={oled}
            mask={mask}
            selectedId={selectedId}
            onSelectHotspot={onSelectHotspot}
            apiRef={apiRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
