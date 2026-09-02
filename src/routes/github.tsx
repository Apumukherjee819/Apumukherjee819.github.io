import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Github,
  GitCommit,
  GitFork,
  Star,
  RefreshCw,
  ExternalLink,
  Flame,
  BookOpen,
  Code2,
  Activity,
  AlertCircle,
  FolderGit2,
  Sparkles,
} from "lucide-react";
import { github, site } from "../data/portfolio";

export const Route = createFileRoute("/github")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — GitHub Activity & Repositories" },
      {
        name: "description",
        content:
          "Live real-time GitHub profile, repository showcase, contribution heatmap, and commit activity for Arpan Mukherjee.",
      },
      { property: "og:title", content: "Arpan Mukherjee — GitHub Activity & Repositories" },
      {
        property: "og:description",
        content:
          "Live real-time GitHub profile, repository showcase, contribution heatmap, and commit activity for Arpan Mukherjee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GitHubPage,
});

// --- Types ---

interface GitHubProfile {
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  name: string | null;
  login: string;
  html_url: string;
  public_gists: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

interface GitHubActivityItem {
  id: string;
  type: "push" | "create" | "star" | "other";
  message: string;
  repo: string;
  repoUrl: string;
  date: string;
  relativeTime: string;
  sha?: string;
  commitUrl?: string;
  branch?: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

// --- Constants & Config ---

const HANDLE = github.handle || site.socials.github.handle || "Apumukherjee819";
const CACHE_KEY_PROFILE = `gh_profile_${HANDLE}`;
const CACHE_KEY_CONTRIBS = `gh_contribs_${HANDLE}`;
const CACHE_KEY_EVENTS = `gh_events_${HANDLE}`;
const CACHE_KEY_REPOS = `gh_repos_${HANDLE}`;
const CACHE_KEY_LAST_SYNC = `gh_last_sync_${HANDLE}`;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache TTL

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  R: "#198CE7",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  SQL: "#e38c00",
  default: "#8b949e",
};

// --- Cache Helpers ---

function getCached<T>(key: string, ignoreExpiry = false): T | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!ignoreExpiry && Date.now() - ts > CACHE_TTL) return null;
    return data as T;
  } catch {
    return null;
  }
}

function setCache(key: string, data: unknown) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
    }
  } catch {}
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateString;
  }
}

// --- Fetch Functions ---

async function fetchProfile(force = false): Promise<GitHubProfile> {
  if (!force) {
    const cached = getCached<GitHubProfile>(CACHE_KEY_PROFILE);
    if (cached) return cached;
  }
  const res = await fetch(`https://api.github.com/users/${HANDLE}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    const stale = getCached<GitHubProfile>(CACHE_KEY_PROFILE, true);
    if (stale) return stale;
    throw new Error(`Profile fetch failed: ${res.statusText}`);
  }
  const data = (await res.json()) as GitHubProfile;
  setCache(CACHE_KEY_PROFILE, data);
  return data;
}

async function fetchRepositories(force = false): Promise<GitHubRepo[]> {
  if (!force) {
    const cached = getCached<GitHubRepo[]>(CACHE_KEY_REPOS);
    if (cached) return cached;
  }
  const res = await fetch(`https://api.github.com/users/${HANDLE}/repos?sort=pushed&per_page=12`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    const stale = getCached<GitHubRepo[]>(CACHE_KEY_REPOS, true);
    if (stale) return stale;
    throw new Error(`Repos fetch failed: ${res.statusText}`);
  }
  const data = (await res.json()) as GitHubRepo[];
  setCache(CACHE_KEY_REPOS, data);
  return data;
}

async function fetchContributions(force = false): Promise<{ contributions: ContributionDay[]; total: number }> {
  if (!force) {
    const cached = getCached<{ contributions: ContributionDay[]; total: number }>(CACHE_KEY_CONTRIBS);
    if (cached) return cached;
  }

  // 1. Try public CORS-compliant API
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${HANDLE}?y=last`);
    if (res.ok) {
      const data = await res.json();
      const list: ContributionDay[] = data.contributions || [];
      const total =
        data.total?.lastYear ??
        data.total?.year ??
        list.reduce((acc: number, day: ContributionDay) => acc + (day.count || 0), 0);

      const result = { contributions: list, total };
      setCache(CACHE_KEY_CONTRIBS, result);
      return result;
    }
  } catch {
    // Fallback to cached or synthetic
  }

  // 2. Check stale cache
  const stale = getCached<{ contributions: ContributionDay[]; total: number }>(CACHE_KEY_CONTRIBS, true);
  if (stale) return stale;

  // 3. Graceful synthetic fallback from last year
  const days: ContributionDay[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0]!,
      count: 0,
      level: 0,
    });
  }
  return { contributions: days, total: 0 };
}

async function fetchEvents(force = false): Promise<GitHubActivityItem[]> {
  if (!force) {
    const cached = getCached<GitHubActivityItem[]>(CACHE_KEY_EVENTS);
    if (cached) return cached;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${HANDLE}/events/public?per_page=30`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) {
      const stale = getCached<GitHubActivityItem[]>(CACHE_KEY_EVENTS, true);
      if (stale) return stale;
      throw new Error(`Events fetch failed: ${res.statusText}`);
    }

    const rawEvents = (await res.json()) as Array<{
      id: string;
      type: string;
      created_at: string;
      repo: { name: string; url: string };
      payload?: {
        commits?: Array<{ sha: string; message: string; url: string }>;
        ref?: string;
        ref_type?: string;
        action?: string;
      };
    }>;

    const items: GitHubActivityItem[] = [];

    for (const ev of rawEvents) {
      const repoShort = ev.repo.name;
      const repoUrl = `https://github.com/${repoShort}`;
      const relativeTime = formatRelativeTime(ev.created_at);

      if (ev.type === "PushEvent" && ev.payload?.commits?.length) {
        const branch = ev.payload.ref ? ev.payload.ref.replace("refs/heads/", "") : "main";
        for (const commit of ev.payload.commits) {
          const shortSha = commit.sha.slice(0, 7);
          items.push({
            id: `${ev.id}-${commit.sha}`,
            type: "push",
            message: commit.message.split("\n")[0] || "Update files",
            repo: repoShort,
            repoUrl,
            date: ev.created_at,
            relativeTime,
            sha: shortSha,
            commitUrl: `https://github.com/${repoShort}/commit/${commit.sha}`,
            branch,
          });
        }
      } else if (ev.type === "CreateEvent") {
        items.push({
          id: ev.id,
          type: "create",
          message: `Created ${ev.payload?.ref_type || "repository"} ${ev.payload?.ref ? `"${ev.payload.ref}"` : ""}`,
          repo: repoShort,
          repoUrl,
          date: ev.created_at,
          relativeTime,
        });
      } else if (ev.type === "WatchEvent") {
        items.push({
          id: ev.id,
          type: "star",
          message: `Starred repository`,
          repo: repoShort,
          repoUrl,
          date: ev.created_at,
          relativeTime,
        });
      }
    }

    setCache(CACHE_KEY_EVENTS, items);
    return items;
  } catch {
    const stale = getCached<GitHubActivityItem[]>(CACHE_KEY_EVENTS, true);
    if (stale) return stale;
    // Static fallback from portfolio data
    return (github.recentCommits || []).map((c, idx) => ({
      id: `fallback-${idx}`,
      type: "push" as const,
      message: c.message,
      repo: c.repo,
      repoUrl: `https://github.com/${c.repo}`,
      date: new Date().toISOString(),
      relativeTime: c.date,
      sha: "main",
    }));
  }
}

// --- Skeleton Component ---

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted/60 ${className}`} />;
}

// --- Contribution Graph Component ---

function ContributionGraph({
  contributions,
  total,
}: {
  contributions: ContributionDay[];
  total: number;
}) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const weeks = useMemo(() => {
    if (contributions.length === 0) return [];
    const sorted = [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const weekMap: Map<string, ContributionDay[]> = new Map();
    for (const day of sorted) {
      const d = new Date(day.date);
      const dayOfWeek = d.getDay();
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - dayOfWeek);
      const key = weekStart.toISOString().split("T")[0] ?? "";
      if (!weekMap.has(key)) weekMap.set(key, []);
      weekMap.get(key)!.push(day);
    }

    const result: (ContributionDay | null)[][] = [];
    for (const [, days] of weekMap) {
      const week: (ContributionDay | null)[] = new Array(7).fill(null);
      for (const day of days) {
        const d = new Date(day.date);
        week[d.getDay()] = day;
      }
      result.push(week);
    }
    return result;
  }, [contributions]);

  const months = useMemo(() => {
    if (weeks.length === 0) return [];
    const result: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i];
      if (!week) continue;
      const firstDay = week.find((d) => d !== null) as ContributionDay | null;
      if (firstDay) {
        const m = new Date(firstDay.date).getMonth();
        if (m !== lastMonth) {
          result.push({
            label: new Date(firstDay.date).toLocaleString("en-US", { month: "short" }),
            weekIndex: i,
          });
          lastMonth = m;
        }
      }
    }
    return result;
  }, [weeks]);

  // Streak metrics
  const { currentStreak, maxStreak, activeDays } = useMemo(() => {
    let cur = 0;
    let max = 0;
    let active = 0;
    const sorted = [...contributions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Current streak
    for (const day of sorted) {
      if (day.count > 0) {
        cur++;
      } else {
        const isTodayOrYesterday =
          Math.abs(Date.now() - new Date(day.date).getTime()) < 2 * 24 * 60 * 60 * 1000;
        if (!isTodayOrYesterday && cur > 0) break;
      }
    }

    // Max streak & active days
    let tempStreak = 0;
    for (const day of [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )) {
      if (day.count > 0) {
        active++;
        tempStreak++;
        if (tempStreak > max) max = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak: cur, maxStreak: max, activeDays: active };
  }, [contributions]);

  const cellSize = 11;
  const cellGap = 3;
  const labelWidth = 32;
  const monthHeight = 22;
  const totalWidth = labelWidth + weeks.length * (cellSize + cellGap);
  const totalHeight = monthHeight + 7 * (cellSize + cellGap);

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-border/70 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Year Contributions</p>
          <p className="font-display text-xl font-bold text-foreground">
            {total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md border border-border/70 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Active Days</p>
          <p className="font-display text-xl font-bold text-foreground">
            {activeDays} <span className="text-xs font-normal text-muted-foreground">days</span>
          </p>
        </div>
        <div className="rounded-md border border-border/70 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Current Streak</p>
          <p className="font-display text-xl font-bold text-foreground">
            {currentStreak} <span className="text-xs font-normal text-muted-foreground">days</span>
          </p>
        </div>
        <div className="rounded-md border border-border/70 bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Longest Streak</p>
          <p className="font-display text-xl font-bold text-foreground">
            {maxStreak} <span className="text-xs font-normal text-muted-foreground">days</span>
          </p>
        </div>
      </div>

      {/* Interactive SVG Heatmap */}
      <div className="relative overflow-x-auto rounded-md border border-border/50 bg-background/30 p-4">
        <svg
          width={totalWidth}
          height={totalHeight}
          className="block select-none"
          style={{ minWidth: labelWidth + 52 * (cellSize + cellGap) }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {/* Month Labels */}
          {months.map((m, i) => {
            const nextMonth = months[i + 1];
            const x =
              labelWidth +
              m.weekIndex * (cellSize + cellGap) +
              ((nextMonth ? nextMonth.weekIndex : weeks.length) - m.weekIndex) *
                (cellSize + cellGap) /
                2;
            return (
              <text
                key={i}
                x={x}
                y={13}
                className="fill-muted-foreground"
                fontSize={10}
                textAnchor="middle"
              >
                {m.label}
              </text>
            );
          })}

          {/* Day of week labels */}
          {[1, 3, 5].map((dayIndex) => {
            const labels = ["", "Mon", "", "Wed", "", "Fri", ""];
            return (
              <text
                key={dayIndex}
                x={0}
                y={monthHeight + dayIndex * (cellSize + cellGap) + cellSize - 2}
                className="fill-muted-foreground"
                fontSize={9}
              >
                {labels[dayIndex]}
              </text>
            );
          })}

          {/* Squares */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day) return null;
              const x = labelWidth + wi * (cellSize + cellGap);
              const y = monthHeight + di * (cellSize + cellGap);

              // Vibrant GitHub green theme palette
              const colors = [
                "fill-muted/40",
                "fill-emerald-800/50 dark:fill-emerald-950/80",
                "fill-emerald-600/70 dark:fill-emerald-700",
                "fill-emerald-500",
                "fill-emerald-400",
              ];
              const fillColor = colors[day.level] || colors[0];

              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  className={`${fillColor} transition-transform duration-100 hover:scale-125 cursor-pointer hover:stroke-foreground/60 hover:stroke-[1px]`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredDay({
                      date: day.date,
                      count: day.count,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                >
                  <title>{`${day.date}: ${day.count} contributions`}</title>
                </rect>
              );
            })
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredDay && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md transition-all duration-75"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y - 8}px`,
            }}
          >
            <span className="font-semibold text-foreground">
              {hoveredDay.count === 0 ? "No" : hoveredDay.count} contribution
              {hoveredDay.count === 1 ? "" : "s"}
            </span>{" "}
            <span className="text-muted-foreground">on {hoveredDay.date}</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Activity size={13} className="text-emerald-500" />
          Live synced with GitHub contributions
        </span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-xs bg-muted/40" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-800/50 dark:bg-emerald-950/80" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-600/70 dark:bg-emerald-700" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// --- Main GitHub Page Component ---

function GitHubPage() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [events, setEvents] = useState<GitHubActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [activityTab, setActivityTab] = useState<"all" | "commits" | "repos">("all");

  const loadData = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    setError(null);

    try {
      const [pRes, rRes, cRes, eRes] = await Promise.allSettled([
        fetchProfile(force),
        fetchRepositories(force),
        fetchContributions(force),
        fetchEvents(force),
      ]);

      if (pRes.status === "fulfilled") setProfile(pRes.value);
      if (rRes.status === "fulfilled") setRepos(rRes.value);
      if (cRes.status === "fulfilled") {
        setContributions(cRes.value.contributions);
        setTotalContributions(cRes.value.total);
      }
      if (eRes.status === "fulfilled") setEvents(eRes.value);

      const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSynced(nowStr);
      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY_LAST_SYNC, nowStr);
      }

      if (pRes.status === "rejected" && rRes.status === "rejected") {
        setError("Could not reach GitHub API. Displaying saved local portfolio data.");
      }
    } catch {
      setError("Network issue while fetching live data. Showing cached information.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSync = localStorage.getItem(CACHE_KEY_LAST_SYNC);
      if (savedSync) setLastSynced(savedSync);
    }
    loadData(false);
  }, [loadData]);

  // Aggregate repository stats
  const { totalStars, totalForks, languages } = useMemo(() => {
    let stars = 0;
    let forks = 0;
    const langCounts: Record<string, number> = {};

    for (const repo of repos) {
      stars += repo.stargazers_count || 0;
      forks += repo.forks_count || 0;
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    }

    const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
    const langList: LanguageStat[] = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLangs > 0 ? Math.round((count / totalLangs) * 100) : 0,
        color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS["default"] || "#8b949e",
      }))
      .sort((a, b) => b.count - a.count);

    return { totalStars: stars, totalForks: forks, languages: langList };
  }, [repos]);

  // Filtered activity
  const filteredEvents = useMemo(() => {
    if (activityTab === "commits") {
      return events.filter((e) => e.type === "push");
    }
    if (activityTab === "repos") {
      return events.filter((e) => e.type === "create" || e.type === "star");
    }
    return events;
  }, [events, activityTab]);

  // Fallbacks
  const displayName = profile?.name || github.handle;
  const displayHandle = profile?.login || github.handle;
  const displayAvatar = profile?.avatar_url || github.avatar;
  const displayBio = profile?.bio || github.bio;
  const displayLocation = profile?.location || github.location;
  const displayReposCount = profile?.public_repos ?? repos.length ?? github.stats.repos;
  const displayFollowers = profile?.followers ?? github.stats.followers;
  const displayFollowing = profile?.following ?? github.stats.following;

  return (
    <div className="space-y-10">
      {/* Page Header with Real-Time Indicator & Refresh Button */}
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-wide text-foreground [font-variant:small-caps]">
              {github.title}
            </h1>
            <p className="mt-1 font-serif text-sm text-muted-foreground">
              {github.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Live sync badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Real-Time Sync</span>
              {lastSynced && (
                <span className="text-muted-foreground">· {lastSynced}</span>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              title="Refresh live GitHub data"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin text-emerald-500" : ""}
              />
              {refreshing ? "Updating..." : "Refresh"}
            </button>

            {/* Profile link */}
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              github.com/{displayHandle}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-border" />
      </section>

      {/* Rate-limit or Offline Notice */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle size={16} className="shrink-0" />
          <p className="flex-1 font-serif">{error}</p>
          <button
            onClick={() => loadData(true)}
            className="rounded border border-amber-500/40 px-2 py-1 text-xs font-medium hover:bg-amber-500/20"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <section
        className="rounded-lg border border-border bg-card p-6 shadow-xs"
        style={{ borderLeftWidth: "4px", borderLeftColor: "hsl(142, 71%, 45%)" }}
      >
        {loading ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <SkeletonBlock className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-6 w-48" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-full" />
              <div className="flex gap-6 pt-2">
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-20" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <img
                src={displayAvatar}
                alt={displayHandle}
                className="h-16 w-16 rounded-full border border-border object-cover shadow-xs"
              />
              <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">@{displayHandle}</p>
                </div>
                <a
                  href={github.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent sm:mt-0"
                >
                  <Github size={14} />
                  Follow on GitHub
                </a>
              </div>

              {displayBio && (
                <p className="mt-3 text-sm leading-relaxed text-foreground">{displayBio}</p>
              )}

              {displayLocation && (
                <p className="mt-1 text-xs text-muted-foreground">📍 {displayLocation}</p>
              )}

              {/* Live Metric Badges */}
              <div className="mt-5 flex flex-wrap gap-4 text-xs sm:gap-6 sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={15} className="text-muted-foreground" />
                  <span className="font-bold text-foreground">{displayReposCount}</span>
                  <span className="text-muted-foreground">repositories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-amber-500" />
                  <span className="font-bold text-foreground">{totalStars}</span>
                  <span className="text-muted-foreground">stars earned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork size={15} className="text-muted-foreground" />
                  <span className="font-bold text-foreground">{totalForks}</span>
                  <span className="text-muted-foreground">forks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">{displayFollowers}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">{displayFollowing}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Contribution Calendar Section */}
      <section
        className="rounded-lg border border-border bg-card p-6 shadow-xs"
        style={{ borderLeftWidth: "4px", borderLeftColor: "hsl(142, 71%, 45%)" }}
      >
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-emerald-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Contribution Heatmap
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">Past 365 Days</span>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              <SkeletonBlock className="h-14 w-full" />
              <SkeletonBlock className="h-32 w-full" />
            </div>
          ) : (
            <ContributionGraph
              contributions={contributions}
              total={totalContributions}
            />
          )}
        </div>
      </section>

      {/* Language Breakdown Section */}
      {languages.length > 0 && (
        <section
          className="rounded-lg border border-border bg-card p-6 shadow-xs"
          style={{ borderLeftWidth: "4px", borderLeftColor: "hsl(142, 71%, 45%)" }}
        >
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-emerald-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Languages & Technologies
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {/* Multi-segmented Progress Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/60 p-0.5">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${Math.max(lang.percentage, 4)}%`,
                    backgroundColor: lang.color,
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                />
              ))}
            </div>

            {/* Language Labels Grid */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium text-foreground">{lang.name}</span>
                  <span className="text-muted-foreground">({lang.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured / Active Repositories Showcase */}
      <section
        className="rounded-lg border border-border bg-card p-6 shadow-xs"
        style={{ borderLeftWidth: "4px", borderLeftColor: "hsl(142, 71%, 45%)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 size={18} className="text-emerald-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Repositories ({repos.length || displayReposCount})
            </h2>
          </div>
          <a
            href={`https://github.com/${HANDLE}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            View all on GitHub ↗
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                <SkeletonBlock className="h-5 w-40" />
                <SkeletonBlock className="h-10 w-full" />
                <SkeletonBlock className="h-4 w-28" />
              </div>
            ))
          ) : repos.length > 0 ? (
            repos.map((repo) => {
              const langColor = repo.language
                ? LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS["default"] || "#8b949e"
                : null;

              return (
                <div
                  key={repo.id}
                  className="group flex flex-col justify-between rounded-lg border border-border/80 bg-background/40 p-4 transition-all hover:border-foreground/30 hover:bg-background/80 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-base font-bold text-foreground hover:text-emerald-500 hover:underline line-clamp-1"
                      >
                        {repo.name}
                      </a>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        title="Open on GitHub"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3 font-serif">
                      {repo.description || "No description provided."}
                    </p>

                    {/* Topics badges */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: langColor || "#888" }}
                          />
                          <span>{repo.language}</span>
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork size={12} />
                          <span>{repo.forks_count}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px]">
                      {formatRelativeTime(repo.pushed_at || repo.updated_at)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-2 text-sm text-muted-foreground">
              No public repositories found.
            </p>
          )}
        </div>
      </section>

      {/* Real-Time Activity Feed & Recent Commits */}
      <section
        className="rounded-lg border border-border bg-card p-6 shadow-xs"
        style={{ borderLeftWidth: "4px", borderLeftColor: "hsl(142, 71%, 45%)" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GitCommit size={18} className="text-emerald-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Live Activity Feed
            </h2>
          </div>

          {/* Activity Filter Tabs */}
          <div className="flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
            <button
              onClick={() => setActivityTab("all")}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activityTab === "all"
                  ? "bg-accent text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActivityTab("commits")}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activityTab === "commits"
                  ? "bg-accent text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Commits & Pushes
            </button>
            <button
              onClick={() => setActivityTab("repos")}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activityTab === "repos"
                  ? "bg-accent text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Repo Updates
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 border-b border-border/60 py-3">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-3 w-48" />
              </div>
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 10).map((item, idx) => (
              <div
                key={item.id || idx}
                className="group flex flex-col gap-1.5 rounded-md border border-border/40 bg-background/20 p-3 transition-colors hover:bg-background/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">
                      {item.type === "push" ? (
                        <GitCommit size={15} className="text-emerald-500" />
                      ) : item.type === "star" ? (
                        <Star size={15} className="text-amber-500" />
                      ) : (
                        <Sparkles size={15} className="text-sky-500" />
                      )}
                    </span>
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {item.message}
                    </p>
                  </div>

                  {item.sha && (
                    <a
                      href={item.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground hover:underline"
                    >
                      {item.sha}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pl-6 text-xs text-muted-foreground">
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {item.repo}
                  </a>
                  {item.branch && (
                    <span className="rounded bg-muted/50 px-1.5 py-0.2 text-[10px]">
                      branch: {item.branch}
                    </span>
                  )}
                  <span>•</span>
                  <span>{item.relativeTime}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No recent public activity recorded for this filter.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}


