import { useEffect, useRef } from "react";
import { useFinePointer } from "../hooks/useFinePointer";
import { useMotion } from "../hooks/useMotionTier";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/** Edges are drawn between nodes closer than this (CSS px). */
const LINK_DISTANCE = 132;
const NODE_COUNT_DESKTOP = 45;
const NODE_COUNT_MOBILE = 18;
const SPEED = 0.055;

/**
 * Ambient page backdrop: a drifting node/edge network echoing the site's
 * data-pipeline theme, slow aurora orbs, and a cursor-tracking spotlight.
 *
 * Entirely decorative: `aria-hidden` and non-interactive. The canvas only
 * runs at the `full` motion tier, so phones, low-power touch devices and
 * reduced-motion visitors never pay for the node network or the aurora drift at
 * all. The rAF loop is also suspended whenever the tab is hidden.
 */
export function AmbientBackground() {
  const { ambient } = useMotion();
  const fine = useFinePointer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // --- node network -------------------------------------------------------
  useEffect(() => {
    if (!ambient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf: number | null = null;

    function seed() {
      const count = width < 768 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        r: Math.random() * 1.4 + 0.7,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // wrap around the edges so the field never thins out
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;

          const strength = 1 - dist / LINK_DISTANCE;
          ctx!.strokeStyle = `rgba(34, 211, 238, ${(strength * 0.16).toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      for (const node of nodes) {
        ctx!.fillStyle = "rgba(139, 92, 246, 0.42)";
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (raf === null) raf = requestAnimationFrame(draw);
    }
    function stop() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    resize();
    start();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ambient]);

  // --- cursor spotlight ---------------------------------------------------
  useEffect(() => {
    if (!ambient || !fine) return;

    const el = spotlightRef.current;
    if (!el) return;

    let frame: number | null = null;
    let pending: { x: number; y: number } | null = null;

    function onMove(event: PointerEvent) {
      pending = { x: event.clientX, y: event.clientY };
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (!pending || !el) return;
        el.style.setProperty("--mx", `${pending.x}px`);
        el.style.setProperty("--my", `${pending.y}px`);
        el.style.opacity = "1";
      });
    }

    function onLeave() {
      if (el) el.style.opacity = "0";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [ambient, fine]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* base grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* aurora orbs */}
      <div
        className={`absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-[110px] ${
          ambient ? "animate-aurora-a" : ""
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-accent-violet/10 blur-[120px] ${
          ambient ? "animate-aurora-b" : ""
        }`}
      />
      <div
        className={`absolute -bottom-48 left-1/4 h-[32rem] w-[32rem] rounded-full bg-accent-blue/10 blur-[120px] ${
          ambient ? "animate-aurora-c" : ""
        }`}
      />

      {/* node network */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* cursor spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(34,211,238,0.07), transparent 70%)",
        }}
      />

      {/* vignette keeps text legible over the whole field */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent_35%,rgba(8,9,10,0.72)_100%)]" />
    </div>
  );
}
