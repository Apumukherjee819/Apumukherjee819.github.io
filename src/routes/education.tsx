import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Award, Building, CheckCircle2, ShieldCheck } from "lucide-react";
import { education } from "../data/portfolio";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Arpan Mukherjee — Academic Curriculum & Official Grade Card" },
      {
        name: "description",
        content:
          "Official academic standing, degree curriculum, and provisional grade card for Arpan Mukherjee at Ramakrishna Mission Residential College (Autonomous), Narendrapur.",
      },
      { property: "og:title", content: "Arpan Mukherjee — Academic Curriculum & Official Grade Card" },
      {
        property: "og:description",
        content:
          "Official academic standing, degree curriculum, and provisional grade card for Arpan Mukherjee at Ramakrishna Mission Residential College (Autonomous), Narendrapur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EducationPage,
});

function EducationPage() {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl [font-variant:small-caps]">
            {education.title} & Curriculum
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Institutional Record · AY 2025–2029
          </span>
        </div>
        <div className="academic-rule" />
        <p className="font-serif text-base text-foreground leading-relaxed">
          Detailed academic transcripts, coursework curriculum, and provisional grade card records from the Department of Statistics & Department of Computer Science.
        </p>
      </section>

      {/* Degrees & Programs Breakdown */}
      <div className="space-y-6">
        {education.degrees.map((degree, idx) => (
          <section
            key={idx}
            className="academic-card space-y-4"
            style={{
              borderLeftColor:
                idx === 0
                  ? "hsl(142, 65%, 32%)"
                  : idx === 1
                  ? "hsl(215, 60%, 35%)"
                  : "hsl(35, 60%, 40%)",
            }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {degree.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 font-serif text-sm text-muted-foreground">
                  <Building size={14} className="text-muted-foreground" />
                  {degree.institution}
                </p>
              </div>
              <span className="inline-flex rounded border border-border bg-card/60 px-2.5 py-0.5 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                {degree.badge}
              </span>
            </div>

            {/* Score and Timeline Banner */}
            <div className="flex flex-wrap items-center gap-6 border-y border-border/50 py-2.5 text-sm font-serif">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {degree.scoreLabel}:
                </span>{" "}
                <span className="font-display text-base font-bold text-foreground">
                  {degree.score}
                </span>{" "}
                <span className="text-xs text-muted-foreground">{degree.scoreSuffix}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {degree.yearLabel}:
                </span>{" "}
                <span className="font-mono text-sm font-medium text-foreground">
                  {degree.year}
                </span>
              </div>
            </div>

            <p className="font-serif text-base leading-relaxed text-foreground">
              {degree.description}
            </p>

            {degree.courses && degree.courses.length > 0 && (
              <div className="mt-3 overflow-x-auto rounded border border-border/60 bg-background/50">
                <table className="w-full border-collapse font-serif text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2 font-mono">Code</th>
                      <th className="px-4 py-2">Course Name</th>
                      <th className="px-4 py-2">Session</th>
                      <th className="px-4 py-2 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {degree.courses.map((course, i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className="px-4 py-2 font-mono text-xs font-medium text-foreground">
                          {course.code}
                        </td>
                        <td className="px-4 py-2 text-foreground">{course.course}</td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {course.session}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="inline-block rounded border border-emerald-600/30 bg-emerald-600/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {course.gr}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Official Provisional Grade Card */}
      <section className="gradecard-container p-6 sm:p-8 space-y-6">
        {/* Security Guilloche Pattern & Watermark Background Layer */}
        <div className="absolute inset-0 bg-guilloche opacity-[0.25] dark:opacity-[0.15] pointer-events-none" />
        <div className="gradecard-watermark">PROVISIONAL TRANSCRIPT</div>

        <div className="relative z-10 space-y-6">
          {/* Institutional Seal & Heading */}
          <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/rkmrc-logo.png"
                alt="RKMRC Official Seal"
                className="h-16 w-16 shrink-0 object-contain drop-shadow-sm"
              />
              <div>
                <p className="font-display text-lg font-bold text-foreground sm:text-xl">
                  Ramakrishna Mission Residential College (Autonomous)
                </p>
                <p className="font-serif text-xs italic text-muted-foreground">
                  Narendrapur, Kolkata 700103 · Autonomous College Affiliated to University of Calcutta
                </p>
                <p className="mt-1 font-mono text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  PROVISIONAL STATEMENT OF MARKS / GRADE CARD
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-start rounded border border-border/80 bg-background/80 backdrop-blur-sm px-3 py-1.5 font-mono text-[11px] text-muted-foreground sm:self-center shadow-xs">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Authenticated Institutional Record</span>
            </div>
          </div>

          {/* Student Identification Record Table */}
          <div className="grid gap-3 rounded-md border border-border/70 bg-background/60 backdrop-blur-sm p-4 text-xs font-serif sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <span className="font-mono text-muted-foreground">Candidate Name:</span>
                <span className="font-bold text-foreground">{education.gradeCard.name}</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <span className="font-mono text-muted-foreground">Roll Number:</span>
                <span className="font-mono font-semibold text-foreground">
                  {education.gradeCard.rollNo}
                </span>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <span className="font-mono text-muted-foreground">Major Subject:</span>
                <span className="font-medium text-foreground">{education.gradeCard.discipline}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <span className="font-mono text-muted-foreground">Academic Dept:</span>
                <span className="font-medium text-foreground">{education.gradeCard.division}</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <span className="font-mono text-muted-foreground">Admission Date:</span>
                <span className="font-medium text-foreground">{education.gradeCard.admission}</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <span className="font-mono text-muted-foreground">Course Duration:</span>
                <span className="font-medium text-foreground">{education.gradeCard.minDuration}</span>
              </div>
            </div>
          </div>

          {/* Semester Course Details Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {education.gradeCard.semesters.map((sem, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-md border border-border/80 bg-background/70 backdrop-blur-sm p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/70 pb-2">
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {sem.title}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      Total Credits: {sem.totalCredits}
                    </span>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full border-collapse font-serif text-xs">
                      <thead>
                        <tr className="border-b border-border/70 text-left text-muted-foreground">
                          <th className="pb-1.5 pr-2 font-mono">Code</th>
                          <th className="pb-1.5 pr-2">Course</th>
                          <th className="pb-1.5 pr-2 text-right font-mono">Cr.</th>
                          <th className="pb-1.5 text-right font-mono">Gr.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {sem.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-accent/40 transition-colors">
                            <td className="py-1.5 pr-2 font-mono text-[11px] text-foreground font-medium">
                              {row.code}
                            </td>
                            <td className="py-1.5 pr-2 text-foreground leading-tight">
                              {row.course}
                            </td>
                            <td className="py-1.5 pr-2 text-right font-mono text-muted-foreground">
                              {row.cr}
                            </td>
                            <td className="py-1.5 text-right">
                              <span
                                className={`inline-block rounded px-1.5 py-0.5 font-mono text-[11px] font-bold ${
                                  row.gr === "O"
                                    ? "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30"
                                    : "bg-sky-600/15 text-sky-700 dark:text-sky-400 border border-sky-600/30"
                                }`}
                              >
                                {row.gr}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Semester SPI Summary Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-2.5 font-serif text-xs">
                  <span className="font-mono text-muted-foreground">Semester Performance:</span>
                  <span className="font-mono font-bold text-foreground">
                    S.P.I = <span className="text-emerald-700 dark:text-emerald-400">{sem.spi}</span>{" "}
                    / 10.00
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Cumulative Performance Summary Index */}
          {education.gradeCard.summary && (
            <div className="rounded-md border border-border/80 bg-background/70 backdrop-blur-sm p-4 space-y-3 shadow-xs">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cumulative Academic Progression Index
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-serif text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-4 font-normal">Index Identifier</th>
                      {education.gradeCard.summary.header.map((h, i) => (
                        <th key={i} className="py-2 pr-4 text-right font-mono font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {education.gradeCard.summary.rows.map((row, i) => (
                      <tr key={i}>
                        <td className="py-2.5 pr-4 font-mono font-bold text-foreground">
                          {row.label}
                        </td>
                        {row.values.map((val, j) => (
                          <td key={j} className="py-2.5 pr-4 text-right font-mono text-foreground">
                            {j === 1 && val === "9.46" ? (
                              <span className="rounded border border-emerald-600/30 bg-emerald-600/15 px-2.5 py-1 font-bold text-emerald-700 dark:text-emerald-400">
                                {val} (C.P.I)
                              </span>
                            ) : val ? (
                              val
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10-Point Grade Key Standard */}
          {education.gradeCard.gradePoints && (
            <div className="border-t border-border/50 pt-4 text-xs font-serif text-muted-foreground">
              <p className="mb-2 font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Standard 10-Point Grading System Key
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {education.gradeCard.gradePoints.map((gp, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded border border-border/60 bg-background/90 px-2 py-1 font-mono text-[11px]"
                  >
                    <span className="font-bold text-foreground">{gp.grade}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-foreground">{gp.points} pts</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

