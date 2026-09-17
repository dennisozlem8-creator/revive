import type { GoniometerMeasurement } from "@/lib/goniometer";
import { progressSnapshot } from "@/lib/recovery-plan";
import { DashCard, DashSpark } from "@/components/clinic/DashKit";

export function ProgressInsight({
  rows,
  goal,
}: {
  rows: GoniometerMeasurement[];
  goal: number;
}) {
  const progress = progressSnapshot(rows, goal);
  const peaks = rows
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((row) => row.angle);

  return (
    <DashCard className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[#2f4a60]">Progress over time</p>
      <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">Your movement trend</h2>
      <p className="mt-2 text-base leading-7 text-[#1b3348]">{progress.headline}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric value={progress.latestPeak != null ? `${progress.latestPeak}°` : "—"} label="Latest peak" />
        <Metric
          value={progress.change == null ? "—" : `${progress.change > 0 ? "+" : ""}${progress.change}°`}
          label="Since first clip"
        />
        <Metric value={progress.latestForm ?? "—"} label="Form score" />
        <Metric value={progress.weeklyCount} label="Clips this week" />
      </div>
      <div className="mt-4">
        <DashSpark values={peaks} label="Saved peak angle" unit="°" />
      </div>
      <p className="mt-3 text-sm text-[#2f4a60]">
        {progress.onTrack
          ? "On track for a readable recovery trend."
          : "Same camera setup, three clips a week, is the fastest way to show change."}{" "}
        Goal {goal}°.
      </p>
    </DashCard>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-[1.15rem] bg-[#f7fbfe] px-3 py-3 text-center">
      <p className="rm-serif text-2xl font-semibold tabular-nums text-[#1b3348]">{value}</p>
      <p className="mt-1 text-sm font-medium text-[#2f4a60]">{label}</p>
    </div>
  );
}
