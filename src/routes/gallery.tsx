import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Image as ImageIcon, Eye, Download, X, ShieldCheck, ExternalLink } from "lucide-react";
import { gallery } from "../data/portfolio";

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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {gallery.title} & Credentials
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Official PDFs & Verifiable Credentials
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          Repository of authentic research reports, institutional internship records, and technical certifications. Click any credential to inspect the high-resolution archival document.
        </p>
      </section>

      {/* Gallery Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {gallery.items.map((item, idx) => (
          <article
            key={idx}
            className="group flex flex-col justify-between rounded-md border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-foreground/40 hover:bg-accent/40"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                  {item.type === "image" ? (
                    <ImageIcon size={12} className="text-sky-600" />
                  ) : (
                    <FileText size={12} className="text-emerald-600" />
                  )}
                  {item.type}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                {item.title}
              </h2>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
              {item.url ? (
                <>
                  <button
                    onClick={() => setExpandedIdx(idx)}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <Eye size={14} className="text-emerald-600" />
                    <span>Inspect Document</span>
                  </button>
                  <a
                    href={item.url}
                    download
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </>
              ) : (
                <span className="font-mono text-xs text-muted-foreground">
                  Archival Copy Pending
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Document Modal Viewer */}
      {expandedIdx !== null && gallery.items[expandedIdx]?.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          onClick={() => setExpandedIdx(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-md border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-background">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <h3 className="font-display text-base font-bold text-foreground truncate max-w-lg">
                  {gallery.items[expandedIdx].title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={gallery.items[expandedIdx].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink size={13} />
                  <span>Open Fullscreen</span>
                </a>
                <button
                  onClick={() => setExpandedIdx(null)}
                  className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Reader Container */}
            <div className="overflow-auto bg-neutral-900/10 p-2 dark:bg-black/40">
              {gallery.items[expandedIdx].type === "image" ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <img
                    src={gallery.items[expandedIdx].url}
                    alt={gallery.items[expandedIdx].title}
                    className="max-h-[75vh] w-auto rounded border border-border object-contain shadow-sm bg-white"
                  />
                </div>
              ) : (
                <iframe
                  src={gallery.items[expandedIdx].url}
                  title={gallery.items[expandedIdx].title}
                  className="w-full rounded border border-border bg-white"
                  style={{ height: "75vh" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

