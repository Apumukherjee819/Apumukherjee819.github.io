import { createFileRoute } from "@tanstack/react-router";
import { Shield, BookOpen, Users, Award } from "lucide-react";
import { positions } from "../data/portfolio";

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
    <div className="space-y-12">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {positions.title} & Service
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Academic Governance & Society Records
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          Chronological record of student leadership, institutional committee appointments, and professional society memberships.
        </p>
      </section>

      {/* Positions List */}
      <div className="space-y-6">
        {positions.items.map((item, idx) => (
          <article
            key={idx}
            className="academic-card space-y-3"
            style={{
              borderLeftColor:
                idx === 0 ? "hsl(142, 65%, 32%)" : "hsl(215, 60%, 35%)",
            }}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {item.role}
                </h2>
                <p className="font-serif text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {item.organization}
                </p>
              </div>
              <span className="inline-flex self-start rounded border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted-foreground sm:self-auto">
                {item.period}
              </span>
            </div>

            <p className="font-serif text-base leading-relaxed text-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

