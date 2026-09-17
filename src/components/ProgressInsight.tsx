import type { GoniometerMeasurement } from "@/lib/goniometer";
import { progressSnapshot } from "@/lib/recovery-plan";
import { DashCard, DashSpark } from "@/components/clinic/DashKit";
import { t, tf, type Locale } from "@/lib/i18n";

export function ProgressInsight({
  rows,
  goal,
  locale = "en",
}: {
  rows: GoniometerMeasurement[];
  goal: number;
  locale?: Locale;
}) {
  const progress = progressSnapshot(rows, goal, locale);
  const peaks = rows
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((row) => row.angle);

  return (
    <DashCard className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[#2f4a60]">{t("progressOverTime", locale)}</p>
      <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">{t("movementTrend", locale)}</h2>
      <p className="mt-2 text-base leading-7 text-[#1b3348]">{progress.headline}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric value={progress.latestPeak != null ? `${progress.latestPeak}°` : "—"} label={t("latestPeak", locale)} />
        <Metric
          value={progress.change == null ? "—" : `${progress.change > 0 ? "+" : ""}${progress.change}°`}
          label={t("sinceFirstClip", locale)}
        />
        <Metric value={progress.latestForm ?? "—"} label={t("formScore", locale)} />
        <Metric value={progress.weeklyCount} label={t("clipsThisWeek", locale)} />
      </div>
      <div className="mt-4">
        <DashSpark values={peaks} label={t("latestPeak", locale)} unit="°" />
      </div>
      <p className="mt-3 text-sm text-[#2f4a60]">
        {progress.onTrack ? t("onTrackTrend", locale) : t("sameCameraSetup", locale)}{" "}
        {tf("goalLabel", locale, { goal })}
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
