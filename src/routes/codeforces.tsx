import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Code2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  Terminal,
  Activity,
  Zap,
  Flame,
  Shield,
  Layers,
  AlertCircle,
  BarChart3,
  Calendar,
  Sparkles
} from "lucide-react";
import { codeforces as fallbackCodeforces, site } from "../data/portfolio";
import { AnimatedSection, StaggerContainer } from "../lib/PageTransition";

export const Route = createFileRoute("/codeforces")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Codeforces Live Telemetry & Analytics" },
      {
        name: "description",
        content:
          "Real-time Codeforces contest rating, live submissions stream, and algorithmic problem-solving analytics for Arpan Mukherjee (ArpanMukherjee0710).",
      },
      { property: "og:title", content: "Arpan Mukherjee — Codeforces Live Telemetry & Analytics" },
      {
        property: "og:description",
        content:
          "Real-time Codeforces contest rating, live submissions stream, and algorithmic problem-solving analytics for Arpan Mukherjee (ArpanMukherjee0710).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CodeforcesPage,
});

interface CFUserInfo {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  avatar: string;
  titlePhoto: string;
  friendOfCount: number;
  contribution: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
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

interface CFSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    tags: string[];
    rating?: number;
  };
  programmingLanguage: string;
  verdict: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

function formatRelativeTime(timestampSeconds: number) {
  const diff = Date.now() / 1000 - timestampSeconds;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  const date = new Date(timestampSeconds * 1000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getRankColor(rank: string) {
  const r = (rank || "").toLowerCase();
  if (r.includes("grandmaster")) return "#ff0000";
  if (r.includes("master")) return "#ff8c00";
  if (r.includes("candidate")) return "#aa00aa";
  if (r.includes("expert")) return "#0000ff";
  if (r.includes("specialist")) return "#03a89e";
  if (r.includes("pupil")) return "#00ff9d";
  return "#00f0ff";
}

function CodeforcesPage() {
  const handle = "ArpanMukherjee0710";
  const [userInfo, setUserInfo] = useState<CFUserInfo | null>(null);
  const [ratingHistory, setRatingHistory] = useState<CFRatingChange[]>([]);
  const [submissions, setSubmissions] = useState<CFSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchRealtimeData = async () => {
    setIsRefreshing(true);
    setApiError(null);
    try {
      // 1. Fetch User Info
      const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const userData = await userRes.json();
      if (userData.status === "OK" && userData.result && userData.result.length > 0) {
        setUserInfo(userData.result[0]);
      }

      // 2. Fetch Rating History
      const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
      const ratingData = await ratingRes.json();
      if (ratingData.status === "OK" && ratingData.result) {
        setRatingHistory(ratingData.result);
      }

      // 3. Fetch Recent Submissions
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=50`);
      const statusData = await statusRes.json();
      if (statusData.status === "OK" && statusData.result) {
        setSubmissions(statusData.result);
      }

      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Codeforces live telemetry fetch error:", err);
      setApiError("Live stream throttled by Codeforces API. Showing cached telemetry.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    // Auto-poll telemetry every 60 seconds
    const interval = setInterval(fetchRealtimeData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Tag frequency analysis from submissions
  const tagBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    const solved = new Set<string>();

    submissions.forEach((s) => {
      if (s.verdict === "OK" && s.problem) {
        const probKey = `${s.problem.contestId || ""}_${s.problem.index}_${s.problem.name}`;
        if (!solved.has(probKey)) {
          solved.add(probKey);
          (s.problem.tags || []).forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        }
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [submissions]);

  // Solved count in recent batch
  const uniqueAcceptedCount = useMemo(() => {
    const solved = new Set<string>();
    submissions.forEach((s) => {
      if (s.verdict === "OK" && s.problem) {
        solved.add(`${s.problem.contestId || ""}_${s.problem.index}`);
      }
    });
    return solved.size;
  }, [submissions]);

  const currentRating = userInfo?.rating || 1209;
  const maxRating = userInfo?.maxRating || 1209;
  const currentRank = userInfo?.rank || "Pupil";
  const maxRank = userInfo?.maxRank || "Pupil";

  return (
    <div className="space-y-10 perspective-container">
      {/* Header & Status Indicator */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              Codeforces Algorithmic Telemetry
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchRealtimeData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background/80 px-2.5 py-1 font-mono text-xs font-semibold text-cyber-cyan transition-colors hover:bg-accent disabled:opacity-50"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin text-cyber-cyan" : ""} />
                <span>{isRefreshing ? "POLLING..." : "SYNC NOW"}</span>
              </button>
              <span className="scifi-hud-badge">
                <span className="scifi-pulse-dot" />
                STREAM: LIVE
              </span>
            </div>
          </div>
          <div className="academic-rule" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Terminal size={14} className="text-cyber-cyan" />
              <span>Real-time Codeforces API v2 Pipeline • Target: </span>
              <strong className="text-cyber-cyan font-bold">@{handle}</strong>
            </p>
            {lastUpdated && (
              <span className="text-[11px] text-muted-foreground/80">
                Last Telemetry Update: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Main Stats Grid */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Rating Card */}
        <div data-stagger-child className="academic-card space-y-2 card-3d hud-corner-brackets" style={{ borderLeftColor: getRankColor(currentRank) }}>
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase">
              <Flame size={14} className="text-cyber-emerald" />
              Current Rating
            </span>
            <span>[METRIC.01]</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-3xl font-extrabold text-foreground">{currentRating}</p>
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-cyber-emerald">
              ({currentRank})
            </span>
          </div>
          <p className="font-serif text-xs text-muted-foreground">
            Peak Rating: <strong className="text-foreground">{maxRating}</strong> ({maxRank})
          </p>
        </div>

        {/* Contests Card */}
        <div data-stagger-child className="academic-card space-y-2 card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-cyan)" }}>
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase">
              <Trophy size={14} className="text-cyber-cyan" />
              Rated Contests
            </span>
            <span>[METRIC.02]</span>
          </div>
          <p className="font-display text-3xl font-extrabold text-foreground">
            {ratingHistory.length || 8}
          </p>
          <p className="font-serif text-xs text-muted-foreground">
            Active Competitor on Codeforces Rounds
          </p>
        </div>

        {/* Solved Problems */}
        <div data-stagger-child className="academic-card space-y-2 card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-violet)" }}>
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase">
              <CheckCircle2 size={14} className="text-cyber-violet" />
              Problems Solved
            </span>
            <span>[METRIC.03]</span>
          </div>
          <p className="font-display text-3xl font-extrabold text-foreground">100+</p>
          <p className="font-serif text-xs text-muted-foreground">
            {uniqueAcceptedCount} Unique AC in Recent Batch
          </p>
        </div>

        {/* Profile Link Card */}
        <div data-stagger-child className="academic-card space-y-2 card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-amber)" }}>
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase">
              <Shield size={14} className="text-cyber-amber" />
              Profile Status
            </span>
            <span>[METRIC.04]</span>
          </div>
          <a
            href={`https://codeforces.com/profile/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex items-center gap-2 font-mono text-sm font-bold text-cyber-amber hover:underline"
          >
            <span>Inspect Live Profile</span>
            <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="font-serif text-xs text-muted-foreground">
            Rank: <span className="font-bold capitalize text-cyber-emerald">{currentRank}</span>
          </p>
        </div>
      </StaggerContainer>

      {/* Rating Progression Chart */}
      {ratingHistory.length > 0 && (
        <AnimatedSection animation="cyberSlideLeft">
          <div className="academic-card space-y-4 card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-cyan)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-cyber-cyan" />
                <h2 className="font-display text-lg font-bold text-foreground">
                  Official Rating Progression Trajectory
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {ratingHistory.length} RATED CONTESTS LOGGED
              </span>
            </div>

            {/* Custom SVG Rating Sparkline Chart */}
            <div className="relative pt-4 pb-2">
              <div className="h-44 w-full">
                <svg viewBox="0 0 600 160" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1="0" y1="130" x2="600" y2="130" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                  {/* Calculate points */}
                  {(() => {
                    const ratings = ratingHistory.map((r) => r.newRating);
                    const minR = Math.min(...ratings, 900);
                    const maxR = Math.max(...ratings, 1300);
                    const range = Math.max(maxR - minR, 100);

                    const points = ratingHistory.map((r, i) => {
                      const x = (i / (ratingHistory.length - 1 || 1)) * 580 + 10;
                      const y = 140 - ((r.newRating - minR) / range) * 110;
                      return { x, y, ...r };
                    });

                    const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
                    const areaD = `${pathD} L ${points[points.length - 1]!.x} 150 L ${points[0]!.x} 150 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#ratingGrad)" />
                        <path d={pathD} fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, i) => (
                          <g key={i} className="cursor-pointer group">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill="#00ff9d"
                              stroke="#0a0f1d"
                              strokeWidth="2"
                              className="transition-all group-hover:r-6"
                            />
                            {/* Value Label */}
                            <text
                              x={p.x}
                              y={p.y - 10}
                              textAnchor="middle"
                              fill="#00f0ff"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {p.newRating}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Contest Timeline Labels */}
              <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                <span>{ratingHistory[0]?.contestName?.slice(0, 24) || "Contest 1"}...</span>
                <span>Latest: {ratingHistory[ratingHistory.length - 1]?.contestName?.slice(0, 28) || "Round"}...</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Algorithmic Topic Distribution & Tags */}
      {tagBreakdown.length > 0 && (
        <AnimatedSection animation="cyberSlideRight">
          <div className="academic-card space-y-4 card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-violet)" }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-cyber-violet" />
                <h2 className="font-display text-lg font-bold text-foreground">
                  Algorithmic Problem Domains & Topic Concentration
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">TOP VERIFIED TAGS</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {tagBreakdown.map(([tag, count], idx) => (
                <div
                  key={tag}
                  className="flex items-center justify-between rounded border border-border/80 bg-background/60 p-3 font-mono text-xs"
                >
                  <span className="font-semibold text-foreground capitalize">{tag}</span>
                  <span className="rounded bg-secondary/80 px-2 py-0.5 font-bold text-cyber-cyan">
                    {count} Solved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Real-time Submissions Stream Table */}
      <AnimatedSection animation="cyberSlideLeft">
        <div className="academic-card space-y-4 card-3d hud-corner-brackets" style={{ borderLeftColor: "var(--cyber-emerald)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-cyber-emerald" />
              <h2 className="font-display text-lg font-bold text-foreground">
                Real-Time Execution Feed ({submissions.length} Submissions)
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">LIVE API LOGS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full font-serif text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left font-mono text-xs text-muted-foreground">
                  <th className="py-2 pr-3">Problem ID</th>
                  <th className="py-2 pr-3">Problem Name</th>
                  <th className="py-2 pr-3">Language</th>
                  <th className="py-2 pr-3 text-center">Verdict</th>
                  <th className="py-2 pr-3 text-right">Runtime</th>
                  <th className="py-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-xs">
                {submissions.slice(0, 15).map((sub) => {
                  const isOk = sub.verdict === "OK";
                  const isWa = sub.verdict === "WRONG_ANSWER";
                  const isTle = sub.verdict === "TIME_LIMIT_EXCEEDED";

                  return (
                    <tr key={sub.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-2.5 pr-3 text-cyber-cyan font-bold">
                        {sub.problem?.contestId ? `${sub.problem.contestId}${sub.problem.index}` : sub.problem?.index || "—"}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-foreground max-w-[200px] truncate font-sans">
                        {sub.problem?.name || "Problem"}
                      </td>
                      <td className="py-2.5 pr-3 text-muted-foreground">
                        {sub.programmingLanguage}
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOk
                              ? "bg-emerald-500/15 text-cyber-emerald border border-emerald-500/30"
                              : isWa
                              ? "bg-amber-500/15 text-cyber-amber border border-amber-500/30"
                              : isTle
                              ? "bg-violet-500/15 text-cyber-violet border border-violet-500/30"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {sub.verdict === "OK" ? "ACCEPTED" : sub.verdict.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-right text-muted-foreground">
                        {sub.timeConsumedMillis} ms
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground text-[11px]">
                        {formatRelativeTime(sub.creationTimeSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
