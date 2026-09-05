import { useEffect, useRef, useState } from "react";

interface MathNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function BackgroundSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    const checkDark = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.dataset["theme"] === "dark";
      setIsDark(dark);
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      isHovering: false,
    };

    let nodes: MathNode[] = [];
    const initNodes = () => {
      const count = Math.min(Math.floor((width * height) / 22000), 65);
      nodes = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2 + 1.2;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius,
          baseRadius: radius,
          alpha: Math.random() * 0.45 + 0.25,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;
      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        containerRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    initNodes();

    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains("dark");
      const nodeColor = dark ? "52, 211, 153" : "16, 185, 129"; // Emerald
      const nodeAltColor = dark ? "96, 165, 250" : "14, 116, 144"; // Cyan/Blue
      const lineColor = dark ? "255, 255, 255" : "15, 23, 42";

      // 1. Draw connecting lines between nodes
      const maxDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (!n1) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          if (!n2) continue;

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (dark ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        const mdx = n1.x - mouse.x;
        const mdy = n1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const mouseRadius = 180;

        if (mdist < mouseRadius) {
          const mAlpha = (1 - mdist / mouseRadius) * (dark ? 0.45 : 0.35);
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${nodeColor}, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Push nodes slightly on hover for dynamic fluid feel
          n1.x += (mdx / mdist) * 0.3;
          n1.y += (mdy / mdist) * 0.3;
        }
      }

      // 2. Draw nodes & orbital rings
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n) continue;

        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges with soft padding
        if (n.x < 10) {
          n.x = 10;
          n.vx *= -1;
        } else if (n.x > width - 10) {
          n.x = width - 10;
          n.vx *= -1;
        }
        if (n.y < 10) {
          n.y = 10;
          n.vy *= -1;
        } else if (n.y > height - 10) {
          n.y = height - 10;
          n.vy *= -1;
        }

        n.pulsePhase += n.pulseSpeed;
        const pulse = Math.sin(n.pulsePhase) * 0.6;
        const currentRadius = Math.max(0.5, n.baseRadius + pulse);

        const isAlt = i % 3 === 0;
        const color = isAlt ? nodeAltColor : nodeColor;

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${n.alpha})`;
        ctx.fill();

        // Subtle outer pulse halo for selected mathematical anchor nodes
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentRadius * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color}, ${dark ? 0.12 : 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={
        {
          "--mouse-x": "50vw",
          "--mouse-y": "30vh",
        } as React.CSSProperties
      }
    >
      {/* 1. Base Archival Background Layer */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* 2. Atmospheric Aurora Ambient Glow Orbs */}
      <div className="absolute inset-0 opacity-70 dark:opacity-55 transition-opacity duration-700 pointer-events-none">
        {/* Top-Right Emerald / Academic Distinction Luminous Aura */}
        <div className="absolute -top-[12%] right-[5%] h-[600px] w-[600px] rounded-full bg-emerald-500/18 dark:bg-emerald-500/22 blur-[130px] animate-ambient-drift will-change-transform" />

        {/* Mid-Left Analytical Sapphire & Cambridge Blue Aura */}
        <div className="absolute top-[28%] -left-[8%] h-[650px] w-[650px] rounded-full bg-sky-500/18 dark:bg-blue-600/20 blur-[140px] animate-ambient-drift-reverse will-change-transform" />

        {/* Bottom-Center Warm Gold / Classical Scholarly Aura */}
        <div className="absolute -bottom-[12%] left-[25%] h-[550px] w-[550px] rounded-full bg-amber-500/14 dark:bg-amber-500/15 blur-[130px] animate-pulse-subtle will-change-transform" />
      </div>

      {/* 3. Mathematical Coordinate & Dot Matrix Grid Layer */}
      <div className="absolute inset-0 bg-math-grid pointer-events-none opacity-80 dark:opacity-60" />

      {/* 4. Fine Technical Graph Lattice Overlay */}
      <div className="absolute inset-0 bg-graph-matrix pointer-events-none opacity-50 dark:opacity-40" />

      {/* 5. Dynamic HTML5 Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      {/* 6. Dynamic Cursor Spotlight (Follows mouse cursor) */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(550px circle at var(--mouse-x) var(--mouse-y), rgba(var(--spotlight-color), 0.14), transparent 75%)`,
        }}
      />

      {/* 7. Viewport Edge Vignette Mask */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* 8. Floating Academic LaTeX Formula Glyphs in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none font-serif opacity-[0.06] dark:opacity-[0.08] text-foreground">
        <div className="absolute top-[14%] left-[4%] text-2xl lg:text-3xl font-serif italic">
          f(x) = \frac{`{1}`}{`{\\sqrt{2\\pi}\\sigma}`} e^{`{-\\frac{(x-\\mu)^2}{2\\sigma^2}}`}
        </div>
        <div className="absolute top-[38%] right-[5%] text-2xl lg:text-3xl font-serif italic">
          \lim_{`{n \\to \\infty}`} \mathbb{`{P}`}\left(\frac{`{S_n - n\\mu}`}{`{\\sigma\\sqrt{n}}`} \le z\right) = \Phi(z)
        </div>
        <div className="absolute top-[65%] left-[6%] text-xl lg:text-2xl font-serif italic">
          \mathcal{`{L}`}_{`{CE}`} = -\sum_{`{i=1}`}^C y_i \log(\hat{`{y}`}_i)
        </div>
        <div className="absolute bottom-[10%] right-[8%] text-2xl lg:text-3xl font-serif italic">
          \text{`{Var}`}(X) = \mathbb{`{E}`}[X^2] - (\mathbb{`{E}`}[X])^2
        </div>
      </div>

      {/* 9. Geometric Academic Drafting Coordinates & Telemetry Crosshairs */}
      <div className="hidden md:block pointer-events-none select-none">
        {/* Top Left */}
        <div className="absolute top-5 left-7 font-mono text-[11px] tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>
          <span>LAT 22.44° N / LON 88.39° E</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border/80 bg-card/60">SYS::RKMRC</span>
        </div>

        {/* Top Right */}
        <div className="absolute top-5 right-7 font-mono text-[11px] tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border/80 bg-card/60">MATH::STAT_ML</span>
          <span>STOCHASTIC_GRID::24PX</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-5 left-7 font-mono text-[11px] tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>
          <span>EST. RKMRC NDPR · CALCUTTA UNIV</span>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-5 right-7 font-mono text-[11px] tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <span>SEC::AUTONOMOUS_DOSSIER</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>
        </div>
      </div>
    </div>
  );
}

export default BackgroundSystem;
