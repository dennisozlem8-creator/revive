import type { GoniometerMeasurement } from "@/lib/goniometer";
import { progressSnapshot } from "@/lib/recovery-plan";

export function ProgressInsight({
  rows,
  goal,
}: {
  rows: GoniometerMeasurement[];
  goal: number;
}) {
  const progress = progressSnapshot(rows, goal);

  return (
    <section className="rm-card p-5">
      <p className="rm-label">Progress over time</p>
      <h2 className="mt-1 text-lg font-bold">Your movement trend</h2>
      <p className="mt-2 text-sm text-body">{progress.headline}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-background px-3 py-3 text-center">
          <p className="rm-stat text-brand-light">{progress.latestPeak ?? "—"}{progress.latestPeak != null ? "°" : ""}</p>
          <p className="rm-label mt-1">Latest peak</p>
        </div>
        <div className="rounded-xl bg-background px-3 py-3 text-center">
          <p className={`rm-stat ${progress.change != null && progress.change > 0 ? "text-correct" : ""}`}>
            {progress.change == null ? "—" : `${progress.change > 0 ? "+" : ""}${progress.change}°`}
          </p>
          <p className="rm-label mt-1">Since first clip</p>
        </div>
        <div className="rounded-xl bg-background px-3 py-3 text-center">
          <p className="rm-stat">{progress.latestForm ?? "—"}</p>
          <p className="rm-label mt-1">Form score</p>
        </div>
        <div className="rounded-xl bg-background px-3 py-3 text-center">
          <p className="rm-stat">{progress.weeklyCount}</p>
          <p className="rm-label mt-1">Clips this week</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        {progress.onTrack ? "On track for a readable recovery trend." : "Same camera setup, 3 clips a week, is the fastest way to show change."}{" "}
        Goal {goal}°.
      </p>
    </section>
  );
}
