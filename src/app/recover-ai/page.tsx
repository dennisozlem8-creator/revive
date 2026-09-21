"use client";

import { useEffect, useRef, useState } from "react";
import { DashCard, DashIntro, DashRing, DashShell, DashStat } from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak, lastDaysActive } from "@/lib/streak";
import { getCoachResponse } from "@/lib/chat-bot";
import { t } from "@/lib/i18n";
import { loadMeasurements } from "@/lib/goniometer";
import { progressSnapshot } from "@/lib/recovery-plan";
import { TodayPlan } from "@/components/ExerciseLibrary";

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
  const clips = loadMeasurements(user.email);
  const progress = progressSnapshot(clips, user.targetRom || 100);
  const week = lastDaysActive(user, 7);
  const weekPct = Math.round((week.filter((d) => d.active).length / 7) * 100);
  const currentRom = progress.latestPeak ?? user.baselineRom;
  const trajectoryPct = Math.min(
    100,
    Math.round(((currentRom - user.baselineRom) / Math.max(1, user.targetRom - user.baselineRom)) * 100)
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
    <DashShell>
      <DashIntro
        kicker="Coach"
        title={t("recoverAI", locale)}
        text="Ask about today’s plan, pain, or range. Answers stay on this device. Charts below use saved readings."
      />

      <div className="mt-6">
        <TodayPlan user={user} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashRing value={weekPct} max={100} label="Active days this week" display={`${weekPct}%`} />
        <DashRing value={currentRom} max={user.targetRom || 100} label="Range vs goal" display={`${currentRom}°`} />
        <DashStat
          label="Change"
          value={progress.change == null ? "—" : `${progress.change > 0 ? "+" : ""}${progress.change}°`}
          hint="Since first saved clip"
        />
        <DashStat label="Streak" value={streak} hint="Days in a row" />
      </div>

        <DashCard className="mt-6 px-5 py-5">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold text-[#2f4a60]">Recovery trajectory</span>
            <span className="font-semibold tabular-nums text-[#1b3348]">{trajectoryPct}%</span>
          </div>
          <div className="rm-trajectory">
            <div className="rm-trajectory-fill" style={{ width: `${trajectoryPct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm text-[#2f4a60]">
            <span>Start {user.baselineRom}°</span>
            <span>Goal {user.targetRom}°</span>
          </div>
        </DashCard>

        <DashCard className="mt-6 overflow-hidden">
          <div className="border-b border-[#e8f3fb] px-5 py-4">
            <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Chat with RecoverAI</h2>
            <p className="mt-1 text-sm text-[#2f4a60]">Rehab coaching on this device — no API key needed.</p>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "ml-auto bg-[#4f90c6] text-white" : "bg-[#f7fbfe] text-[#1b3348]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#e8f3fb] p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pain, exercises, or range…"
              className="flex-1 rounded-xl border border-[#4f90c6]/20 bg-[#f7fbfe] px-4 py-3 text-sm outline-none focus:border-[#4f90c6]"
            />
            <button type="submit" className="rm-btn rm-btn-brand h-11 min-h-0 shrink-0 rounded-full px-5 text-sm">
              Send
            </button>
          </form>
        </DashCard>

        <button type="button" onClick={generateReport} className="rm-btn rm-btn-brand mt-6 w-full rounded-full">
          {t("getReport", locale)}
        </button>

        {report && (
          <DashCard className="mt-6 p-6">
            <h2 className="font-semibold text-[#1b3348]">{t("aiAnalysis", locale)}</h2>
            <p className="mt-3 text-base leading-7 text-[#2f4a60]">{report}</p>
          </DashCard>
        )}

        <DashCard className="mt-6 p-6">
          <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">{t("todaysPrescription", locale)}</h2>
          <p className="mt-2 text-xl font-semibold text-[#1b3348]">
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
                className="rounded-full bg-[#e8f3fb] px-3 py-2 text-center text-sm font-semibold text-[#1b3348]"
              >
                {pill}
              </span>
            ))}
          </div>
        </DashCard>
    </DashShell>
  );
}
