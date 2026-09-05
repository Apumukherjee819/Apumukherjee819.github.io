import { useEffect, useRef, useState } from "react";

export function BackgroundSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      style={
        {
          "--mouse-x": "50vw",
          "--mouse-y": "30vh",
        } as React.CSSProperties
      }
    >
      {/* 1. Base Archival Canvas Tint */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* 2. Ambient Spectral Glowing Orbs (Atmospheric Aurora) */}
      <div className="absolute inset-0 opacity-60 dark:opacity-40 transition-opacity duration-700">
        {/* Top-Right Emerald / Academic Distinction Glow */}
        <div className="absolute -top-[10%] right-[10%] h-[550px] w-[550px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] animate-ambient-drift will-change-transform" />

        {/* Mid-Left Cambridge Navy / Analytical Glow */}
        <div className="absolute top-[35%] -left-[10%] h-[600px] w-[600px] rounded-full bg-sky-500/10 dark:bg-blue-600/12 blur-[140px] animate-ambient-drift-reverse will-change-transform" />

        {/* Bottom-Center Warm Gold / Classical Scholarly Glow */}
        <div className="absolute -bottom-[10%] left-[30%] h-[500px] w-[500px] rounded-full bg-amber-500/8 dark:bg-amber-500/10 blur-[130px] animate-pulse-subtle will-change-transform" />
      </div>

      {/* 3. Mathematical Coordinate & Dot Matrix Grid Layer */}
      <div className="absolute inset-0 bg-math-grid opacity-[0.45] dark:opacity-[0.35]" />

      {/* 4. Fine Technical Graph Lattice */}
      <div className="absolute inset-0 bg-graph-matrix opacity-[0.25] dark:opacity-[0.20]" />

      {/* 5. Dynamic Cursor Spotlight (Illuminates grid beneath mouse) */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x) var(--mouse-y), rgba(var(--spotlight-color), 0.08), transparent 80%)`,
        }}
      />

      {/* 6. Viewport Edge Vignette Mask (Keeps focus on central content) */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* 7. Geometric Academic Crosshairs / Drafting Coordinates */}
      <div className="hidden lg:block">
        {/* Top Left Crosshair */}
        <div className="absolute top-6 left-8 font-mono text-[10px] text-muted-foreground/30 flex items-center gap-1.5">
          <span className="text-xs">+</span>
          <span>LAT 22.44° N / LON 88.39° E</span>
        </div>

        {/* Top Right Crosshair */}
        <div className="absolute top-6 right-8 font-mono text-[10px] text-muted-foreground/30 flex items-center gap-1.5">
          <span>SYS::MATH_STAT</span>
          <span className="text-xs">+</span>
        </div>

        {/* Bottom Left Crosshair */}
        <div className="absolute bottom-6 left-8 font-mono text-[10px] text-muted-foreground/30 flex items-center gap-1.5">
          <span className="text-xs">+</span>
          <span>EST. RKMRC NDPR</span>
        </div>

        {/* Bottom Right Crosshair */}
        <div className="absolute bottom-6 right-8 font-mono text-[10px] text-muted-foreground/30 flex items-center gap-1.5">
          <span>SEC::PROVISIONAL</span>
          <span className="text-xs">+</span>
        </div>
      </div>
    </div>
  );
}

export default BackgroundSystem;
