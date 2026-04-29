"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { useDemoSimulation } from "@application/demo/useDemoSimulation";
import {
  COMPONENTS,
  GROUPS,
  type DeviceComponent,
} from "@presentation/components/device/components-data";
import {
  DeviceSceneLoader,
  type DeviceSceneApi,
} from "@presentation/components/three/DeviceSceneLoader";

/* ───────────────────────── Iconos (mismo lenguaje del repo) ───────────────────────── */

const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </svg>
);
const IconBoxOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 8 12 3l9 5v9l-9 4-9-4z" />
    <path d="M3 8l9 5 9-5M8 5.8V11" />
  </svg>
);
const IconRotate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 3" />
    <path d="M21 3v6h-6" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 21" />
    <path d="M3 21v-6h6" />
  </svg>
);
const IconReset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 4v6h6" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L3 8" />
  </svg>
);
const IconPlug = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 2v5M15 2v5" />
    <rect x="6" y="7" width="12" height="7" rx="2" />
    <path d="M12 14v4a3 3 0 0 0 3 3" />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M13 2 4 14h7l-2 8 9-12h-7z" />
  </svg>
);
const IconGauge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 17a9 9 0 1 1 18 0" />
    <path d="M12 17l4-5" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M8 13h8M8 17h6" />
  </svg>
);
const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3v12M7 11l5 5 5-5M4 21h16" />
  </svg>
);
const IconPencil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M3 21l4-1 11-11-3-3L4 17z" />
    <path d="M14 6l3 3M13 21h8" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
);
const IconMinus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14" /></svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
);


/* ───────────────────────── Modal de hotspot ───────────────────────── */

interface HotspotModalProps {
  readonly component: DeviceComponent | null;
  readonly onClose: () => void;
}

function HotspotModal({ component, onClose }: HotspotModalProps) {
  useEffect(() => {
    if (!component) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [component, onClose]);

  if (!component) return null;
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card hotspot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-card-head">
          <div className="modal-card-tags">
            <span className="modal-card-num">{String(GROUPS[component.group].order + 1).padStart(2, "0")} / 05</span>
            <span className="modal-card-group">{GROUPS[component.group].label}</span>
          </div>
          <button type="button" className="modal-card-close" aria-label="Cerrar" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <h3 className="modal-card-title">{component.label}</h3>
        <p className="modal-card-role">{component.role}</p>
        <div className="modal-card-spec">
          <span className="modal-card-spec-label">SPEC</span>
          <span className="modal-card-spec-val">{component.spec}</span>
        </div>
        <div className="modal-card-footline">
          <span className="modal-card-status">
            <span className={"modal-card-dot " + (component.status === "prototype" ? "ok" : "amber")} />
            {component.status === "prototype" ? "EN PROTOTIPO" : "PROYECTADO"}
          </span>
          <span className="modal-card-hint">ESC PARA CERRAR</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ───────────────────────── Modal de imagen con zoom (ficha + boceto) ───────────────────────── */

interface ImageModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly src: string;
  readonly downloadName: string;
  readonly icon: React.ReactNode;
  readonly alt: string;
}

function ImageModal({ open, onClose, title, src, downloadName, icon, alt }: ImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const draggingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const reset = useCallback(() => { setZoom(1); setTx(0); setTy(0); }, []);

  // Reset solo cuando se abre (transición false → true)
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  // Listener de teclado mientras está abierto — no depende de onClose
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(5, z + 0.25));
      else if (e.key === "-") setZoom((z) => Math.max(0.5, z - 0.25));
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, reset]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      setZoom((z) => Math.min(5, Math.max(0.5, z * (1 + delta))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY, tx, ty };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !startRef.current) return;
    setTx(startRef.current.tx + (e.clientX - startRef.current.x));
    setTy(startRef.current.ty + (e.clientY - startRef.current.y));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    startRef.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  if (!open) return null;
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="ficha-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ficha-shell" onClick={(e) => e.stopPropagation()}>
        <span className="ficha-corner tl" />
        <span className="ficha-corner tr" />
        <span className="ficha-corner bl" />
        <span className="ficha-corner br" />
        <div className="ficha-bar">
          <div className="ficha-bar-left">
            {icon}
            <span className="ficha-title">{title}</span>
          </div>
          <div className="ficha-bar-actions">
            <div className="ficha-zoom-group">
              <button type="button" className="ficha-icon-btn" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} title="Reducir">
                <IconMinus />
              </button>
              <span className="ficha-zoom-val">{Math.round(zoom * 100)}%</span>
              <button type="button" className="ficha-icon-btn" onClick={() => setZoom((z) => Math.min(5, z + 0.25))} title="Aumentar">
                <IconPlus />
              </button>
              <button type="button" className="ficha-icon-btn" onClick={reset} title="Restablecer">
                <IconReset />
              </button>
            </div>
            <a className="ficha-action" href={src} target="_blank" rel="noreferrer">
              <IconExternal /> ABRIR
            </a>
            <a className="ficha-action primary" href={src} download={downloadName}>
              <IconDownload /> DESCARGAR
            </a>
            <button type="button" className="ficha-icon-btn close" onClick={onClose} aria-label="Cerrar">
              <IconClose />
            </button>
          </div>
        </div>
        <div
          className="ficha-stage"
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ cursor: zoom > 1 ? (draggingRef.current ? "grabbing" : "grab") : "default" }}
        >
          <div
            className="ficha-zoomwrap"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
              transition: draggingRef.current ? "none" : "transform .18s ease-out",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} draggable={false} />
          </div>
          <div className="ficha-hint mono">SCROLL: ZOOM · ARRASTRA: PAN · 0: RESET · ESC: CERRAR</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ───────────────────────── Componente principal ───────────────────────── */

function FeatureCell({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="feature-cell">
      <div className="ico">{icon}</div>
      <div>
        <h5>{title}</h5>
        <p>{body}</p>
      </div>
    </div>
  );
}

const SPECS: [string, string][] = [
  ["DIMENSIONES", "20 × 18 × 10 cm"],
  ["CARCASA", "ABS · IP54 (proyectada)"],
  ["MCU", "ESP32-WROOM-32"],
  ["ALIMENTACIÓN", "120 V / 60 Hz"],
  ["PANTALLA", "OLED I²C 128×64"],
  ["COMPENSACIÓN", "7 niveles · 1–7 kVAR"],
];

export default function DeviceClient() {
  const sim = useDemoSimulation();
  const [view, setView] = useState<"externa" | "interna">("externa");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fichaOpen, setFichaOpen] = useState(false);
  const [bocetoOpen, setBocetoOpen] = useState(false);
  const selectedComponent = useMemo(
    () => COMPONENTS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  // Handle al API de la escena 3D para resetear cámara
  const sceneApiRef = useRef<DeviceSceneApi | null>(null);

  // Reset
  const reset = useCallback(() => {
    setView("externa");
    setSelectedId(null);
    sceneApiRef.current?.reset();
  }, []);

  // OLED data desde simulación
  const oled = useMemo(() => ({
    fp: sim.state.compensatedReading.powerFactor,
    pKw: sim.state.compensatedReading.activeKw,
    sKva: sim.state.compensatedReading.apparentKva,
    qKvar: Math.max(0, sim.state.compensatedReading.reactiveKvar),
  }), [sim.state.compensatedReading]);

  const handleSelectHotspot = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <section id="dispositivo" data-screen-label="05 Propuesta">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">05 / 10</span>
          <span className="kicker">· Prototipo físico</span>
        </div>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, alignItems: "end", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 720 }}>
              <h2>
                Prototipo físico del sistema.
                <br />
                <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>Explóralo en 3D.</em>
              </h2>
              <p className="sec-sub" style={{ marginTop: 16 }}>
                Arrastra para rotarlo en cualquier dirección, alterna entre la <span style={{ color: "var(--cyan)" }}>vista externa</span>
                {" "}y la <span style={{ color: "var(--cyan)" }}>vista interna</span>, y toca cualquier hotspot para ver el rol de cada componente.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="chip" style={{ height: 30, fontSize: 11 }}>
                <span className="dot" style={{ background: "var(--amber)" }} />
                BOCETO · MODELO EN PREPARACIÓN
              </span>
              <span className="chip" style={{ height: 30, fontSize: 11 }}>SEMINARIO III</span>
            </div>
          </div>
        </div>

        <div className="reveal viewer3d" style={{ marginTop: 32 }}>
          <div className="viewer3d-bar">
            <div className="viewer3d-tabs" role="tablist" aria-label="Vista del modelo">
              <button
                className={"viewer3d-tab " + (view === "externa" ? "active" : "")}
                onClick={() => { setView("externa"); setSelectedId(null); }}
              >
                <IconBox /> Vista externa
              </button>
              <button
                className={"viewer3d-tab " + (view === "interna" ? "active" : "")}
                onClick={() => setView("interna")}
              >
                <IconBoxOpen /> Vista interna
              </button>
              <button
                type="button"
                className="viewer3d-tab ficha-tab"
                onClick={() => setBocetoOpen(true)}
                title="Ver bosquejo a lápiz original"
              >
                <IconPencil /> Boceto
              </button>
              <button
                type="button"
                className="viewer3d-tab ficha-tab"
                onClick={() => setFichaOpen(true)}
                title="Abrir ficha técnica con zoom"
              >
                <IconDoc /> Ficha técnica
              </button>
            </div>
            <div className="viewer3d-chips">
              <span className="viewer3d-hint"><IconRotate /> ARRASTRA PARA GIRAR</span>
              <button
                type="button"
                className="viewer3d-chip-btn"
                onClick={reset}
                title="Volver a la vista inicial"
              >
                <IconReset /> RESET
              </button>
            </div>
          </div>

          <div className="viewer3d-stage" style={{ touchAction: "none" }}>
            <div className="viewer3d-canvas">
              <DeviceSceneLoader
                view={view}
                oled={oled}
                mask={sim.state.mask}
                selectedId={selectedId}
                onSelectHotspot={handleSelectHotspot}
                apiRef={sceneApiRef}
              />
            </div>

            <span className="viewer3d-corner tl" />
            <span className="viewer3d-corner tr" />
            <span className="viewer3d-corner bl" />
            <span className="viewer3d-corner br" />

            {/* HUD */}
            <div className="viewer3d-hud">
              <div className="hud-left">
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)" }}>
                  RENDER
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>
                  three.js · r3f
                </span>
              </div>
              <div className="hud-right">
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)" }}>
                  {view === "externa"
                    ? "VISTA EXTERNA · CARCASA INDUSTRIAL"
                    : `VISTA INTERNA · ${COMPONENTS.length} COMPONENTES · 5 GRUPOS`}
                </span>
              </div>
            </div>
          </div>

          <div className="viewer3d-features">
            <FeatureCell icon={<IconPlug />} title="Plug & Play" body="Instalación directa en el tablero eléctrico del comercio." />
            <FeatureCell icon={<IconBolt />} title="Corrección automática" body="Ajuste inteligente en pasos binarios de 1 kVAR." />
            <FeatureCell icon={<IconGauge />} title="Monitoreo en vivo" body="Parámetros eléctricos visibles en pantalla OLED." />
            <FeatureCell icon={<IconShield />} title="Seguro y aislado" body="Sensores galvánicamente aislados. SSR de estado sólido." />
          </div>
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          {SPECS.map(([k, v]) => (
            <div key={k} style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: 4, background: "var(--bg-elev)" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}>{k}</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--fg)", marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <HotspotModal component={selectedComponent} onClose={() => setSelectedId(null)} />
      <ImageModal
        open={fichaOpen}
        onClose={() => setFichaOpen(false)}
        title="FICHA TÉCNICA · CORRECTOR DE FACTOR DE POTENCIA"
        src="/ficha-tecnica.png"
        downloadName="ficha-tecnica-corrector-fp.png"
        icon={<IconDoc />}
        alt="Ficha técnica del corrector de factor de potencia"
      />
      <ImageModal
        open={bocetoOpen}
        onClose={() => setBocetoOpen(false)}
        title="BOCETO A LÁPIZ · DISEÑO ORIGINAL"
        src="/boceto-lapiz.png"
        downloadName="boceto-corrector-fp.png"
        icon={<IconPencil />}
        alt="Boceto a lápiz del corrector de factor de potencia"
      />
    </section>
  );
}
