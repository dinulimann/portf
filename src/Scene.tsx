import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import type { Application, SPEObject } from "@splinetool/runtime";
import {
  Box,
  Expand,
  Minus,
  MousePointer2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Rotate3D,
  ScanLine,
  Shrink,
} from "lucide-react";
import { profile } from "./data";
import { sceneModes } from "./scene-config";
import type { SceneMode } from "./scene-config";
import "./scene.css";

const Spline = lazy(() => import("@splinetool/react-spline"));

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function OrbitSystem() {
  return (
    <div className="orbit-system" aria-hidden="true">
      <div className="orbital-plane plane-equator">
        <div className="orbital-track">
          <i />
          <i />
          <span className="orbit-satellite">
            <span />
          </span>
        </div>
      </div>
      <div className="orbital-plane plane-diagonal">
        <div className="orbital-track">
          <i />
          <span className="orbit-satellite">
            <span />
          </span>
        </div>
      </div>
    </div>
  );
}

function FallbackCore() {
  return (
    <div className="scene-fallback" aria-hidden="true">
      <div className="core-perspective">
        <div className="core-stack">
          <div className="core-layer layer-top">
            <Box size={48} strokeWidth={1} />
            <span>DI.</span>
          </div>
          <div className="core-layer layer-middle">
            <i />
            <i />
            <i />
          </div>
          <div className="core-layer layer-bottom">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Scene() {
  const container = useRef<HTMLDivElement>(null);
  const application = useRef<Application | null>(null);
  const robot = useRef<SPEObject | null>(null);
  const pointerFrame = useRef(0);
  const rotation = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // Keep the canvas mounted after the first request, including if paused during loading.
  const [requested, setRequested] = useState(enabled);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(!document.hidden);
  const [mode, setMode] = useState<SceneMode>(sceneModes[0]);
  const [zoom, setZoom] = useState(100);
  const [rotating, setRotating] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullScreenError, setFullScreenError] = useState("");
  const scanTimer = useRef<number | undefined>(undefined);
  const motionActive = enabled && visible;

  useEffect(() => {
    if (enabled) setRequested(true);
  }, [enabled]);

  useEffect(() => {
    if (!requested || ready || failed) return;
    const timeout = window.setTimeout(() => {
      application.current = null;
      robot.current = null;
      setFailed(true);
    }, 25000);
    return () => window.clearTimeout(timeout);
  }, [requested, ready, failed, attempt]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    const app = application.current;
    if (!app || !ready) return;
    if (motionActive) app.play();
    else app.stop();
  }, [motionActive, ready]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setEnabled(!media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onChange = () =>
      setExpanded(document.fullscreenElement === container.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const app = application.current;
    if (!app || !ready) return;
    app.setZoom(zoom / 100);
    app.requestRender();
  }, [zoom, ready]);

  // Bot is a verified group in the demo. Custom scenes may omit it.
  // Rotates the Spline object itself, independently of the HTML orbit layers.
  useEffect(() => {
    const app = application.current;
    const object = robot.current;
    if (!app || !object || !ready) return;
    if (!motionActive) {
      if (!rotating) {
        rotation.current = mode.rotation;
        object.rotation.y = mode.rotation;
        app.requestRender();
      }
      return;
    }
    let frame = 0;
    let previousTime = 0;
    const tick = (time: number) => {
      const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.05)
        : 0;
      previousTime = time;
      if (rotating) rotation.current += delta * 0.34;
      else {
        const difference = Math.atan2(
          Math.sin(mode.rotation - rotation.current),
          Math.cos(mode.rotation - rotation.current),
        );
        rotation.current += difference * (1 - Math.exp(-delta * 5));
      }
      object.rotation.y = rotation.current;
      app.requestRender();
      if (
        rotating ||
        Math.abs(Math.sin(mode.rotation - rotation.current)) > 0.001
      )
        frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, motionActive, rotating, ready]);

  useEffect(
    () => () => {
      cancelAnimationFrame(pointerFrame.current);
      window.clearTimeout(scanTimer.current);
    },
    [],
  );

  function onLoad(app: Application) {
    application.current = app;
    app.setBackgroundColor("transparent");
    robot.current = app.findObjectByName("Bot") ?? null;
    rotation.current = robot.current?.rotation.y ?? 0;
    setCanRotate(!!robot.current);
    setReady(true);
    setFailed(false);
  }

  const resetPointer = useCallback(() => {
    cancelAnimationFrame(pointerFrame.current);
    pointer.current = { x: 0, y: 0 };
    container.current?.style.setProperty("--pointer-x", "0");
    container.current?.style.setProperty("--pointer-y", "0");
  }, []);

  useEffect(() => {
    if (!motionActive) resetPointer();
  }, [motionActive, resetPointer]);

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (!motionActive || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      container.current?.style.setProperty(
        "--pointer-x",
        String(pointer.current.x),
      );
      container.current?.style.setProperty(
        "--pointer-y",
        String(pointer.current.y),
      );
    });
  }

  function retry() {
    application.current = null;
    robot.current = null;
    setCanRotate(false);
    setReady(false);
    setFailed(false);
    setRequested(true);
    setEnabled(true);
    setAttempt((value) => value + 1);
  }

  function scan() {
    window.clearTimeout(scanTimer.current);
    setScanning(true);
    scanTimer.current = window.setTimeout(() => setScanning(false), 2600);
  }

  function reset() {
    setMode(sceneModes[0]);
    setZoom(100);
    setRotating(false);
    setScanning(false);
    window.clearTimeout(scanTimer.current);
    resetPointer();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === container.current)
        await document.exitFullscreen();
      else await container.current?.requestFullscreen();
      setFullScreenError("");
    } catch {
      setFullScreenError("Layar penuh tidak tersedia di browser ini.");
    }
  }

  return (
    <div
      className={`scene-stage scene-lab ${ready ? "scene-ready" : ""} ${motionActive ? "" : "scene-paused"} ${scanning ? "is-scanning" : ""}`}
      data-mode={mode.id}
      data-zoom={zoom}
      data-rotating={rotating}
      style={
        {
          "--scene-accent": mode.accent,
          "--scene-rgb": mode.rgb,
        } as CSSProperties
      }
      ref={container}
      onPointerMove={movePointer}
      onPointerLeave={resetPointer}
      role="region"
      aria-label="Laboratorium 3D interaktif"
    >
      <div className="lab-topline">
        <div className="lab-identity mono">
          <span className="lab-live-dot" /> INTERACTIVE PLAYGROUND
        </div>
        {document.fullscreenEnabled && (
          <button
            className="lab-icon-button"
            onClick={toggleFullscreen}
            aria-label={
              expanded ? "Keluar layar penuh 3D" : "Buka 3D layar penuh"
            }
            title={expanded ? "Keluar layar penuh" : "Layar penuh"}
          >
            {expanded ? <Shrink size={15} /> : <Expand size={15} />}
          </button>
        )}
      </div>

      <div className="lab-viewport">
        <div className="lab-ambient" aria-hidden="true" />
        <div className="lab-parallax">
          <OrbitSystem />
          <div className="lab-platform" aria-hidden="true">
            <span />
          </div>
        </div>
        <FallbackCore />
        {requested && !failed && (
          <div
            className="spline-layer"
            role="img"
            aria-label="Karakter robot Spline 3D interaktif"
          >
            <SceneBoundary
              key={attempt}
              onError={() => {
                application.current = null;
                robot.current = null;
                setFailed(true);
                setReady(false);
                setCanRotate(false);
              }}
            >
              <Suspense fallback={null}>
                <Spline
                  scene={profile.splineScene}
                  onLoad={onLoad}
                  renderOnDemand
                />
              </Suspense>
            </SceneBoundary>
          </div>
        )}
        <div className="lab-scan-beam" aria-hidden="true" />

        <div className="lab-hotspots" aria-label="Jelajahi fokus keahlian">
          {sceneModes.map((item) => (
            <button
              key={item.id}
              className={`lab-hotspot hotspot-${item.id} ${mode.id === item.id ? "is-selected" : ""}`}
              aria-pressed={mode.id === item.id}
              aria-label={`Jelajahi ${item.title}`}
              onClick={() => {
                setMode(item);
                setRotating(false);
              }}
            >
              <span className="hotspot-cube">
                <item.Icon size={20} strokeWidth={1.4} />
              </span>
              <span className="hotspot-label">
                {item.id === "core" ? "Backend" : item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="lab-scene-hint mono">
          <MousePointer2 size={12} />
          <span>
            {failed
              ? "Mode ringan · tetap bisa dijelajahi"
              : !requested
                ? "Aktifkan 3D untuk menjelajahi"
                : !ready
                  ? "Menyiapkan ruang 3D…"
                  : scanning
                    ? "Memindai model…"
                    : "Gerakkan kursor untuk berinteraksi"}
          </span>
        </div>
      </div>

      <div className="lab-console">
        <div className="lab-mode-row">
          <div
            className="lab-modes"
            role="group"
            aria-label="Mode laboratorium"
          >
            {sceneModes.map((item) => (
              <button
                key={item.id}
                aria-pressed={mode.id === item.id}
                className={mode.id === item.id ? "selected" : ""}
                onClick={() => {
                  setMode(item);
                  setRotating(false);
                }}
              >
                <item.Icon size={13} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="lab-mode-copy" aria-live="polite">
          <h3>{mode.title}</h3>
          <p>{mode.description}</p>
          <span className="mono">{mode.stack}</span>
        </div>
        <div className="lab-controls">
          <div className="lab-zoom" role="group" aria-label="Zoom scene 3D">
            <button
              className="lab-icon-button"
              onClick={() => setZoom((value) => Math.max(75, value - 10))}
              disabled={!ready || zoom <= 75}
              aria-label="Perkecil model 3D"
            >
              <Minus size={14} />
            </button>
            <output className="mono" aria-label="Tingkat zoom">
              {zoom}%
            </output>
            <button
              className="lab-icon-button"
              onClick={() => setZoom((value) => Math.min(125, value + 10))}
              disabled={!ready || zoom >= 125}
              aria-label="Perbesar model 3D"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="lab-control-actions">
            <button
              className="lab-icon-button"
              aria-label="Putar robot 360 derajat"
              title="Rotasi 360°"
              aria-pressed={rotating}
              disabled={!ready || !canRotate || !enabled}
              onClick={() => setRotating((value) => !value)}
            >
              <Rotate3D size={16} />
            </button>
            <button
              className="lab-icon-button"
              aria-label="Pindai hologram"
              title="Pindai hologram"
              aria-pressed={scanning}
              onClick={scan}
            >
              <ScanLine size={16} />
            </button>
            <button
              className="lab-icon-button"
              aria-label="Reset tampilan 3D"
              title="Reset"
              onClick={reset}
            >
              <RotateCcw size={14} />
            </button>
            <span className="lab-control-divider" />
            <button
              className="lab-icon-button lab-play"
              onClick={failed ? retry : () => setEnabled((value) => !value)}
              aria-label={
                failed
                  ? "Coba muat ulang scene 3D"
                  : enabled
                    ? "Jeda animasi 3D"
                    : "Aktifkan animasi 3D"
              }
              title={
                failed
                  ? "Coba lagi"
                  : enabled
                    ? "Jeda semua animasi"
                    : "Aktifkan 3D"
              }
            >
              {failed ? (
                <RotateCcw size={14} />
              ) : enabled ? (
                <Pause size={14} />
              ) : (
                <Play size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
      {fullScreenError && (
        <p className="lab-fullscreen-error" role="status">
          {fullScreenError}
        </p>
      )}
    </div>
  );
}
