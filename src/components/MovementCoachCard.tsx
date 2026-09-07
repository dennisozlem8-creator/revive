import type { MovementCoachReport } from "@/lib/movement-coach";

const TONE: Record<string, string> = {
  ok: "border-correct/30 bg-correct/10 text-correct",
  watch: "border-almost/35 bg-almost/10 text-almost",
  unusual: "border-alert/35 bg-alert/10 text-alert",
};

export function MovementCoachCard({
  report,
  selectedExercise,
}: {
  report: MovementCoachReport;
  selectedExercise: string;
}) {
  const unusual = report.findings.filter((finding) => finding.severity === "unusual");
  const watches = report.findings.filter((finding) => finding.severity === "watch");
  const oks = report.findings.filter((finding) => finding.severity === "ok");

  return (
    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-background px-4 py-4 sm:px-5">
      <p className="rm-label">Movement coach</p>
      <h3 className="mt-1 text-lg font-bold">What the AI saw</h3>
      <p className="mt-2 text-sm text-body">{report.headline}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-surface-elevated px-3 py-1 text-foreground">
          Looks like {report.detectedExercise}
          {report.confidence !== "high" ? ` · ${report.confidence} confidence` : ""}
        </span>
        <span className="rounded-full bg-surface-elevated px-3 py-1 text-foreground">
          You selected {selectedExercise}
        </span>
        <span className="rounded-full bg-surface-elevated px-3 py-1 text-foreground">
          Tracking {report.trackingQuality}
        </span>
      </div>

      {unusual.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-alert">Unusual on the recorded part</p>
          <ul className="mt-2 space-y-2">
            {unusual.map((finding) => (
              <li key={finding.id} className={`rounded-xl border px-3 py-3 ${TONE.unusual}`}>
                <p className="font-semibold">
                  {finding.title}
                  {finding.timeSec != null ? ` · ${finding.timeSec.toFixed(1)}s` : ""}
                </p>
                <p className="mt-1 text-sm text-body">{finding.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {watches.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-almost">Form notes</p>
          <ul className="mt-2 space-y-2">
            {watches.map((finding) => (
              <li key={finding.id} className={`rounded-xl border px-3 py-3 ${TONE.watch}`}>
                <p className="font-semibold">
                  {finding.title}
                  {finding.timeSec != null ? ` · ${finding.timeSec.toFixed(1)}s` : ""}
                </p>
                <p className="mt-1 text-sm text-body">{finding.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {oks.length > 0 && (
        <ul className="mt-4 space-y-2">
          {oks.map((finding) => (
            <li key={finding.id} className={`rounded-xl border px-3 py-3 ${TONE.ok}`}>
              <p className="font-semibold">{finding.title}</p>
              <p className="mt-1 text-sm text-body">{finding.detail}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        <p className="text-sm font-semibold text-foreground">Feedback for this exercise</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-body">
          {report.feedback.map((cue) => (
            <li key={cue}>{cue}</li>
          ))}
        </ol>
      </div>

      <p className="mt-4 text-xs text-muted">
        On-device pose AI reads the hip, knee, and ankle. This is coaching for your home program,
        not a diagnosis.
      </p>
    </div>
  );
}
