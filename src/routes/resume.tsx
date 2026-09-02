import { createFileRoute } from "@tanstack/react-router";
import { Printer, Mail, Phone, ExternalLink, Github, Linkedin, BookOpen, Download } from "lucide-react";
import { resume, site } from "../data/portfolio";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Academic Curriculum Vitae" },
      {
        name: "description",
        content:
          "Curriculum Vitae for Arpan Mukherjee — B.Sc. Statistics & CS, Ramakrishna Mission Residential College Narendrapur. Research projects, coursework, leadership, and technical competencies.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Academic Curriculum Vitae" },
      {
        property: "og:description",
        content:
          "Curriculum Vitae for Arpan Mukherjee — B.Sc. Statistics & CS, Ramakrishna Mission Residential College Narendrapur. Research projects, coursework, leadership, and technical competencies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResumePage,
});

function CVSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-3">
      <h2 className="font-display text-base font-bold uppercase tracking-widest text-foreground">
        {children}
      </h2>
      <div className="mt-1 h-[1.5px] w-full bg-foreground/70 dark:bg-foreground/50" />
    </div>
  );
}

function ResumePage() {
  return (
    <div className="space-y-8">
      {/* Top Controls Toolbar (No-Print) */}
      <div className="no-print flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Curriculum Vitae
          </h1>
          <p className="font-serif text-xs text-muted-foreground">
            Standard Academic Format · Last Revised: March 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Academic CV Sheet */}
      <div className="rounded-md border border-border/80 bg-card p-6 shadow-xs sm:p-10 font-serif text-foreground">
        {/* CV Header */}
        <header className="border-b border-foreground/30 pb-5 text-center space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Arpan Mukherjee
          </h1>
          <p className="font-serif text-sm font-medium text-muted-foreground">
            B.Sc. in Statistics (Major) · Computer Science (Minor)
          </p>
          <p className="font-serif text-xs text-muted-foreground">
            Ramakrishna Mission Residential College (Autonomous), Narendrapur · Kolkata 700103, India
          </p>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 font-mono text-xs text-muted-foreground">
            <a href={`mailto:${resume.contact.email}`} className="hover:text-foreground hover:underline">
              {resume.contact.email}
            </a>
            <span>•</span>
            <a href={`tel:${resume.contact.phone.replace(/\D/g, "")}`} className="hover:text-foreground hover:underline">
              {resume.contact.phone}
            </a>
            <span>•</span>
            <a href={resume.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline">
              github.com/Arpan-0710 ↗
            </a>
            <span>•</span>
            <a href={resume.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline">
              linkedin.com/in/arpan0710 ↗
            </a>
            <span>•</span>
            <a href={resume.contact.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline">
              leetcode.com/Arpan_Mukherjee ↗
            </a>
          </div>
        </header>

        {/* Education Section */}
        <section>
          <CVSectionHeading>Academic History</CVSectionHeading>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-serif sm:text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono text-[11px] uppercase">
                  <th className="py-2 pr-3">Duration</th>
                  <th className="py-2 pr-3">Degree / Examination</th>
                  <th className="py-2 pr-3">Institution / Board</th>
                  <th className="py-2 text-right">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {resume.education.map((row, i) => (
                  <tr key={i} className="hover:bg-accent/30">
                    <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {row.year}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-foreground">
                      {row.degree}
                    </td>
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      {row.institute}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-foreground">
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Research & Engineering Projects Section */}
        <section>
          <CVSectionHeading>Research & Engineering Projects</CVSectionHeading>
          <div className="space-y-6 text-sm">
            {resume.projects.map((project, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {project.title}
                    </h3>
                    <span className="font-serif text-xs italic text-muted-foreground">
                      · {project.association}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {project.period}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="rounded bg-emerald-600/10 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                    {project.metrics}
                  </span>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    Source Code ↗
                  </a>
                </div>
                <p className="font-serif text-xs leading-relaxed text-foreground sm:text-sm">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Competencies Matrix */}
        <section>
          <CVSectionHeading>Technical Expertise</CVSectionHeading>
          <div className="grid gap-2.5 text-xs font-serif sm:text-sm">
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[170px_1fr] gap-2">
              <span className="font-mono font-semibold text-muted-foreground uppercase text-[11px]">
                Languages:
              </span>
              <span className="text-foreground">{resume.technicalSkills.languages}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[170px_1fr] gap-2">
              <span className="font-mono font-semibold text-muted-foreground uppercase text-[11px]">
                Tools & Frameworks:
              </span>
              <span className="text-foreground">{resume.technicalSkills.toolsAndFrameworks}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[170px_1fr] gap-2">
              <span className="font-mono font-semibold text-muted-foreground uppercase text-[11px]">
                Libraries & Packages:
              </span>
              <span className="text-foreground">{resume.technicalSkills.librariesAndPackages}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[170px_1fr] gap-2">
              <span className="font-mono font-semibold text-muted-foreground uppercase text-[11px]">
                Operating Systems:
              </span>
              <span className="text-foreground">{resume.technicalSkills.operatingSystems}</span>
            </div>
          </div>
        </section>

        {/* Key Coursework */}
        <section>
          <CVSectionHeading>Curriculum & Key Coursework</CVSectionHeading>
          <p className="font-serif text-xs leading-relaxed text-foreground sm:text-sm">
            {resume.keyCourses}
          </p>
        </section>

        {/* Positions of Responsibility */}
        <section>
          <CVSectionHeading>Positions of Responsibility & Service</CVSectionHeading>
          <ul className="space-y-2 font-serif text-xs sm:text-sm">
            {resume.positions.map((pos, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <div>
                  <span className="font-semibold text-foreground">{pos.role}</span>,{" "}
                  <span className="text-muted-foreground">{pos.institution}</span>{" "}
                  <span className="font-mono text-xs text-muted-foreground">({pos.period})</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Honors & Accolades */}
        <section>
          <CVSectionHeading>Honors & Competitive Accolades</CVSectionHeading>
          <ul className="space-y-2 font-serif text-xs sm:text-sm">
            {resume.achievements.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

