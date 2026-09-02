import { createFileRoute } from "@tanstack/react-router";
import { Code, Database, Cpu, Layers, Terminal, BookOpen } from "lucide-react";
import { skills } from "../data/portfolio";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Technical Competencies & Knowledge Matrix" },
      {
        name: "description",
        content:
          "Statistical modeling, machine learning frameworks, programming languages, and computational tools mastered by Arpan Mukherjee.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Technical Competencies & Knowledge Matrix" },
      {
        property: "og:description",
        content:
          "Statistical modeling, machine learning frameworks, programming languages, and computational tools mastered by Arpan Mukherjee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "languages":
        return <Code size={16} className="text-emerald-600" />;
      case "libraries":
        return <Layers size={16} className="text-sky-600" />;
      case "concepts":
        return <Cpu size={16} className="text-amber-600" />;
      default:
        return <Terminal size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {skills.title} & Competencies
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Theoretical & Applied Taxonomy
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          Structured catalog of core programming languages, statistical & machine learning packages, mathematical concepts, and engineering environments used across research and competitive computing.
        </p>
      </section>

      {/* Categories Grid */}
      <div className="space-y-8">
        {skills.categories.map((category) => (
          <section
            key={category.name}
            className="rounded-md border border-border/80 bg-card p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                {getCategoryIcon(category.name)}
                <h2 className="font-display text-xl font-bold text-foreground">
                  {category.name}
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {category.items.length} {category.items.length === 1 ? "Domain" : "Disciplines"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded border border-border bg-background px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

