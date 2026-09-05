import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, Linkedin, Code2, ExternalLink, Mail, Phone, BookOpen, GraduationCap, Award, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { about, pages, site } from "../data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Academic Dossier & Research Overview" },
      {
        name: "description",
        content:
          "Arpan Mukherjee — B.Sc. Statistics & Computer Science, Ramakrishna Mission Residential College Narendrapur. Machine learning research, mathematical statistics, and competitive programming.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Academic Dossier & Research Overview" },
      {
        property: "og:description",
        content:
          "Arpan Mukherjee — B.Sc. Statistics & Computer Science, Ramakrishna Mission Residential College Narendrapur. Machine learning research, mathematical statistics, and competitive programming.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="academic-section-heading mt-10 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      {children}
    </h2>
  );
}

function Rule() {
  return <div className="academic-rule" />;
}

function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Header Profile / Academic Identity */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Arpan Mukherjee
            </h1>
            <p className="font-serif text-lg text-muted-foreground">
              B.Sc. in Statistics (Major) · Computer Science (Minor)
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded border border-border bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Active AY 2025–2029
          </span>
        </div>
        <p className="font-serif text-sm italic text-muted-foreground">
          Ramakrishna Mission Residential College (Autonomous), Narendrapur · University of Calcutta
        </p>
        <Rule />

        {/* Narrative Biography */}
        <div className="space-y-4 font-serif text-base leading-relaxed text-foreground sm:text-lg">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Institutional Affiliations & Core Summary Grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="academic-card space-y-2 group">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <GraduationCap size={15} className="text-emerald-600 dark:text-emerald-400" />
              Undergraduate
            </span>
            <span className="font-mono text-[10px] opacity-40 group-hover:opacity-80 transition-opacity">01</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground">9.46 Cumulative CPI</p>
          <p className="mt-1 font-serif text-xs text-muted-foreground">
            Major: 9.45 (Current) · Minor (CS): 9.50 (Current)
          </p>
          <Link
            to="/education"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            View Provisional Grade Card →
          </Link>
        </div>

        <div className="academic-card space-y-2 group" style={{ borderLeftColor: "hsl(215, 60%, 45%)" }}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-sky-600 dark:text-sky-400" />
              Research Affiliations
            </span>
            <span className="font-mono text-[10px] opacity-40 group-hover:opacity-80 transition-opacity">02</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground">IIT Delhi & ISI Kolkata</p>
          <p className="mt-1 font-serif text-xs text-muted-foreground">
            BUILD BANK 2026 (ARTHASETU 2.0) · IDEAS TIH (PSO Disaster Model)
          </p>
          <Link
            to="/projects"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            Read Research Case Studies →
          </Link>
        </div>

        <div className="academic-card space-y-2 group" style={{ borderLeftColor: "hsl(35, 65%, 45%)" }}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <Award size={15} className="text-amber-600 dark:text-amber-400" />
              Competitive Standings
            </span>
            <span className="font-mono text-[10px] opacity-40 group-hover:opacity-80 transition-opacity">03</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground">LeetCode & Codeforces</p>
          <p className="mt-1 font-serif text-xs text-muted-foreground">
            300+ LeetCode Solved (50-Day Badge) · Codeforces Active Newbie
          </p>
          <Link
            to="/codeforces"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            Live Codeforces Breakdown →
          </Link>
        </div>
      </section>

      {/* Academic & Professional Profiles */}
      <section>
        <SectionHeading>Academic & Engineering Profiles</SectionHeading>
        <Rule />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <a
            href={site.socials.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-border/80 bg-card/80 backdrop-blur-sm p-3.5 text-sm font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent/80 hover:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Github size={16} />
              GitHub
            </span>
            <span className="text-xs text-muted-foreground">↗</span>
          </a>

          <a
            href={site.socials.codeforces.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-border/80 bg-card/80 backdrop-blur-sm p-3.5 text-sm font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent/80 hover:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Code2 size={16} />
              Codeforces
            </span>
            <span className="text-xs text-muted-foreground">↗</span>
          </a>

          <a
            href={site.socials.leetcode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-border/80 bg-card/80 backdrop-blur-sm p-3.5 text-sm font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent/80 hover:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <BookOpen size={16} />
              LeetCode
            </span>
            <span className="text-xs text-muted-foreground">↗</span>
          </a>

          <a
            href={site.socials.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-border/80 bg-card/80 backdrop-blur-sm p-3.5 text-sm font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-accent/80 hover:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Linkedin size={16} />
              LinkedIn
            </span>
            <span className="text-xs text-muted-foreground">↗</span>
          </a>
        </div>
      </section>

      {/* Structured Catalog of Sections */}
      <section>
        <SectionHeading>Curriculum & Portfolio Catalog</SectionHeading>
        <Rule />
        <div className="divide-y divide-border/60 rounded-md border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
          {pages.map((page, idx) => (
            <Link
              key={page.path}
              to={page.path}
              className="group flex flex-col justify-between p-4 transition-colors hover:bg-accent/70 sm:flex-row sm:items-center"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">0{idx + 1}.</span>
                  <span className="font-display text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {page.label}
                  </span>
                </div>
                <p className="font-serif text-xs text-muted-foreground pl-6 sm:pl-0">
                  {page.description}
                </p>
              </div>
              <span className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-foreground sm:mt-0 sm:pl-4 transition-colors">
                Access Document →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Academic Communications & Contact */}
      <section>
        <SectionHeading>Academic Communications</SectionHeading>
        <Rule />
        <p className="font-serif text-base text-foreground">
          For academic inquiries, collaborative research, or recruitment discussions, please contact directly via email or submit a formal dispatch below.
        </p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-serif text-sm text-foreground">
          <a href={`mailto:${site.emailPrimary}`} className="inline-flex items-center gap-1.5 hover:underline">
            <Mail size={15} className="text-muted-foreground" />
            {site.emailPrimary} <span className="text-xs text-muted-foreground">(Primary)</span>
          </a>
          <a href={`mailto:${site.emailSecondary}`} className="inline-flex items-center gap-1.5 hover:underline">
            <Mail size={15} className="text-muted-foreground" />
            {site.emailSecondary} <span className="text-xs text-muted-foreground">(Secondary)</span>
          </a>
          <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-1.5 hover:underline">
            <Phone size={15} className="text-muted-foreground" />
            {site.phone}
          </a>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Your dispatch has been noted. Please follow up directly via email for high-priority correspondence.");
          }}
          className="mt-6 space-y-4 rounded-md border border-border/80 bg-card p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block font-mono text-xs text-muted-foreground mb-1">
                Sender Identity / Institution
              </label>
              <input
                id="name"
                type="text"
                placeholder="Dr. / Prof. / Full Name"
                required
                className="w-full rounded border border-border bg-background px-3 py-2 font-serif text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-mono text-xs text-muted-foreground mb-1">
                Official Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="address@institution.edu"
                required
                className="w-full rounded border border-border bg-background px-3 py-2 font-serif text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block font-mono text-xs text-muted-foreground mb-1">
              Communication Subject & Context
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Outline the research inquiry, opportunity, or correspondence..."
              required
              className="w-full rounded border border-border bg-background px-3 py-2 font-serif text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded border border-border bg-card px-5 py-2 text-xs uppercase tracking-wider font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Submit Academic Dispatch
          </button>
        </form>
      </section>
    </div>
  );
}

