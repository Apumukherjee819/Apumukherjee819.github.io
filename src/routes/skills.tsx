import { createFileRoute } from "@tanstack/react-router";
import { Terminal, Database, Layers, Wrench, BookOpen, Sparkles, Cpu, CheckCircle2 } from "lucide-react";
import { skills } from "../data/portfolio";
import { AnimatedSection } from "../lib/PageTransition";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Technical Matrix & Skills" },
      {
        name: "description",
        content:
          "Statistical computing, programming languages (Python, C++, SQL), machine learning frameworks, and algorithmic competencies.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Technical Matrix & Skills" },
      {
        property: "og:description",
        content:
          "Statistical computing, programming languages (Python, C++, SQL), machine learning frameworks, and algorithmic competencies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("language")) return <Terminal size={18} className="text-cyber-violet" />;
    if (lower.includes("librar") || lower.includes("framework")) return <Layers size={18} className="text-cyber-amber" />;
    if (lower.includes("data") || lower.includes("tool")) return <Database size={18} className="text-cyber-cyan" />;
    if (lower.includes("concept") || lower.includes("algorithm")) return <Cpu size={18} className="text-cyber-emerald" />;
    return <BookOpen size={18} className="text-cyber-cyan" />;
  };

  const getBorderColor = (idx: number) => {
    const colors = [
      "var(--cyber-emerald)",
      "var(--cyber-cyan)",
      "var(--cyber-violet)",
      "var(--cyber-amber)",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-8 perspective-container">
      {/* Page Title Header */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              {skills.title} & Technical Matrix
            </h1>
            <span className="scifi-hud-badge">
              <span className="scifi-pulse-dot" />
              MATRIX // {skills.categories?.length || 4} CORE DOMAINS
            </span>
          </div>
          <div className="academic-rule" />
          <p className="font-serif text-base text-foreground leading-relaxed">
            A comprehensive overview of statistical computing, algorithmic competencies, programming toolchains, and machine learning stacks.
          </p>
        </section>
      </AnimatedSection>

      {/* Alternating Sci-Fi Skill Categories */}
      <div className="space-y-6">
        {(skills.categories || []).map((cat, idx) => {
          // Support both items: string[] and skills: { name, level }[]
          const rawItems = cat.items || (cat as any).skills || [];

          return (
            <AnimatedSection
              key={cat.name}
              animation={idx % 2 === 0 ? "cyberSlideLeft" : "cyberSlideRight"}
              delay={idx * 0.08}
            >
              <div
                className="academic-card space-y-4 card-3d hud-corner-brackets"
                style={{
                  borderLeftColor: getBorderColor(idx),
                }}
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon(cat.name)}
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {cat.name}
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    [DOMAIN 0{idx + 1}]
                  </span>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                  {rawItems.map((item: any, sIdx: number) => {
                    const itemName = typeof item === "string" ? item : item.name;
                    const itemLevel = typeof item === "object" && item.level ? item.level : "Proficient";

                    return (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between rounded-md border border-border/80 bg-background/50 p-2.5 font-mono text-xs transition-colors hover:border-cyber-cyan/60 hover:bg-secondary/60"
                      >
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan" />
                          {itemName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {itemLevel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );
}
