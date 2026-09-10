import { createFileRoute } from "@tanstack/react-router";
import { Github, ExternalLink, Activity, ShieldAlert, Cpu, Sparkles, Terminal, Layers } from "lucide-react";
import { projects } from "../data/portfolio";
import { AnimatedSection } from "../lib/PageTransition";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Research Projects & Engineering Case Studies" },
      {
        name: "description",
        content:
          "Machine learning research, statistical modeling, and algorithmic systems engineering by Arpan Mukherjee (BUILD BANK 2026 IIT Delhi & IDEAS TIH ISI Kolkata).",
      },
      { property: "og:title", content: "Arpan Mukherjee — Research Projects & Engineering Case Studies" },
      {
        property: "og:description",
        content:
          "Machine learning research, statistical modeling, and algorithmic systems engineering by Arpan Mukherjee (BUILD BANK 2026 IIT Delhi & IDEAS TIH ISI Kolkata).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function renderRichText(text: string) {
  const parts: (string | React.JSX.Element)[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <em key={match.index} className="italic text-muted-foreground">
          {match[3]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function ProjectsPage() {
  return (
    <div className="space-y-12 perspective-container">
      {/* Page Heading */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              {projects.title} & Systems
            </h1>
            <div className="flex items-center gap-2">
              <span className="scifi-hud-badge">
                <span className="scifi-pulse-dot" />
                ML // PQC // PSO
              </span>
            </div>
          </div>
          <div className="academic-rule" />
          <p className="font-serif text-base text-foreground leading-relaxed">
            Comprehensive research case studies, mathematical formulations, and engineering implementations developed across national competitive benchmarks and research institutes.
          </p>
        </section>
      </AnimatedSection>

      {/* Alternating Sci-Fi Projects Showcase */}
      <div className="space-y-12">
        {projects.items.map((project, idx) => (
          <AnimatedSection
            key={project.number}
            animation={idx % 2 === 0 ? "cyberSlideLeft" : "cyberSlideRight"}
            delay={idx * 0.12}
          >
            <article
              className="academic-card space-y-6 card-3d hud-corner-brackets"
              style={{
                borderLeftColor:
                  idx === 0
                    ? "var(--cyber-emerald)"
                    : idx === 1
                    ? "var(--cyber-cyan)"
                    : "var(--cyber-violet)",
              }}
            >
              {/* Header / Institutional Affiliation */}
              <div className="space-y-1.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-cyber-cyan dark:text-cyan-400">
                      [SYS.REC // 0{project.number}]
                    </span>
                    <h2 className="font-display text-2xl font-bold text-foreground sm:text-2xl">
                      {project.title}
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.period}
                  </span>
                </div>
                <p className="font-serif text-sm font-medium italic text-muted-foreground flex items-center gap-2">
                  <Terminal size={14} className="text-cyber-emerald" />
                  {project.association}
                </p>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-sm border border-border/80 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:border-cyber-cyan/50 hover:bg-secondary"
                  >
                    <span className="h-1 w-1 rounded-full bg-cyber-cyan" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Research Methodology Paragraphs */}
              <div className="space-y-4 font-serif text-base leading-relaxed text-foreground">
                {project.paragraphs.map((para, pIdx) => (
                  <p key={pIdx}>{renderRichText(para)}</p>
                ))}
              </div>

              {/* Core Mathematical & System Highlights */}
              <div className="rounded-md border border-border/70 bg-background/50 p-4 backdrop-blur-md">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-foreground">
                  <Activity size={15} className="text-cyber-emerald" />
                  Mathematical & Computational Highlights
                </h3>
                <ul className="mt-3 space-y-2">
                  {project.highlights.map((highlight, hIdx) => (
                    <li
                      key={hIdx}
                      className="flex items-start gap-2.5 font-serif text-sm text-foreground/90"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyber-emerald shadow-xs" />
                      <span>{renderRichText(highlight)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* External Repositories / Artifacts */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {project.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:border-cyber-cyan hover:bg-accent hover:shadow-xs"
                    >
                      <Github size={14} className="text-cyber-cyan" />
                      {link.label}
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
