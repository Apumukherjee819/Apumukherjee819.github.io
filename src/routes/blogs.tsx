import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ExternalLink, Tag, Clock, Calendar } from "lucide-react";
import { blogs, site } from "../data/portfolio";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Academic Notes & Technical Articles" },
      {
        name: "description",
        content:
          "Notes on mathematical statistics, competitive algorithmic problem-solving, and machine learning systems by Arpan Mukherjee.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Academic Notes & Technical Articles" },
      {
        property: "og:description",
        content:
          "Notes on mathematical statistics, competitive algorithmic problem-solving, and machine learning systems by Arpan Mukherjee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {blogs.title} & Technical Dispatches
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Essays · Problem Notes · Algorithmic Analysis
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          {blogs.description}
        </p>
      </section>

      {/* Blog Articles List */}
      <div className="space-y-6">
        {blogs.posts.map((post) => (
          <article
            key={post.slug}
            className="academic-card space-y-3 transition-all hover:border-foreground/40 hover:bg-accent/40"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {post.readTime}
              </span>
            </div>

            <h2 className="font-display text-xl font-bold text-foreground">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400 inline-flex items-center gap-2"
              >
                <span>{post.title}</span>
                <span className="text-xs text-muted-foreground">↗</span>
              </a>
            </h2>

            <p className="font-serif text-base leading-relaxed text-foreground">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded border border-border/70 bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* External Dispatches Notice */}
      <section className="rounded-md border border-border/80 bg-card p-5 space-y-2 text-sm font-serif">
        <p className="text-foreground">
          Additional algorithm breakdowns, dynamic programming solutions, and statistics proofs are actively published on{" "}
          <a
            href={site.socials.leetcode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline underline-offset-4 hover:text-foreground dark:text-emerald-400"
          >
            LeetCode Discuss
          </a>
          . Standalone long-form research manuscripts and monographs will be indexed here as they are peer-reviewed.
        </p>
      </section>
    </div>
  );
}

