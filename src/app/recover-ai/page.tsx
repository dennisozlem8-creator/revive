"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { QuickLinks } from "@/components/QuickLinks";
import { DonutMetric } from "@/components/ui/DonutMetric";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { getCoachResponse } from "@/lib/chat-bot";
import { t } from "@/lib/i18n";

type Message = { role: "user" | "assistant"; text: string };

export default function RecoverAIPage() {
  const { user } = useAuth();
  const [report, setReport] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm your RecoverAI coach. Ask about exercises, pain, ROM progress, or your rehab plan.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  const locale = user.language ?? "en";
  const prescription = user.ptPrescription;
  const streak = calculateStreak(user);
  const romGain = Math.max(0, user.targetRom - user.baselineRom);
  const currentRom = user.baselineRom + Math.round(romGain * 0.4);
  const trajectoryPct = Math.min(
    100,
    Math.round(((currentRom - user.baselineRom) / Math.max(1, romGain)) * 100)
  );

  function generateReport() {
    if (!user) return;
    const sessions = user.exerciseHistory.length;
    const prompt = `Patient completed ${sessions} sessions. Streak ${streak} days. ROM from ${user.baselineRom} to goal ${user.targetRom}. Pain ${user.painToday ?? 3}/10.`;
    const suffix = locale === "es" ? " Responde en español." : " recovery recommendation";
    setReport(getCoachResponse(prompt + suffix, user));
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
        { role: "assistant", text: getCoachResponse(text, user) },
      ]);
    }, 450);
  }

  return (
    <div className="min-h-full rm-glow-patient rm-page-pad text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-5 pb-8 sm:px-6">
        <p className="rm-label text-purple">RecoverAI</p>
        <h1 className="rm-title text-2xl text-white sm:text-3xl">{t("recoverAI", locale)}</h1>
        <p className="mt-1 text-body">Personalized recovery intelligence</p>
        <QuickLinks variant="patient" />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DonutMetric label="Compliance" value={87} display="87%" color="var(--brand)" />
          <DonutMetric label="ROM" value={trajectoryPct} display={`${currentRom}°`} color="var(--correct)" />
          <DonutMetric label="Gained" value={60} display={`+${currentRom - user.baselineRom}°`} color="var(--gold)" />
          <DonutMetric label="Effort" value={90} display="90%" color="var(--purple)" />
        </div>

        <div className="rm-card mt-6 px-4 py-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted">Recovery trajectory</span>
            <span className="font-semibold text-purple">{trajectoryPct}%</span>
          </div>
          <div className="rm-trajectory">
            <div className="rm-trajectory-fill" style={{ width: `${trajectoryPct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>{user.baselineRom}°</span>
            <span className="text-gold text-base">●</span>
            <span>{user.targetRom}°</span>
          </div>
        </div>

        <section className="rm-card mt-6 overflow-hidden border-purple/30" style={{ background: "var(--ai-panel)" }}>
          <div className="border-b border-purple/20 px-5 py-4">
            <h2 className="font-semibold text-purple">Chat with RecoverAI</h2>
            <p className="text-sm text-muted">Rehab-focused coaching — simulated responses, no API key needed</p>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
              placeholder="Ask about pain, exercises, ROM…"
              className="flex-1 rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-sm outline-none focus:border-purple"
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
            <h2 className="font-semibold text-purple">{t("aiAnalysis", locale)}</h2>
            <p className="mt-3 text-base leading-7 text-body">{report}</p>
          </section>
        )}

        <section className="mt-6 overflow-hidden rounded-xl border border-correct/40 bg-correct/15 p-6">
          <h2 className="font-bold text-correct">{t("todaysPrescription", locale)}</h2>
          <p className="mt-2 text-xl font-semibold">
            {prescription?.exerciseName ?? "Resistance Band Extension"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              `${prescription?.sets ?? 3} Sets`,
              `${prescription?.reps ?? 10} Reps`,
              `${prescription?.holdSeconds ?? 12}s Hold`,
              `${prescription?.targetAngle ?? user.targetRom}° Target`,
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-background/60 px-3 py-2 text-center text-sm font-semibold"
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
