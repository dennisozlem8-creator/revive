"use client";

import { useState } from "react";
import Link from "next/link";
import type { Exercise } from "@/lib/assessments";
import { StatTile } from "./ui/StatTile";
import { useAuth } from "./AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { getChatResponse } from "@/lib/chat-bot";
import type { SessionSummary } from "./SessionResults";

type SessionReportProps = {
  summary: SessionSummary;
  exercises: Exercise[];
  completedIds: string[];
  onDone: () => void;
};

export function SessionReport({
  summary,
  exercises,
  completedIds,
  onDone,
}: SessionReportProps) {
  const { user, logPain } = useAuth();
  const [postPain, setPostPain] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const completed = exercises.filter((e) => completedIds.includes(e.id));
  const compliance = Math.round((completed.length / exercises.length) * 100);
  const streak = calculateStreak(user);
  const romGain = Math.max(0, summary.angle - user.baselineRom);

  const reportText = getChatResponse(
    `Patient completed ${completed.length}/${exercises.length} exercises. Peak ROM ${summary.angle} degrees. Baseline ${user.baselineRom}. Goal ${user.targetRom}. Pain ${user.painToday ?? 3}/10. Streak ${streak} days. Give a short recovery report.`
  );

  function savePostPain(level: number) {
    setPostPain(level);
    logPain(level, "post-session");
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <section className="rm-card-elevated border-purple/30 p-6 text-center">
        <p className="text-4xl">📋</p>
        <h2 className="rm-title mt-2 text-2xl text-white">Your session report</h2>
        <p className="mt-2 text-body">Great work finishing today&apos;s program.</p>
      </section>

      {!saved && (
        <section className="rm-panel p-5">
          <h3 className="font-semibold">How does it feel now?</h3>
          <p className="mt-1 text-sm text-muted">Rate pain after your session (helps track recovery)</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => savePostPain(n)}
                className={`rounded-lg border py-3 text-sm font-bold ${
                  postPain === n ? "border-brand bg-brand/20 text-brand-light" : "border-[var(--border)]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </section>
      )}

      {saved && postPain !== null && (
        <p className="rm-callout text-center text-sm">
          Post-session pain logged: <strong>{postPain}/10</strong>
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile value={`${summary.angle}°`} label="Peak ROM" accent="correct" />
        <StatTile value={`+${romGain}°`} label="ROM gain" accent="brand" />
        <StatTile value={`${compliance}%`} label="Compliance" accent="purple" />
        <StatTile value={streak} label="Streak" accent="orange" />
      </div>

      <section className="rm-card p-6">
        <h3 className="font-bold">Exercises completed</h3>
        <ul className="mt-4 space-y-2">
          {completed.map((ex) => (
            <li
              key={ex.id}
              className="flex items-center gap-2 rounded-xl border border-correct/30 bg-correct/10 px-4 py-3 text-sm"
            >
              <span className="text-correct">✓</span>
              <span className="font-medium">{ex.name}</span>
              <span className="ml-auto text-muted">{ex.sets}</span>
            </li>
          ))}
        </ul>
        {completed.length < exercises.length && (
          <p className="mt-3 text-sm text-muted">
            {exercises.length - completed.length} exercise(s) skipped this session.
          </p>
        )}
      </section>

      <section className="rm-card border-purple/30 p-6" style={{ background: "var(--ai-panel)" }}>
        <h3 className="font-bold text-purple">RecoverAI summary</h3>
        <p className="mt-3 leading-7 text-body">{reportText}</p>
      </section>

      <section className="rm-card p-6">
        <h3 className="font-bold">Sensor stats</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">Reps recorded</dt>
            <dd className="text-xl font-bold">{summary.reps}</dd>
          </div>
          <div>
            <dt className="text-muted">EMG effort</dt>
            <dd className="text-xl font-bold">{summary.emg}%</dd>
          </div>
          <div>
            <dt className="text-muted">Heart rate</dt>
            <dd className="text-xl font-bold">{summary.hr} BPM</dd>
          </div>
          <div>
            <dt className="text-muted">Pain today</dt>
            <dd className="text-xl font-bold">{user.painToday ?? "—"}/10</dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/charts" className="rm-btn rm-btn-ghost flex-1 text-center">
          View charts
        </Link>
        <button type="button" onClick={onDone} className="rm-btn rm-btn-primary flex-1">
          Back to briefing
        </button>
      </div>
    </div>
  );
}
