import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, ExternalLink, FileCheck } from "lucide-react";
import { achievements } from "../data/portfolio";

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
    <div className="space-y-12">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {achievements.title} & Honors
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Competitive Records · Verified Accolades
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          National hackathons, competitive programming milestones, problem-solving benchmarks, and research appointments. All certificates are verifiable through the Document Archive.
        </p>
      </section>

      {/* Achievements List */}
      <div className="space-y-6">
        {achievements.items.map((item, idx) => (
          <article
            key={item.number}
            className="academic-card space-y-4"
            style={{
              borderLeftColor:
                idx === 0
                  ? "hsl(142, 65%, 32%)"
                  : idx === 1
                  ? "hsl(215, 60%, 35%)"
                  : "hsl(35, 60%, 40%)",
            }}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  № {item.number}
                </span>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {item.title}
                </h2>
              </div>
              <span className="inline-flex self-start rounded border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted-foreground sm:self-auto">
                {item.date}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 border-y border-border/50 py-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="font-serif text-base leading-relaxed text-foreground">
              {item.description}
            </p>

            {/* Verification Button */}
            {item.verifyUrl && (
              <div className="pt-1">
                {item.verifyUrl.startsWith("/") ? (
                  <Link
                    to={item.verifyUrl}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent"
                  >
                    <FileCheck size={14} className="text-emerald-600" />
                    <span>View Archival Certificate →</span>
                  </Link>
                ) : (
                  <a
                    href={item.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Verify Credential</span>
                    <span className="text-muted-foreground text-[10px]">↗</span>
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

