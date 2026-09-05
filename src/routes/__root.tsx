import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun, Mail, Menu, X, Compass } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BackgroundSystem } from "../lib/BackgroundSystem";
import { site, pages } from "../data/portfolio";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Document Not Found</h2>
        <p className="mt-2 font-serif text-sm text-muted-foreground">
          The requested dossier or document does not exist in this catalog.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-xs uppercase tracking-wider font-medium text-foreground transition-colors hover:bg-accent"
          >
            Return to Index
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Execution Error
        </h1>
        <p className="mt-2 font-serif text-sm text-muted-foreground">
          An error occurred while rendering this document. You may retry or return to the main index.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retry Execution
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Arpan Mukherjee — Academic Portfolio & Research" },
      {
        name: "description",
        content:
          "Academic portfolio, coursework, provisional grade card, machine learning research projects, and competitive programming standing for Arpan Mukherjee.",
      },
      { name: "author", content: site.name },
      { property: "og:title", content: "Arpan Mukherjee — Academic Portfolio & Research" },
      {
        property: "og:description",
        content:
          "Academic portfolio, coursework, provisional grade card, machine learning research projects, and competitive programming standing for Arpan Mukherjee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const initial =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", next);
    }
  };

  return { theme, toggle };
}

function Header() {
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPage = pages.find((p) => p.path === location.pathname);
  const pageLabel = currentPage ? currentPage.label : location.pathname === "/" ? "About & Overview" : "";

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5 sm:px-8">
        {/* Title / Identity */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group flex items-baseline gap-2 text-foreground transition-opacity hover:opacity-80"
          >
            <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {site.name}
            </span>
            <span className="hidden font-serif text-xs italic text-muted-foreground sm:inline">
              · RKMRC Narendrapur
            </span>
          </Link>
          {pageLabel && (
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
              <span>/</span>
              <span className="font-medium text-foreground">{pageLabel}</span>
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Quick Nav Drawer Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            {menuOpen ? <X size={14} /> : <Compass size={14} />}
            <span className="hidden sm:inline">Sections</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card/60 text-foreground transition-colors hover:bg-accent"
          >
            {theme === "light" ? <Moon size={15} strokeWidth={1.75} /> : <Sun size={15} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Expanded Sections Directory */}
      {menuOpen && (
        <div className="border-t border-border bg-background/95 px-6 py-4 shadow-lg backdrop-blur-md sm:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Document Directory
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-accent text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                About & Overview
              </Link>
              {pages.map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    location.pathname === p.path
                      ? "bg-accent text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ColophonFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-background/60 py-12 text-xs text-muted-foreground">
      <div className="mx-auto max-w-4xl px-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="font-display text-sm font-semibold text-foreground">
              {site.name}
            </p>
            <p className="font-serif text-xs text-muted-foreground">
              B.Sc. (Hons.) in Statistics · Minor in Computer Science
            </p>
            <p className="font-serif text-xs text-muted-foreground">
              Ramakrishna Mission Residential College (Autonomous), Narendrapur
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-serif text-xs text-muted-foreground sm:text-right">
            <a href={`mailto:${site.emailPrimary}`} className="hover:text-foreground hover:underline">
              {site.emailPrimary}
            </a>
            <a
              href={site.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline"
            >
              GitHub ↗
            </a>
            <a
              href={site.socials.codeforces.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline"
            >
              Codeforces ↗
            </a>
            <a
              href={site.socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/40 pt-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Affiliations: BUILD BANK 2026 (IIT Delhi) · IDEAS TIH (ISI Kolkata) · Royal Statistical Society (UK).
          </p>
          <p className="font-mono text-[10px]">
            Typeset in Computer Modern & Source Serif
          </p>
        </div>
      </div>
    </footer>
  );
}

function FloatingEmail() {
  return (
    <a
      href={`mailto:${site.emailPrimary}`}
      aria-label="Send direct academic email"
      title="Contact via email"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition-all hover:scale-105 hover:bg-accent"
    >
      <Mail size={18} strokeWidth={1.5} />
    </a>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundSystem />
      <Header />
      <main className="relative min-h-screen px-6 pb-12 pt-24 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          <Outlet />
        </div>
      </main>
      <ColophonFooter />
      <FloatingEmail />
    </QueryClientProvider>
  );
}
