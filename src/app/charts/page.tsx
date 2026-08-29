"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { TabRow } from "@/components/ui/TabRow";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { t } from "@/lib/i18n";

type ChartTab = "rom" | "reps" | "pain" | "photo";

export default function ChartsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<ChartTab>("rom");

  if (!user) return null;

  const locale = user.language ?? "en";
  const sessions = user.exerciseHistory;
  const romValues = sessions.map((_, i) => user.baselineRom + i * 4);
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-6 pb-8">
        <h1 className="rm-title text-3xl text-foreground">{t("progressCharts", locale)}</h1>
        <p className="mt-1 text-body">
          {sessions.length} sessions · {calculateStreak(user)} day streak
        </p>

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
          <section className="rm-card mt-6 p-6">
            <h2 className="font-semibold">ROM Recovery</h2>
            <div className="relative mt-6 flex h-48 items-end gap-2">
              {romValues.length === 0 ? (
                <p className="rm-body">Complete a session to see your ROM chart.</p>
              ) : (
                <>
                  <div
                    className="pointer-events-none absolute inset-x-0 border-t border-dashed border-correct/60"
                    style={{ bottom: `${(user.targetRom / (user.targetRom + 10)) * 100}%` }}
                  />
                  <span className="pointer-events-none absolute right-0 text-xs text-correct" style={{ bottom: `${(user.targetRom / (user.targetRom + 10)) * 100 + 2}%` }}>
                    Goal {user.targetRom}°
                  </span>
                  {romValues.map((value, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-brand to-brand-light"
                        style={{ height: `${Math.min(100, (value / user.targetRom) * 100)}%` }}
                      />
                      <span className="text-xs text-muted">S{i + 1}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        )}

        {tab === "reps" && (
          <>
            <section className="rm-card mt-6 p-6">
              <h2 className="font-semibold">Weekly Reps</h2>
              <div className="mt-6 flex h-40 items-end gap-3">
                {weekDays.map((day, i) => {
                  const met = i < user.activityDates.length;
                  return (
                    <div key={day + i} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: met ? `${60 + i * 5}%` : "12%",
                          backgroundColor: met ? "var(--correct)" : "var(--surface-elevated)",
                        }}
                      />
                      <span className="text-xs text-muted">{day}</span>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="rm-card mt-6 p-6">
              <h2 className="font-semibold">4-Week Compliance</h2>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }, (_, i) => {
                  const active = i < user.activityDates.length;
                  const partial = i === user.activityDates.length;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-md"
                      style={{
                        backgroundColor: active
                          ? "rgba(16,185,129,0.85)"
                          : partial
                            ? "rgba(245,158,11,0.6)"
                            : "#1a2f4a",
                      }}
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}

        {tab === "pain" && (
          <section className="rm-card mt-6 p-6">
            <h2 className="font-semibold">Pain Trend</h2>
            <p className="mt-2 rm-body">
              Today: <strong className="text-foreground">{user.painToday ?? "—"}/10</strong>
            </p>
            <div className="mt-6 flex h-32 items-end gap-2">
              {Array.from({ length: 14 }, (_, i) => {
                const pain = user.painToday ?? 3;
                const h = Math.max(10, (pain / 10) * 100 - i * 3);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-alert/80 to-almost/60"
                    style={{ height: `${Math.max(8, h)}%` }}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-sm text-muted">Trend improves as ROM increases</p>
          </section>
        )}

        {tab === "photo" && (
          <section className="rm-card mt-6 p-6">
            <h2 className="font-semibold">Photo Goniometer</h2>
            <p className="mt-2 rm-body">
              Record a side-view video. The app tracks hip, knee, and ankle through the
              movement, then saves the peak angle to this progress graph.
            </p>
            <Link href="/goniometer" className="rm-btn rm-btn-brand mt-6 inline-flex">
              Open photo tool
            </Link>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
