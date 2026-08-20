"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type Particle = {
  x0: number; y0: number;
  dx: number; dy: number; // total displacement applied over the particle's life (eased)
  size: number;
  baseAlpha: number;
  born: number;
  life: number; // ms
};

const MAX_PARTICLES = 60;

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, now: number): boolean {
  const t = (now - p.born) / p.life;
  if (t >= 1) return false;
  const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
  const x = p.x0 + p.dx * eased;
  const y = p.y0 + p.dy * eased;
  const alpha = p.baseAlpha * (1 - t);
  const size = Math.max(0.4, p.size * (1 - t * 0.55));
  ctx.beginPath();
  ctx.shadowBlur = size * 3;
  ctx.shadowColor = `rgba(230,57,70,${(alpha * 0.7).toFixed(3)})`;
  ctx.fillStyle = `rgba(230,57,70,${alpha.toFixed(3)})`;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  return true;
}

/**
 * Custom cursor (DESIGN_SYSTEM.md §5): a solid glowing dot (DOM + CSS glow)
 * that tracks the pointer, trailing a short spark of tiny particles drawn on
 * a single canvas layer — no ring, no hover morph, no expanding click ring.
 * Particle state lives in plain refs (never React state) so pointer moves
 * never trigger a re-render; the canvas is fully pointer-events:none, so it
 * can never intercept clicks/drags (including the 3D kiosk). Disabled on
 * touch (pointer: coarse) and reduced-motion, where the native cursor is
 * left untouched.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (prefersReducedMotion()) return;

    const dot = dotRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    document.body.classList.add("has-custom-cursor");
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    const particles: Particle[] = [];
    const lastSpawn = { x: -1, y: -1 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x: number, y: number, opts: Omit<Particle, "x0" | "y0" | "born">) => {
      particles.push({ x0: x, y0: y, born: performance.now(), ...opts });
      if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
    };

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.to(dot, { opacity: 1, duration: 0.25 });
      }
      dotX(e.clientX);
      dotY(e.clientY);

      if (lastSpawn.x < 0) { lastSpawn.x = e.clientX; lastSpawn.y = e.clientY; return; }
      const dxm = e.clientX - lastSpawn.x;
      const dym = e.clientY - lastSpawn.y;
      const dist = Math.hypot(dxm, dym);
      // Short, elegant trail: only spawn once the pointer has actually moved a bit, and
      // scale count gently with speed (denser on fast moves, capped so it stays a trail
      // and not a comet tail).
      if (dist > 6) {
        const count = Math.min(3, Math.max(1, Math.round(dist / 14)));
        for (let i = 0; i < count; i++) {
          spawn(e.clientX + (Math.random() - 0.5) * 4, e.clientY + (Math.random() - 0.5) * 4, {
            dx: dxm * 0.08,
            dy: dym * 0.08,
            size: 1 + Math.random() * 3,
            baseAlpha: 0.4 + Math.random() * 0.4,
            life: 300 + Math.random() * 150,
          });
        }
        lastSpawn.x = e.clientX;
        lastSpawn.y = e.clientY;
      }
    };

    const onDown = (e: MouseEvent) => {
      const count = 5 + Math.floor(Math.random() * 4); // 5–8
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 10 + Math.random() * 15;
        spawn(e.clientX, e.clientY, {
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 1.5 + Math.random() * 2,
          baseAlpha: 0.6 + Math.random() * 0.3,
          life: 250 + Math.random() * 150,
        });
      }
    };

    let rafId = 0;
    const loop = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        if (!drawParticle(ctx, particles[i], now)) particles.splice(i, 1);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // Magnetic pull for [data-magnetic] elements — a button hover animation,
    // unrelated to the cursor itself. Left untouched.
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const magnetCleanups = magnets.map((el) => {
      const strength = Number(el.dataset.magnetic) || 0.35;
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.4, ease: "power3.out" });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
    });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      magnetCleanups.forEach((c) => c());
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-spark-canvas" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
