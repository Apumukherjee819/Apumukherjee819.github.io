import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";

interface ScrollState {
  progress: number;
  smoothProgress: number;
  direction: "up" | "down";
  velocity: number;
}

const ScrollContext = createContext<ScrollState>({
  progress: 0,
  smoothProgress: 0,
  direction: "down",
  velocity: 0,
});

export function useScrollProgress() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children, pathname }: { children: ReactNode; pathname?: string }) {
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    smoothProgress: 0,
    direction: "down",
    velocity: 0,
  });

  const targetProgress = useRef(0);
  const currentSmooth = useRef(0);

  // Reset scroll progress when navigating between pages
  useEffect(() => {
    targetProgress.current = 0;
    currentSmooth.current = 0;
    setState({
      progress: 0,
      smoothProgress: 0,
      direction: "down",
      velocity: 0,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastTime = Date.now();

    const onScroll = () => {
      if (typeof window === "undefined") return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const p = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      targetProgress.current = p;

      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);
      const rawVelocity = Math.abs(scrollY - lastScrollY) / dt;
      const velocity = Math.min(rawVelocity, 2.5);
      const direction = scrollY >= lastScrollY ? "down" : "up";

      lastScrollY = scrollY;
      lastTime = now;

      setState((prev) => ({
        ...prev,
        progress: p,
        direction,
        velocity,
      }));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Ultra-smooth low-pass damping filter
    let animId: number;
    const smoothLoop = () => {
      currentSmooth.current += (targetProgress.current - currentSmooth.current) * 0.014;
      setState((prev) => ({
        ...prev,
        smoothProgress: currentSmooth.current,
      }));
      animId = requestAnimationFrame(smoothLoop);
    };
    animId = requestAnimationFrame(smoothLoop);

    // Initial sync
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animId);
    };
  }, [pathname]);

  return <ScrollContext.Provider value={state}>{children}</ScrollContext.Provider>;
}
