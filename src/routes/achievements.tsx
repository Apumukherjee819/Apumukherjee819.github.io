import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, ExternalLink, FileCheck, Trophy, Sparkles, Terminal } from "lucide-react";
import { achievements } from "../data/portfolio";
import { AnimatedSection } from "../lib/PageTransition";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Honors & Competitive Accolades" },
      {
        name: "description",
        content:
          "Competitive benchmarks, hackathons, research internships, and algorithmic problem-solving milestones achieved by Arpan Mukherjee.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Honors & Competitive Accolades" },
      {
        property: "og:description",
        content:
          "Competitive benchmarks, hackathons, research internships, and algorithmic problem-solving milestones achieved by Arpan Mukherjee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  return (
    <div className="space-y-12 perspective-container">
      {/* Page Title */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              {achievements.title} & Honors
            </h1>
            <span className="scifi-hud-badge">
              <span className="scifi-pulse-dot" />
              VERIFIED MILESTONES
            </span>
          </div>
          <div className="academic-rule" />
          <p className="font-serif text-base text-foreground leading-relaxed">
            {achievements.description}
          </p>
        </section>
      </AnimatedSection>

      {/* Alternating Sci-Fi Achievements Showcase */}
      <div className="space-y-8">
        {achievements.items.map((item, idx) => (
          <AnimatedSection
            key={item.number}
            animation={idx % 2 === 0 ? "cyberSlideLeft" : "cyberSlideRight"}
            delay={idx * 0.1}
          >
            <div
              className="academic-card space-y-4 card-3d hud-corner-brackets"
              style={{
                borderLeftColor:
                  idx === 0
                    ? "var(--cyber-emerald)"
                    : idx === 1
                    ? "var(--cyber-cyan)"
                    : idx === 2
                    ? "var(--cyber-amber)"
                    : "var(--cyber-violet)",
              }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyber-cyan">
                    [HONOR // 0{item.number}]
                  </span>
                  <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    {item.title}
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.date}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-sm border border-border/80 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-cyber-emerald" />
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-serif text-base leading-relaxed text-foreground">
                {item.description}
              </p>

              {/* Verification Links */}
              {item.verifyUrl && (
                <div className="pt-2">
                  {item.verifyUrl.startsWith("/") ? (
                    <Link
                      to={item.verifyUrl}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3.5 py-1.5 font-mono text-xs font-semibold text-foreground transition-all hover:border-cyber-cyan hover:bg-accent"
                    >
                      <FileCheck size={14} className="text-cyber-cyan" />
                      Inspect Research Record →
                    </Link>
                  ) : (
                    <a
                      href={item.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3.5 py-1.5 font-mono text-xs font-semibold text-foreground transition-all hover:border-cyber-cyan hover:bg-accent"
                    >
                      <ExternalLink size={14} className="text-cyber-cyan" />
                      Verify External Credential
                    </a>
                  )}
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
