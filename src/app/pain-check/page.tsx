"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PageBack } from "@/components/PageBack";
import { useAuth } from "@/components/AuthProvider";
import { addNotification } from "@/lib/notifications";
import { averagePain, painTrend } from "@/lib/pain-tracker";
import { t, resolveLocale } from "@/lib/i18n";

export default function PainCheckPage() {
  const { user, logPain } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState("");

  if (!user) return null;

  const locale = resolveLocale(user);
  const avg7 = averagePain(user.painHistory ?? [], 7);
  const trend = painTrend(user.painHistory ?? [], 7);

  function selectPain(level: number) {
    if (!user) return;
    logPain(level, "pre-session", note.trim() || undefined);

    if (level >= 7) {
      if (user.doctorEmail) {
        addNotification({
          toEmail: user.doctorEmail,
          role: "doctor",
          title: locale === "es" ? "Alerta de dolor alto" : "High pain alert",
          message: `${user.name} reported pain level ${level}/10.`,
        });
      }
      if (user.caregiverEmail) {
        addNotification({
          toEmail: user.caregiverEmail,
          role: "caregiver",
          title: locale === "es" ? "Alerta de dolor alto" : "High pain alert",
          message: `${user.name} reported pain ${level}/10.`,
        });
      }
      return;
    }

    router.push("/session");
  }

  return (
    <div className="min-h-full rm-glow-patient pb-24 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 pt-4">
        <PageBack href="/briefing" label={t("back", locale)} />
        <h1 className="rm-title mt-4 text-center text-white">{t("beforeWeStart", locale)}</h1>
        <p className="mt-3 text-center text-xl text-body">{t("painQuestion", locale)}</p>
        <p className="mt-1 text-center text-base text-muted">{t("painScale", locale)}</p>

        {avg7 !== null && (
          <p className="rm-callout mt-4 text-center text-base">
            {t("avgPain7d", locale)}: <strong>{avg7}/10</strong>
          </p>
        )}

        <div className="mt-8">
          <label htmlFor="pain-note" className="text-base text-muted">
            {t("painNoteLabel", locale)}
          </label>
          <input
            id="pain-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("painNotePlaceholder", locale)}
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-base"
          />
        </div>

        <div className="mt-8 grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => selectPain(n)}
              className={`rm-card flex min-h-[4.5rem] items-center justify-center text-2xl font-bold transition hover:scale-105 ${
                n <= 3
                  ? "border-correct/50 hover:bg-correct/15 text-correct"
                  : n <= 6
                    ? "border-almost/50 hover:bg-almost/15 text-almost"
                    : "border-alert/50 hover:bg-alert/15 text-alert"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {user.painToday !== undefined && user.painToday >= 7 && (
          <section className="rm-card mt-10 border-alert/50 bg-alert/10 p-6 text-left">
            <h2 className="text-xl font-bold text-alert">{t("highPain", locale)}</h2>
            <p className="mt-2 text-lg text-body">{t("restToday", locale)}</p>
            <p className="mt-3 text-base text-muted">{t("notifiedCareTeam", locale)}</p>
          </section>
        )}

        {user.painToday !== undefined && user.painToday < 7 && (
          <p className="mt-8 text-center text-lg font-semibold text-correct">
            {user.painToday}/10 — {t("okToExercise", locale)}
          </p>
        )}

        {trend.some((d) => d.level > 0) && (
          <section className="rm-panel mt-8 p-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">{t("thisWeek", locale)}</p>
            <div className="mt-3 flex h-16 items-end gap-1">
              {trend.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-alert/70 to-almost/50"
                    style={{ height: d.level > 0 ? `${(d.level / 10) * 100}%` : "4px" }}
                  />
                  <span className="text-xs text-muted">{d.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
