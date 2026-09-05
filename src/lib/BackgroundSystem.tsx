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
  colorType: "emerald" | "cyan" | "violet" | "amber";
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
    const colors = ["emerald", "cyan", "violet", "amber"] as const;

    const initNodes = () => {
      const count = Math.min(Math.floor((width * height) / 18000), 75);
      nodes = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2.2 + 1.2;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius,
          baseRadius: radius,
          alpha: Math.random() * 0.5 + 0.35,
          pulseSpeed: Math.random() * 0.025 + 0.012,
          pulsePhase: Math.random() * Math.PI * 2,
          colorType: colors[i % colors.length] ?? "emerald",
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

    const getColorRgb = (type: string, dark: boolean) => {
      switch (type) {
        case "emerald":
          return dark ? "52, 211, 153" : "16, 185, 129";
        case "cyan":
          return dark ? "56, 189, 248" : "14, 165, 233";
        case "violet":
          return dark ? "167, 139, 250" : "139, 92, 246";
        case "amber":
          return dark ? "251, 191, 36" : "245, 158, 11";
        default:
          return dark ? "52, 211, 153" : "16, 185, 129";
      }
    };

    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains("dark");
      const mouseCoreColor = dark ? "52, 211, 153" : "16, 185, 129";

      // 1. Draw connecting gradient lines between nodes
      const maxDist = 150;
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
            const alpha = (1 - dist / maxDist) * (dark ? 0.28 : 0.22);
            const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            const rgb1 = getColorRgb(n1.colorType, dark);
            const rgb2 = getColorRgb(n2.colorType, dark);
            grad.addColorStop(0, `rgba(${rgb1}, ${alpha})`);
            grad.addColorStop(1, `rgba(${rgb2}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect to mouse if close with vibrant glowing magnetic laser
        const mdx = n1.x - mouse.x;
        const mdy = n1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const mouseRadius = 220;

        if (mdist < mouseRadius) {
          const mAlpha = (1 - mdist / mouseRadius) * (dark ? 0.65 : 0.50);
          const mouseGrad = ctx.createLinearGradient(n1.x, n1.y, mouse.x, mouse.y);
          const nodeRgb = getColorRgb(n1.colorType, dark);
          mouseGrad.addColorStop(0, `rgba(${nodeRgb}, ${mAlpha})`);
          mouseGrad.addColorStop(1, `rgba(${mouseCoreColor}, ${mAlpha * 1.2})`);

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = mouseGrad;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Magnetic pull towards cursor
          n1.x += (mdx / mdist) * 0.35;
          n1.y += (mdy / mdist) * 0.35;
        }
      }

      // 2. Draw nodes with glowing gradient cores & orbital pulse rings
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n) continue;

        n.x += n.vx;
        n.y += n.vy;

        // Soft viewport bounce
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
        const pulse = Math.sin(n.pulsePhase) * 0.8;
        const currentRadius = Math.max(0.6, n.baseRadius + pulse);
        const colorRgb = getColorRgb(n.colorType, dark);

        // Radial glow on the node itself
        const nodeGlow = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          currentRadius * 2.5
        );
        nodeGlow.addColorStop(0, `rgba(${colorRgb}, ${n.alpha})`);
        nodeGlow.addColorStop(0.6, `rgba(${colorRgb}, ${n.alpha * 0.5})`);
        nodeGlow.addColorStop(1, `rgba(${colorRgb}, 0)`);

        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlow;
        ctx.fill();

        // Node center core
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb}, ${Math.min(1, n.alpha + 0.3)})`;
        ctx.fill();

        // Special orbital pulsating halo ring for anchor nodes
        if (i % 4 === 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentRadius * 3.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${colorRgb}, ${dark ? 0.22 : 0.16})`;
          ctx.lineWidth = 0.75;
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
      {/* 1. Base Archival Canvas Tint */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* 2. Rich Chromatic Mesh Gradient Aurora System (Brighter & Radiant) */}
      <div className="absolute inset-0 opacity-85 dark:opacity-75 transition-opacity duration-700 pointer-events-none">
        {/* Top-Right Emerald / Mint Luminous Radiant Aurora */}
        <div className="absolute -top-[15%] right-[2%] h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-emerald-500/26 via-teal-400/22 to-emerald-300/15 blur-[120px] animate-ambient-drift will-change-transform" />

        {/* Mid-Left Cambridge Royal Sapphire & Electric Cyan Aurora */}
        <div className="absolute top-[22%] -left-[10%] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-blue-600/26 via-sky-400/22 to-indigo-500/18 blur-[130px] animate-ambient-drift-reverse will-change-transform" />

        {/* Bottom-Center Warm Golden Amber & Coral Scholarly Glow */}
        <div className="absolute -bottom-[12%] left-[22%] h-[650px] w-[650px] rounded-full bg-gradient-to-tl from-amber-500/22 via-orange-400/18 to-yellow-300/14 blur-[120px] animate-pulse-subtle will-change-transform" />

        {/* Mid-Right Electric Violet & Fuchsia Atmospheric Accent */}
        <div className="absolute top-[55%] right-[8%] h-[550px] w-[550px] rounded-full bg-gradient-to-r from-purple-600/18 via-violet-500/15 to-pink-500/12 blur-[130px] animate-ambient-drift will-change-transform" />
      </div>

      {/* 3. Mathematical Coordinate Dot Matrix Grid Overlay */}
      <div className="absolute inset-0 bg-math-grid pointer-events-none opacity-90 dark:opacity-75" />

      {/* 4. Fine Technical Graph Lattice Overlay */}
      <div className="absolute inset-0 bg-graph-matrix pointer-events-none opacity-60 dark:opacity-50" />

      {/* 5. Dynamic HTML5 Interactive Gradient Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      {/* 6. Dual-Zone Dynamic Cursor Spotlight (Vibrant Core + Radiant Fringes) */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `
            radial-gradient(320px circle at var(--mouse-x) var(--mouse-y), rgba(var(--spotlight-color), 0.22), transparent 70%),
            radial-gradient(720px circle at var(--mouse-x) var(--mouse-y), rgba(14, 165, 233, 0.14), transparent 75%)
          `,
        }}
      />

      {/* 7. Viewport Edge Soft Vignette Mask */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* 8. Floating Academic LaTeX Formula Glyphs in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none font-serif opacity-[0.11] dark:opacity-[0.14] text-foreground">
        <div className="absolute top-[12%] left-[4%] text-2xl lg:text-3xl font-serif italic text-gradient-emerald">
          f(x) = \frac{`{1}`}{`{\\sqrt{2\\pi}\\sigma}`} e^{`{-\\frac{(x-\\mu)^2}{2\\sigma^2}}`}
        </div>
        <div className="absolute top-[35%] right-[5%] text-2xl lg:text-3xl font-serif italic text-gradient-sky">
          \lim_{`{n \\to \\infty}`} \mathbb{`{P}`}\left(\frac{`{S_n - n\\mu}`}{`{\\sigma\\sqrt{n}}`} \le z\right) = \Phi(z)
        </div>
        <div className="absolute top-[62%] left-[5%] text-xl lg:text-2xl font-serif italic text-gradient-amber">
          \mathcal{`{L}`}_{`{CE}`} = -\sum_{`{i=1}`}^C y_i \log(\hat{`{y}`}_i)
        </div>
        <div className="absolute bottom-[10%] right-[7%] text-2xl lg:text-3xl font-serif italic text-gradient-purple">
          \text{`{Var}`}(X) = \mathbb{`{E}`}[X^2] - (\mathbb{`{E}`}[X])^2
        </div>
        <div className="absolute bottom-[28%] left-[30%] text-xl lg:text-2xl font-serif italic text-gradient-emerald hidden lg:block">
          \theta_{`{t+1}`} = \theta_t - \eta \nabla_\theta \mathcal{`{L}`}(\theta)
        </div>
      </div>

      {/* 9. Geometric Academic Drafting Coordinates & Telemetry Crosshairs */}
      <div className="hidden md:block pointer-events-none select-none">
        {/* Top Left */}
        <div className="absolute top-5 left-7 font-mono text-[11px] tracking-wider text-muted-foreground/75 flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">+</span>
          <span>LAT 22.44° N / LON 88.39° E</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-card/75 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs">
            SYS::RKMRC
          </span>
        </div>

        {/* Top Right */}
        <div className="absolute top-5 right-7 font-mono text-[11px] tracking-wider text-muted-foreground/75 flex items-center gap-2">
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-sky-500/30 bg-card/75 text-sky-700 dark:text-sky-300 font-semibold shadow-xs">
            MATH::STAT_ML
          </span>
          <span>STOCHASTIC_LATTICE::24PX</span>
          <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">+</span>
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-5 left-7 font-mono text-[11px] tracking-wider text-muted-foreground/75 flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">+</span>
          <span>EST. RKMRC NDPR · CALCUTTA UNIV</span>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-5 right-7 font-mono text-[11px] tracking-wider text-muted-foreground/75 flex items-center gap-2">
          <span>SEC::AUTONOMOUS_DOSSIER</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">+</span>
        </div>
      </div>
    </div>
  );
}

export default BackgroundSystem;
