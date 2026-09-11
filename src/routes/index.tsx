import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Code2,
  ExternalLink,
  Mail,
  Send,
  GraduationCap,
  Award,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Sparkles,
  Activity,
  Layers,
  Binary
} from "lucide-react";
import { about, pages, site } from "../data/portfolio";
import { AnimatedSection, StaggerContainer } from "../lib/PageTransition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Academic Dossier & Research Overview" },
      {
        name: "description",
        content:
          "Arpan Mukherjee — B.Sc. Statistics & Computer Science, Ramakrishna Mission Residential College Narendrapur. Machine learning research, mathematical statistics, and competitive programming.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Academic Dossier & Research Overview" },
      {
        property: "og:description",
        content:
          "Arpan Mukherjee — B.Sc. Statistics & Computer Science, Ramakrishna Mission Residential College Narendrapur. Machine learning research, mathematical statistics, and competitive programming.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="academic-section-heading mt-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      {children}
    </h2>
  );
}

function Rule() {
  return <div className="academic-rule" />;
}

// =========================================================================
// Seamless 3D Holographic Typewriter Banner (Starts directly with page writings!)
// =========================================================================
function HeroTypewriter3D() {
  const fullText = "This is My portfolio, accounting my dump thoughts";
  // Start with full text so SSR and first paint show it immediately
  const [displayedText, setDisplayedText] = useState(fullText);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Typewriter effect: after a brief pause, clear and re-type for the animation
  useEffect(() => {
    let index = 0;
    let timer: any;
    let cancelled = false;

    const typeNextChar = () => {
      if (cancelled) return;
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        const char = fullText[index];
        index++;
        const delay = char === "," ? 280 : char === " " ? 75 : 38;
        timer = setTimeout(typeNextChar, delay);
      }
    };

    // Brief pause showing full text, then clear and re-type
    timer = setTimeout(() => {
      if (cancelled) return;
      index = 0;
      setDisplayedText("");
      typeNextChar();
    }, 1200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Real-time 3D Perspective Mouse Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotY = (x / (rect.width / 2)) * 6; // max 6 deg
    const rotX = -(y / (rect.height / 2)) * 6; // max 6 deg
    setTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full"
      style={{ perspective: "1200px" }}
    >
      <div
        className="hero-3d-card hud-corner-brackets w-full p-4 sm:p-6 md:p-8 rounded-xl relative overflow-hidden"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5 mb-4 font-mono text-[10px] sm:text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-cyber-cyan font-bold uppercase tracking-wider">
            <Activity size={13} className="text-cyber-cyan animate-pulse" />
            [SYS_STREAM: ACTIVE]
          </span>
          <span className="hidden sm:inline text-muted-foreground/80 font-mono text-[11px]">
            RKMRC NARENDRAPUR // STATISTICAL COMPUTING
          </span>
          <span className="scifi-hud-badge py-0.5 px-2 text-[10px]">
            <span className="scifi-pulse-dot" />
            QUANTUM DOSSIER v4.2
          </span>
        </div>

        {/* 3D Holographic Typewriter Heading */}
        <div className="py-2 sm:py-4">
          <h1 className="scifi-3d-huge-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.18] tracking-tight">
            <span>{displayedText}</span>
            <span className="typewriter-cursor text-cyber-cyan">▋</span>
          </h1>
        </div>

        {/* Subtitle & Telemetry Metrics */}
        <div className="mt-3 pt-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-cyber-emerald" />
            <span className="text-foreground font-semibold">Arpan Mukherjee</span>
            <span className="text-muted-foreground">• Statistics & Computer Science</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyber-cyan text-[11px]">
            <Binary size={13} />
            <span>3D MATHEMATICAL MANIFOLDS ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// Get In Touch Contact Section (Academic / Cybernetic Design)
// =========================================================================
function GetInTouchSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const subject = encodeURIComponent(`Academic Inquiry from ${formData.name || "Colleague"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${site.emailPrimary}?subject=${subject}&body=${body}`;
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <section id="contact" className="mt-16 border-t border-border/60 pt-10 space-y-6">
      {/* 1. Academic Heading */}
      <div className="space-y-1">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <h2 className="font-serif text-2xl font-bold tracking-widest text-foreground uppercase sm:text-3xl">
            GET IN TOUCH
          </h2>
          <span className="font-mono text-[10px] text-cyber-cyan tracking-wider">[COMM.CHANNEL]</span>
        </div>
        <p className="font-serif text-sm italic text-muted-foreground pt-1">
          Reach out directly, or send a message through the form below.
        </p>
      </div>

      {/* 2. Direct Contact Strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-serif text-sm text-foreground">
        <a
          href={`mailto:${site.emailPrimary}`}
          className="transition-colors hover:text-cyber-cyan hover:underline"
        >
          {site.emailPrimary}
        </a>
        <a
          href={`mailto:${site.emailSecondary}`}
          className="transition-colors hover:text-cyber-cyan hover:underline"
        >
          {site.emailSecondary}
        </a>
        <a
          href="tel:+917439766325"
          className="transition-colors hover:text-cyber-cyan hover:underline"
        >
          +91-7439766325
        </a>
      </div>

      {/* 3. Form */}
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="contact-name"
              className="block font-serif text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              NAME
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-border/80 bg-card/60 px-3.5 py-2.5 font-sans text-sm text-foreground transition-all duration-200 focus:border-cyber-cyan focus:bg-card/90 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="block font-serif text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              EMAIL
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-border/80 bg-card/60 px-3.5 py-2.5 font-sans text-sm text-foreground transition-all duration-200 focus:border-cyber-cyan focus:bg-card/90 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-message"
            className="block font-serif text-xs font-semibold tracking-wider text-muted-foreground uppercase"
          >
            MESSAGE
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-md border border-border/80 bg-card/60 px-3.5 py-2.5 font-sans text-sm text-foreground transition-all duration-200 focus:border-cyber-cyan focus:bg-card/90 focus:outline-none focus:ring-1 focus:ring-cyber-cyan resize-y"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card/90 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-cyber-cyan hover:bg-accent hover:text-cyber-cyan cursor-pointer"
          >
            <Send size={14} className="text-cyber-cyan" />
            <span>Send Message</span>
          </button>
          {status === "sent" && (
            <span className="font-mono text-xs font-semibold text-cyber-emerald animate-in fade-in duration-200">
              ✓ Message dispatched to email client!
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="space-y-8 perspective-container">
      {/* 1. 3D Holographic Typewriter Banner (Directly at the start of writings) */}
      <AnimatedSection animation="hologramPop">
        <HeroTypewriter3D />
      </AnimatedSection>

      {/* 2. Header Profile / Academic Identity */}
      <AnimatedSection animation="cyberSlideLeft">
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Arpan Mukherjee
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                B.Sc. in Statistics (Major) • Computer Science (Minor)
              </p>
            </div>
            <span className="scifi-hud-badge">
              <span className="scifi-pulse-dot" />
              STATUS: ACTIVE AY 2025–2029
            </span>
          </div>
          <p className="font-serif text-sm italic text-muted-foreground flex items-center gap-1.5">
            <Terminal size={14} className="text-cyber-cyan" />
            Ramakrishna Mission Residential College (Autonomous), Narendrapur • University of Calcutta
          </p>
          <Rule />

          {/* Narrative Biography */}
          <div className="space-y-4 font-serif text-base leading-relaxed text-foreground sm:text-lg">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* 3. Institutional Affiliations & Core Summary Grid */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-3">
        <div data-stagger-child className="academic-card space-y-2 group card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-emerald)" }}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <GraduationCap size={15} className="text-cyber-emerald" />
              Undergraduate
            </span>
            <span className="font-mono text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">[SYS.01]</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground">9.46 Cumulative CPI</p>
          <p className="mt-1 font-serif text-xs text-muted-foreground">
            Major: 9.45 (Current) • Minor (CS): 9.50 (Current)
          </p>
          <Link
            to="/education"
            className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-medium text-cyber-emerald hover:underline"
          >
            View Provisional Grade Card →
          </Link>
        </div>

        <div data-stagger-child className="academic-card space-y-2 group card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-cyan)" }}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-cyber-cyan" />
              Research Labs
            </span>
            <span className="font-mono text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">[SYS.02]</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground">IIT Delhi & ISI Kolkata</p>
          <p className="mt-1 font-serif text-xs text-muted-foreground">
            BUILD BANK 2026 (ARTHASETU 2.0) • IDEAS TIH (PSO Disaster Model)
          </p>
          <Link
            to="/projects"
            className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-medium text-cyber-cyan hover:underline"
          >
            Read Research Case Studies →
          </Link>
        </div>

        <div data-stagger-child className="academic-card space-y-2 group card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-amber)" }}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <Award size={15} className="text-cyber-amber" />
              Competitive CP
            </span>
            <span className="font-mono text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">[SYS.03]</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground">300+ Problems Solved</p>
          <p className="mt-1 font-serif text-xs text-muted-foreground">
            LeetCode 50-Day Badge • Codeforces & DataLemur Benchmarks
          </p>
          <Link
            to="/codeforces"
            className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-medium text-cyber-amber hover:underline"
          >
            Inspect Algorithmic Analytics →
          </Link>
        </div>
      </StaggerContainer>

      {/* 4. Quick Navigation Matrix */}
      <AnimatedSection animation="cyberSlideRight">
        <section className="space-y-4">
          <SectionHeading>Dossier Index & Records</SectionHeading>
          <Rule />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pages
              .filter((p) => p.path !== "/")
              .map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="academic-card group flex flex-col justify-between space-y-2 p-4 card-3d transition-all hover:border-cyber-cyan/60"
                  style={{ borderLeftWidth: "3px" }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        [{page.path.replace("/", "").toUpperCase()}]
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-cyber-cyan"
                      />
                    </div>
                    <p className="mt-2 font-display text-base font-bold text-foreground">
                      {page.label}
                    </p>
                    <p className="mt-1 font-serif text-xs text-muted-foreground line-clamp-2">
                      {page.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </AnimatedSection>

      {/* 5. Get In Touch Contact Section */}
      <GetInTouchSection />
    </div>
  );
}
