import { createFileRoute } from "@tanstack/react-router";
import { Shield, BookOpen, Users, Award, Terminal } from "lucide-react";
import { positions } from "../data/portfolio";
import { AnimatedSection } from "../lib/PageTransition";

export const Route = createFileRoute("/positions")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Positions of Responsibility & Service" },
      {
        name: "description",
        content:
          "Leadership roles, committee memberships, and service positions held by Arpan Mukherjee at Ramakrishna Mission Residential College and professional societies.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Positions of Responsibility & Service" },
      {
        property: "og:description",
        content:
          "Leadership roles, committee memberships, and service positions held by Arpan Mukherjee at Ramakrishna Mission Residential College and professional societies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PositionsPage,
});

function PositionsPage() {
  return (
    <div className="space-y-12 perspective-container">
      {/* Page Header */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              {positions.title} & Governance
            </h1>
            <span className="scifi-hud-badge">
              <span className="scifi-pulse-dot" />
              INSTITUTIONAL SERVICE
            </span>
          </div>
          <div className="academic-rule" />
          <p className="font-serif text-base text-foreground leading-relaxed">
            {positions.description}
          </p>
        </section>
      </AnimatedSection>

      {/* Alternating Positions Showcase */}
      <div className="space-y-8">
        {positions.items.map((pos, idx) => (
          <AnimatedSection
            key={idx}
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
                    : "var(--cyber-amber)",
              }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    {pos.role}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 font-serif text-sm text-muted-foreground">
                    <Terminal size={14} className="text-cyber-cyan" />
                    {pos.institution}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {pos.period}
                </span>
              </div>

              <p className="font-serif text-base leading-relaxed text-foreground">
                {pos.description}
              </p>

              {pos.responsibilities && (
                <div className="rounded-md border border-border/70 bg-background/50 p-3.5 backdrop-blur-md">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Key Directives & Mandates
                  </h3>
                  <ul className="mt-2 space-y-1.5 font-serif text-sm text-foreground">
                    {pos.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyber-emerald" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
