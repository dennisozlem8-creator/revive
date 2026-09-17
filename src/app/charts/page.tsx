"use client";

import { useState } from "react";
import Link from "next/link";
import { TabRow } from "@/components/ui/TabRow";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak, lastDaysActive } from "@/lib/streak";
import { t } from "@/lib/i18n";
import { loadMeasurements } from "@/lib/goniometer";
import { GoniometerProgressChart } from "@/components/GoniometerProgressChart";
import { ProgressInsight } from "@/components/ProgressInsight";
import { DashBars, DashCard, DashHeat, DashIntro, DashPainMeter, DashShell, DashStat } from "@/components/clinic/DashKit";

type ChartTab = "rom" | "reps" | "pain" | "photo";

export default function ChartsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<ChartTab>("rom");

  if (!user) return null;

  const locale = user.language ?? "en";
  const clips = loadMeasurements(user.email);
  const ordered = clips.slice().sort((a, b) => a.date.localeCompare(b.date));
  const week = lastDaysActive(user, 7);
  const month = lastDaysActive(user, 28);
  const streak = calculateStreak(user);

  return (
    <DashShell>
      <DashIntro
        kicker="Report"
        title={t("progressCharts", locale)}
        text={`${ordered.length} saved readings · ${streak} day streak. Charts use what you recorded, not a made-up trend.`}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <DashStat label="Saved readings" value={ordered.length} hint="Photo, motion, or muscle" />
        <DashStat label="This week" value={week.filter((d) => d.active).length} hint="Active days" />
        <DashStat label="Streak" value={streak} hint="Days in a row" />
      </div>

      <div className="mt-6">
        <TabRow
          tabs={[
            { id: "rom" as const, label: t("romTab", locale) },
            { id: "reps" as const, label: t("repsTab", locale) },
            { id: "pain" as const, label: t("painTab", locale) },
            { id: "photo" as const, label: t("photoTab", locale) },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "rom" && (
        <DashCard className="mt-6 p-5 sm:p-6">
          <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Range of motion</h2>
          <p className="mt-1 text-sm text-[#2f4a60]">Each bar is a saved peak angle.</p>
          <div className="mt-5">
            <DashBars
              values={ordered.map((row) => row.angle)}
              labels={ordered.map((row) =>
                new Date(row.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              )}
              goal={user.targetRom}
            />
          </div>
        </DashCard>
      )}

      {tab === "reps" && (
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <DashCard className="p-5 sm:p-6">
            <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">This week</h2>
            <p className="mt-1 text-sm text-[#2f4a60]">A tall bar means you saved a session that day.</p>
            <div className="mt-5">
              <DashBars
                values={week.map((day) => (day.active ? 1 : 0))}
                labels={week.map((day) =>
                  new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "narrow" })
                )}
              />
            </div>
          </DashCard>
          <DashCard className="p-5 sm:p-6">
            <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Last 28 days</h2>
            <p className="mt-1 text-sm text-[#2f4a60]">Green is an active day.</p>
            <div className="mt-5">
              <DashHeat days={month} />
            </div>
          </DashCard>
        </div>
      )}

      {tab === "pain" && (
        <DashCard className="mt-6 p-5 sm:p-6">
          <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Pain today</h2>
          <p className="mt-1 text-sm text-[#2f4a60]">Logged at check-in. A longer trend needs more check-ins.</p>
          <div className="mt-5">
            <DashPainMeter value={user.painToday} />
          </div>
          <Link href="/check-in" className="rm-btn rm-btn-brand mt-5 inline-flex h-11 min-h-0 rounded-full px-6">
            Open check-in
          </Link>
        </DashCard>
      )}

      {tab === "photo" && (
        <div className="mt-6 space-y-4">
          <ProgressInsight rows={clips} goal={user.targetRom || 100} />
          <DashCard className="p-5 sm:p-6">
            <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Peak angle over time</h2>
            <div className="mt-4">
              <GoniometerProgressChart measurements={clips} goal={user.targetRom || 100} />
            </div>
            <Link href="/goniometer" className="rm-btn rm-btn-brand mt-6 inline-flex h-11 min-h-0 rounded-full px-6">
              Record a new clip
            </Link>
          </DashCard>
        </div>
      )}
    </DashShell>
  );
}
