import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Award, BookOpen, ExternalLink, ShieldCheck, Terminal, FileText, CheckCircle2 } from "lucide-react";
import { education } from "../data/portfolio";
import { AnimatedSection, StaggerContainer } from "../lib/PageTransition";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Academic Record & Grade Card" },
      {
        name: "description",
        content:
          "Undergraduate degree in Statistics (Major) and Computer Science (Minor) at Ramakrishna Mission Residential College (Autonomous), Narendrapur. Provisional Grade Card and coursework.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Academic Record & Grade Card" },
      {
        property: "og:description",
        content:
          "Undergraduate degree in Statistics (Major) and Computer Science (Minor) at Ramakrishna Mission Residential College (Autonomous), Narendrapur. Provisional Grade Card and coursework.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EducationPage,
});

function EducationPage() {
  const gradeCard = education.gradeCard;

  return (
    <div className="space-y-12 perspective-container">
      {/* Page Title */}
      <AnimatedSection animation="hologramPop">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
              {education.title} & Academic Record
            </h1>
            <span className="scifi-hud-badge">
              <span className="scifi-pulse-dot" />
              VERIFIED // RKMRC AUTONOMOUS
            </span>
          </div>
          <div className="academic-rule" />
          <p className="font-serif text-base text-foreground leading-relaxed">
            Formal undergraduate academic transcripts, coursework curriculum, and continuous performance index records.
          </p>
        </section>
      </AnimatedSection>

      {/* Degrees Overview */}
      <div className="space-y-6">
        {(education.degrees || []).map((deg, idx) => (
          <AnimatedSection
            key={idx}
            animation={idx % 2 === 0 ? "cyberSlideLeft" : "cyberSlideRight"}
            delay={idx * 0.1}
          >
            <div
              className="academic-card space-y-4 card-3d hud-corner-brackets"
              style={{
                borderLeftColor:
                  idx === 0
                    ? "var(--cyber-emerald)"
                    : idx === 1
                    ? "var(--cyber-cyan)"
                    : "var(--cyber-amber)",
              }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyber-cyan font-bold">
                    {deg.badge}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {deg.title}
                  </h2>
                  <p className="font-serif text-sm italic text-muted-foreground">
                    {deg.institution}
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono">
                  <div className="text-xs text-muted-foreground">{deg.scoreLabel || "CPI / SCORE"}</div>
                  <div className="text-xl font-bold text-cyber-emerald">
                    {deg.score} <span className="text-xs font-normal text-muted-foreground">{deg.scoreSuffix}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{deg.year}</div>
                </div>
              </div>

              <p className="font-serif text-sm leading-relaxed text-foreground">
                {deg.description}
              </p>

              {deg.courses && deg.courses.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Elective Modules
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {deg.courses.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1 font-mono text-xs"
                      >
                        <span className="font-bold text-cyber-cyan">{c.code}:</span>
                        <span>{c.course}</span>
                        {c.gr && <span className="text-cyber-emerald font-bold">[{c.gr}]</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Official Grade Card Transcript Display */}
      {gradeCard && (
        <AnimatedSection animation="cyberSlideLeft">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="academic-section-heading text-2xl font-bold tracking-tight text-foreground">
                Official Grade Transcript
              </h2>
              <span className="scifi-hud-badge">
                ROLL: {gradeCard.rollNo || "2R26STSA2026"}
              </span>
            </div>
            <div className="academic-rule" />

            <div className="academic-card space-y-6 card-3d hud-corner-brackets p-6 sm:p-8" style={{ borderLeftColor: "var(--cyber-cyan)" }}>
              {/* Institution and Student Meta Header */}
              <div className="border-b border-border/70 pb-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                      Ramakrishna Mission Residential College (Autonomous)
                    </h3>
                    <p className="font-serif text-sm italic text-muted-foreground">
                      Affiliated to the University of Calcutta • Narendrapur, Kolkata
                    </p>
                    <p className="mt-1 font-mono text-xs text-cyber-cyan font-bold">
                      {gradeCard.division || "Department of Statistics"} — 4-Year B.Sc.
                    </p>
                  </div>
                  <div className="rounded-md border border-border/90 bg-secondary/70 p-3 font-mono text-xs space-y-1">
                    <p>
                      <span className="text-muted-foreground">Candidate: </span>
                      <strong className="text-foreground">{gradeCard.name || "Arpan Mukherjee"}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Roll No: </span>
                      <strong className="text-cyber-cyan">{gradeCard.rollNo || "2R26STSA2026"}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Discipline: </span>
                      {gradeCard.discipline || "Statistics (Major)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Semesters Data */}
              <div className="space-y-8">
                {(gradeCard.semesters || []).map((sem, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <h4 className="font-display text-base font-bold text-foreground">
                        {sem.title}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-cyber-emerald">
                        SPI: {sem.spi} (Credits: {sem.totalCredits})
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full font-serif text-sm">
                        <thead>
                          <tr className="border-b border-border/70 text-left font-mono text-xs text-muted-foreground">
                            <th className="py-2 pr-4">Course Code</th>
                            <th className="py-2 pr-4">Course Title</th>
                            <th className="py-2 pr-4 text-center">Credits</th>
                            <th className="py-2 text-right">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {sem.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-secondary/40 transition-colors">
                              <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">
                                {row.code}
                              </td>
                              <td className="py-2.5 pr-4 font-medium text-foreground">
                                {row.course}
                              </td>
                              <td className="py-2.5 pr-4 text-center font-mono text-xs">
                                {row.cr}
                              </td>
                              <td className="py-2.5 text-right font-mono text-xs font-bold text-cyber-emerald">
                                {row.gr}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cumulative Summary */}
              {gradeCard.summary && (
                <div className="mt-8 rounded-md border border-border/80 bg-background/80 p-4">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Performance Metric Summary
                  </h4>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between border-b sm:border-b-0 sm:border-r border-border/60 pr-4 pb-2 sm:pb-0">
                      <span className="font-serif text-sm text-muted-foreground">Semester I SPI</span>
                      <span className="font-mono text-lg font-bold text-cyber-emerald">9.61</span>
                    </div>
                    <div className="flex items-center justify-between pl-0 sm:pl-4">
                      <span className="font-serif text-sm text-muted-foreground">Cumulative CPI</span>
                      <span className="font-mono text-lg font-bold text-cyber-cyan">9.46</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>
      )}
    </div>
  );
}
