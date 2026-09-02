import { createFileRoute } from "@tanstack/react-router";
import { Github, FileText, ExternalLink, Activity, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import { projects } from "../data/portfolio";

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
    <div className="space-y-12">
      {/* Page Heading */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {projects.title} & Systems
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Machine Learning · Cryptography · PSO
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          Comprehensive research case studies, mathematical formulations, and engineering implementations developed across national competitive benchmarks and research institutes.
        </p>
      </section>

      {/* Projects List */}
      <div className="space-y-10">
        {projects.items.map((project, idx) => (
          <article
            key={project.number}
            className="academic-card space-y-6"
            style={{
              borderLeftColor:
                idx === 0 ? "hsl(142, 65%, 32%)" : "hsl(215, 60%, 35%)",
            }}
          >
            {/* Header / Institutional Affiliation */}
            <div className="space-y-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    № 0{project.number}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-foreground sm:text-2xl">
                    {project.title}
                  </h2>
                </div>
                <span className="inline-flex self-start rounded border border-border bg-card px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground sm:self-auto">
                  {project.period}
                </span>
              </div>
              <p className="font-serif text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {project.association}
              </p>
            </div>

            {/* Technical Keywords / Taxonomy Tags */}
            <div className="flex flex-wrap gap-1.5 border-y border-border/50 py-2.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Narrative Abstract & Methodology */}
            <div className="space-y-3.5 font-serif text-base leading-relaxed text-foreground">
              {project.paragraphs.map((para, i) => (
                <p key={i}>{renderRichText(para)}</p>
              ))}
            </div>

            {/* Research & Technical Highlights */}
            <div className="rounded border border-border/70 bg-background/50 p-4 space-y-2.5">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Methodological & Architectural Highlights
              </h3>
              <ul className="space-y-2 font-serif text-sm text-foreground">
                {project.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{renderRichText(highlight)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification & Code Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent"
                >
                  {link.url.includes("github.com") ? (
                    <Github size={14} />
                  ) : (
                    <FileText size={14} />
                  )}
                  <span>{link.label}</span>
                  <span className="text-muted-foreground text-[10px]">↗</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

