"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { QuickLinks } from "@/components/QuickLinks";
import { DonutMetric } from "@/components/ui/DonutMetric";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { getTherapistResponse } from "@/lib/therapist";
import { computeOutcomeMetrics } from "@/lib/progress-analytics";
import { t, resolveLocale } from "@/lib/i18n";

type Message = { role: "user" | "assistant"; text: string };

export default function RecoverAIPage() {
  const { user } = useAuth();
  const [report, setReport] = useState("");
  const [input, setInput] = useState("");
  const locale = resolveLocale(user);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        locale === "es"
          ? "Soy tu terapeuta automatizado. Pregunta sobre dolor, ejercicios, ROM o tu plan."
          : "I'm your automated therapist. Ask about pain, exercises, ROM, or your plan.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  const prescription = user.ptPrescription;
  const streak = calculateStreak(user);
  const metrics = computeOutcomeMetrics(user);
  const latestRom = user.romHistory?.[user.romHistory.length - 1]?.peakAngle ?? user.baselineRom;
  const trajectoryPct = metrics.romGoalPercent;

  function generateReport() {
    if (!user) return;
    const prompt = locale === "es" ? "informe de progreso" : "progress report";
    setReport(getTherapistResponse(prompt, user, locale));
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    setTimeout(() => {
      if (!user) return;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: getTherapistResponse(text, user, locale) },
      ]);
    }, 450);
  }

  return (
    <div className="min-h-full rm-glow-patient rm-page-pad text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-5 pb-8 sm:px-6">
        <p className="rm-label text-purple">{t("automatedTherapist", locale)}</p>
        <h1 className="rm-title text-white sm:text-3xl">{t("recoverAI", locale)}</h1>
        <p className="mt-1 text-lg text-body">
          {locale === "es" ? "Coaching personalizado de recuperación" : "Personalized recovery coaching"}
        </p>
        <QuickLinks variant="patient" />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DonutMetric
            label={t("complianceLabel", locale)}
            value={metrics.compliancePercent}
            display={`${metrics.compliancePercent}%`}
            color="var(--brand)"
          />
          <DonutMetric
            label="ROM"
            value={trajectoryPct}
            display={`${latestRom}°`}
            color="var(--correct)"
          />
          <DonutMetric
            label={t("romGain", locale)}
            value={Math.min(100, metrics.romGain * 3)}
            display={`+${metrics.romGain}°`}
            color="var(--gold)"
          />
          <DonutMetric label={t("streak", locale)} value={Math.min(100, streak * 12)} display={`${streak}d`} color="var(--purple)" />
        </div>

        <div className="rm-card mt-6 px-4 py-4">
          <div className="mb-2 flex justify-between text-base">
            <span className="text-muted">{t("outcomeAnalytics", locale)}</span>
            <span className="font-semibold text-purple">{trajectoryPct}%</span>
          </div>
          <div className="rm-trajectory">
            <div className="rm-trajectory-fill" style={{ width: `${trajectoryPct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted">
            <span>{user.baselineRom}°</span>
            <span className="text-gold text-base">●</span>
            <span>{user.targetRom}°</span>
          </div>
        </div>

        <section className="rm-card mt-6 overflow-hidden border-purple/30" style={{ background: "var(--ai-panel)" }}>
          <div className="border-b border-purple/20 px-5 py-4">
            <h2 className="text-lg font-semibold text-purple">{t("automatedTherapist", locale)}</h2>
            <p className="text-base text-muted">
              {locale === "es" ? "Pregunta sobre tu recuperación" : "Ask about your recovery"}
            </p>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-base leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-brand text-white"
                    : "bg-background/80 text-foreground"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-purple/20 p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={locale === "es" ? "Pregunta sobre dolor, ejercicios…" : "Ask about pain, exercises…"}
              className="flex-1 rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-base outline-none focus:border-purple"
            />
            <button type="submit" className="rm-btn rm-btn-ai shrink-0 px-5 py-3 text-sm">
              Send
            </button>
          </form>
        </section>

        <button type="button" onClick={generateReport} className="rm-btn rm-btn-ai mt-6 w-full">
          {t("getReport", locale)}
        </button>

        {report && (
          <section className="rm-card mt-6 border-purple/30 p-6" style={{ background: "var(--ai-panel)" }}>
            <h2 className="text-lg font-semibold text-purple">{t("aiAnalysis", locale)}</h2>
            <p className="mt-3 text-lg leading-7 text-body">{report}</p>
          </section>
        )}

        <section className="mt-6 overflow-hidden rounded-xl border border-correct/40 bg-correct/15 p-6">
          <h2 className="text-lg font-bold text-correct">{t("todaysPrescription", locale)}</h2>
          <p className="mt-2 text-xl font-semibold">
            {prescription?.exerciseName ?? "Resistance Band Extension"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              `${prescription?.sets ?? 3} ${t("sets", locale)}`,
              `${prescription?.reps ?? 10} ${t("reps", locale)}`,
              `${prescription?.holdSeconds ?? 12}s`,
              `${prescription?.targetAngle ?? user.targetRom}°`,
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-background/60 px-3 py-2 text-center text-base font-semibold"
              >
                {pill}
              </span>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
