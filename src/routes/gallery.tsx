import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Image as ImageIcon, Eye, Download, X, ShieldCheck, ExternalLink, Terminal } from "lucide-react";
import { gallery } from "../data/portfolio";
import { AnimatedSection } from "../lib/PageTransition";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Archival Documents & Verified Credentials" },
      {
        name: "description",
        content:
          "Official certificates, project research reports, and verified credentials for Arpan Mukherjee.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Archival Documents & Verified Credentials" },
      {
        property: "og:description",
        content:
          "Official certificates, project research reports, and verified credentials for Arpan Mukherjee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="space-y-12 perspective-container">
      {/* Page Header */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              {gallery.title} & Credentials
            </h1>
            <span className="scifi-hud-badge">
              <span className="scifi-pulse-dot" />
              VERIFIED ARCHIVAL REPO
            </span>
          </div>
          <div className="academic-rule" />
          <p className="font-serif text-base text-foreground leading-relaxed">
            Repository of authentic research reports, institutional internship records, and technical certifications. Click any credential to inspect the high-resolution archival document.
          </p>
        </section>
      </AnimatedSection>

      {/* Gallery Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {gallery.items.map((item, idx) => (
          <AnimatedSection
            key={idx}
            animation={idx % 2 === 0 ? "cyberSlideLeft" : "cyberSlideRight"}
            delay={idx * 0.1}
          >
            <div
              className="academic-card group flex flex-col justify-between space-y-4 card-3d hud-corner-brackets"
              style={{
                borderLeftColor:
                  idx === 0
                    ? "var(--cyber-emerald)"
                    : idx === 1
                    ? "var(--cyber-cyan)"
                    : idx === 2
                    ? "var(--cyber-violet)"
                    : "var(--cyber-amber)",
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono text-[10px] text-cyber-cyan">
                    [DOC // 0{idx + 1}]
                  </span>
                  <span className="font-mono">{item.year}</span>
                </div>
                <h2 className="font-display text-base font-bold uppercase tracking-wide text-foreground group-hover:text-cyber-cyan transition-colors">
                  {item.title}
                </h2>
                <span className="scifi-hud-badge py-0.5 text-[10px] uppercase">
                  {item.type} ARCHIVE
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs font-semibold text-foreground transition-all hover:border-cyber-cyan hover:bg-accent"
                >
                  <Eye size={14} className="text-cyber-cyan" />
                  Inspect Document
                </a>
                <a
                  href={item.url}
                  download
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-foreground transition-all hover:border-cyber-emerald hover:bg-accent"
                  title="Download Document"
                >
                  <Download size={14} className="text-cyber-emerald" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
