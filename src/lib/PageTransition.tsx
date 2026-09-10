import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type SciFiAnimationType =
  | "cyberSlideLeft"
  | "cyberSlideRight"
  | "hologramPop"
  | "fadeUp"
  | "fadeIn"
  | "scaleIn"
  | "slideLeft"
  | "slideRight";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: SciFiAnimationType;
  delay?: number;
}

export function AnimatedSection({
  children,
  className = "",
  animation = "cyberSlideLeft",
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromMap: Record<SciFiAnimationType, gsap.TweenVars> = {
      cyberSlideLeft: {
        opacity: 0,
        x: -40,
        z: -20,
        rotateY: 4,
        scale: 0.98,
      },
      cyberSlideRight: {
        opacity: 0,
        x: 40,
        z: -20,
        rotateY: -4,
        scale: 0.98,
      },
      hologramPop: {
        opacity: 0,
        scale: 0.94,
        z: -30,
      },
      fadeUp: {
        opacity: 0,
        y: 30,
      },
      fadeIn: {
        opacity: 0,
      },
      scaleIn: {
        opacity: 0,
        scale: 0.95,
      },
      slideLeft: {
        opacity: 0,
        x: -35,
      },
      slideRight: {
        opacity: 0,
        x: 35,
      },
    };

    const toMap: Record<SciFiAnimationType, gsap.TweenVars> = {
      cyberSlideLeft: {
        opacity: 1,
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      },
      cyberSlideRight: {
        opacity: 1,
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      },
      hologramPop: {
        opacity: 1,
        scale: 1,
        z: 0,
        duration: 0.95,
        ease: "power2.out",
      },
      fadeUp: {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
      },
      fadeIn: {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      scaleIn: {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: "power2.out",
      },
      slideLeft: {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power2.out",
      },
      slideRight: {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power2.out",
      },
    };

    const from = fromMap[animation] ?? fromMap.cyberSlideLeft;
    const to = toMap[animation] ?? toMap.cyberSlideLeft;

    gsap.set(el, {
      ...from,
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    // Check if already in viewport on page load -> reveal immediately!
    const rect = el.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;

    if (isInView) {
      gsap.to(el, {
        ...to,
        delay,
      });
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      onEnter: () =>
        gsap.to(el, {
          ...to,
          delay,
        }),
    });

    return () => {
      trigger.kill();
    };
  }, [animation, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-stagger-child]");
    if (!items.length) return;

    gsap.set(items, {
      opacity: 0,
      y: 20,
      scale: 0.98,
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    const rect = el.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;

    if (isInView) {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: staggerDelay,
        ease: "power2.out",
      });
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: staggerDelay,
          ease: "power2.out",
        }),
    });

    return () => {
      trigger.kill();
    };
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
