import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Trophy, Code2, ExternalLink, RefreshCw, CheckCircle2, TrendingUp, Award, Clock } from "lucide-react";
import { codeforces, site } from "../data/portfolio";

export const Route = createFileRoute("/codeforces")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Codeforces Competitive Analytics" },
      {
        name: "description",
        content:
          "Live Codeforces rating, contest performance, and algorithmic problem-solving analytics for Arpan Mukherjee (ArpanMukherjee0710).",
      },
      { property: "og:title", content: "Arpan Mukherjee — Codeforces Competitive Analytics" },
      {
        property: "og:description",
        content:
          "Live Codeforces rating, contest performance, and algorithmic problem-solving analytics for Arpan Mukherjee (ArpanMukherjee0710).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CodeforcesPage,
});

interface CFUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  titlePhoto?: string;
  contribution: number;
}

interface CFSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
  programmingLanguage: string;
  verdict: string;
}

interface CFRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

function CodeforcesPage() {
  const [user, setUser] = useState<CFUser | null>(null);
  const [submissions, setSubmissions] = useState<CFSubmission[]>([]);
  const [ratingChanges, setRatingChanges] = useState<CFRatingChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCFData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, subsRes, ratingRes] = await Promise.allSettled([
        fetch(`https://codeforces.com/api/user.info?handles=${codeforces.handle}`).then((r) => r.json()),
        fetch(`https://codeforces.com/api/user.status?handle=${codeforces.handle}&from=1&count=25`).then((r) =>
          r.json()
        ),
        fetch(`https://codeforces.com/api/user.rating?handle=${codeforces.handle}`).then((r) => r.json()),
      ]);

      if (userRes.status === "fulfilled" && userRes.value?.status === "OK") {
        setUser(userRes.value.result[0]);
      }
      if (subsRes.status === "fulfilled" && subsRes.value?.status === "OK") {
        setSubmissions(subsRes.value.result);
      }
      if (ratingRes.status === "fulfilled" && ratingRes.value?.status === "OK") {
        setRatingChanges(ratingRes.value.result);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to sync live Codeforces statistics. Showing cached metadata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCFData();
  }, []);

  const solvedSubmissions = submissions.filter((s) => s.verdict === "OK");

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {codeforces.title} & Contest Standing
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Official Handle: {codeforces.handle}
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          {codeforces.description} Real-time data retrieved directly via the Codeforces Public API.
        </p>
      </section>

      {/* Main Profile Dossier Card */}
      <section className="academic-card space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={codeforces.handle}
                className="h-16 w-16 rounded border border-border object-cover bg-background"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded border border-border bg-background">
                <Code2 size={24} className="text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {codeforces.handle}
                </h2>
                <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs font-semibold capitalize text-muted-foreground">
                  {user?.rank || "Newbie"}
                </span>
              </div>
              <p className="font-serif text-xs text-muted-foreground">
                Codeforces Competitive Programming Division
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchCFData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Syncing..." : "Sync Live"}</span>
            </button>
            <a
              href={codeforces.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent"
            >
              <span>Profile</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2 border-t border-border/50">
          <div className="rounded border border-border/60 bg-background/50 p-3">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Current Rating
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-foreground">
              {user?.rating ?? 1007}
            </p>
          </div>
          <div className="rounded border border-border/60 bg-background/50 p-3">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Max Peak Rating
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-foreground">
              {user?.maxRating ?? 1007}
            </p>
          </div>
          <div className="rounded border border-border/60 bg-background/50 p-3">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Rated Contests
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-foreground">
              {ratingChanges.length || 6}
            </p>
          </div>
          <div className="rounded border border-border/60 bg-background/50 p-3">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              Active Tier
            </span>
            <p className="mt-1 font-mono text-base font-bold capitalize text-emerald-700 dark:text-emerald-400">
              {user?.rank ?? "Newbie"}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Accepted Problems & Practice Stream */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            Recent Problem Solves & Practice
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            Last {submissions.length} Submissions
          </span>
        </div>

        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full border-collapse font-serif text-sm">
            <thead>
              <tr className="border-b border-border bg-background/60 text-left text-xs text-muted-foreground font-mono uppercase">
                <th className="px-4 py-2.5">Problem Name</th>
                <th className="px-4 py-2.5">Rating</th>
                <th className="px-4 py-2.5">Tags</th>
                <th className="px-4 py-2.5">Language</th>
                <th className="px-4 py-2.5 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {submissions.length > 0 ? (
                submissions.slice(0, 10).map((sub) => (
                  <tr key={sub.id} className="hover:bg-accent/30">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      <a
                        href={
                          sub.problem.contestId
                            ? `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`
                            : codeforces.profileUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-600 hover:underline inline-flex items-center gap-1.5"
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {sub.problem.contestId ? `${sub.problem.contestId}${sub.problem.index}` : "—"}
                        </span>
                        <span>{sub.problem.name}</span>
                      </a>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {sub.problem.rating ? `${sub.problem.rating}` : "Unrated"}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {sub.problem.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded border border-border/60 bg-background px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {sub.programmingLanguage}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">
                      {sub.verdict === "OK" ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 size={13} />
                          <span>Accepted</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{sub.verdict}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground font-mono">
                    {loading ? "Fetching submissions from Codeforces API..." : "No recent submissions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rated Contest History */}
      {ratingChanges.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              Official Rated Contest History
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {ratingChanges.length} Official Rounds
            </span>
          </div>

          <div className="overflow-x-auto rounded-md border border-border bg-card">
            <table className="w-full border-collapse font-serif text-sm">
              <thead>
                <tr className="border-b border-border bg-background/60 text-left text-xs text-muted-foreground font-mono uppercase">
                  <th className="px-4 py-2.5">Contest Round</th>
                  <th className="px-4 py-2.5">Global Rank</th>
                  <th className="px-4 py-2.5">Old Rating</th>
                  <th className="px-4 py-2.5">New Rating</th>
                  <th className="px-4 py-2.5 text-right">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {ratingChanges.map((change) => {
                  const diff = change.newRating - change.oldRating;
                  return (
                    <tr key={change.contestId} className="hover:bg-accent/30">
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        <a
                          href={`https://codeforces.com/contest/${change.contestId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-emerald-600"
                        >
                          {change.contestName}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        #{change.rank}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {change.oldRating}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs font-bold text-foreground">
                        {change.newRating}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-bold">
                        {diff >= 0 ? (
                          <span className="text-emerald-700 dark:text-emerald-400">+{diff}</span>
                        ) : (
                          <span className="text-rose-600">{diff}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

