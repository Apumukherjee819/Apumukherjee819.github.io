import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  color: string;
}

interface DataPacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface ClickWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function BackgroundSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseMove = Date.now();

    const particles: Particle[] = [];
    const packets: DataPacket[] = [];
    const waves: ClickWave[] = [];

    const colors = ["#00f0ff", "#00ff9d", "#38bdf8", "#c084fc"];

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 65;
    const connectionDist = isMobile ? 100 : 140;

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseRadius: Math.random() * 1.5 + 1.0,
        radius: 1.5,
        alpha: Math.random() * 0.4 + 0.25,
        color,
      });
    }

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseMove = Date.now();
    };

    const onClick = (e: MouseEvent) => {
      waves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        alpha: 0.6,
      });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    let frameId: number;
    let scanLineY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Ultra-slow serene cyan laser scanline (16s vertical sweep)
      scanLineY = (scanLineY + 0.4) % (height + 200);
      const grad = ctx.createLinearGradient(0, scanLineY - 80, 0, scanLineY);
      grad.addColorStop(0, "rgba(0, 240, 255, 0)");
      grad.addColorStop(0.9, "rgba(0, 240, 255, 0.025)");
      grad.addColorStop(1, "rgba(0, 240, 255, 0.05)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanLineY - 80, width, 80);

      // 2. Click Sonar Waves
      for (let w = waves.length - 1; w >= 0; w--) {
        const wave = waves[w];
        wave.radius += 1.8;
        wave.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 255, 157, " + wave.alpha + ")";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (wave.alpha < 0.02 || wave.radius >= wave.maxRadius) {
          waves.splice(w, 1);
        }
      }

      // 3. Update & Draw Particles
      const isMouseActive = Date.now() - lastMouseMove < 3000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (isMouseActive) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.2;
            p.y -= (dy / dist) * force * 1.2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 4. Particle Connections & Data Packets
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(0, 240, 255, " + alpha + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Spawn occasional data packets
            if (packets.length < 8 && Math.random() < 0.0008) {
              packets.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: Math.random() * 0.012 + 0.008,
                color: colors[Math.floor(Math.random() * colors.length)],
              });
            }
          }
        }
      }

      // 5. Draw Traveling Data Packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const packet = packets[k];
        packet.progress += packet.speed;

        const p1 = particles[packet.fromIndex];
        const p2 = particles[packet.toIndex];

        if (!p1 || !p2 || packet.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const curX = p1.x + (p2.x - p1.x) * packet.progress;
        const curY = p1.y + (p2.y - p1.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
