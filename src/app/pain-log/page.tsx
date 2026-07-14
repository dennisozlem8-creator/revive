"use client";

import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { useAuth } from "@/components/AuthProvider";
import { averagePain, painTrend } from "@/lib/pain-tracker";

export default function PainLogPage() {
  const { user, logPain } = useAuth();
  const [level, setLevel] = useState(4);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const history = [...(user.painHistory ?? [])].reverse().slice(0, 14);
  const avg7 = averagePain(user.painHistory ?? [], 7);
  const trend = painTrend(user.painHistory ?? [], 14);

  function submit() {
    logPain(level, "journal", note.trim() || undefined);
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PortalShell
      variant="patient"
      label="Symptoms"
      title="Pain log"
      subtitle="Track how you feel throughout the day"
      showQuickLinks
    >
      <section className="rm-panel p-5">
        <label htmlFor="pain-level" className="text-sm font-medium">
          Current pain level
        </label>
        <input
          id="pain-level"
          type="range"
          min={0}
          max={10}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
        />
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted">None</span>
          <span className="text-2xl font-bold text-brand-light">{level}/10</span>
          <span className="text-muted">Worst</span>
        </div>

        <label htmlFor="pain-journal" className="mt-5 block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="pain-journal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Stiffness, swelling, what helped…"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-sm"
        />

        <button type="button" onClick={submit} className="rm-btn rm-btn-primary mt-4 w-full">
          {saved ? "Saved ✓" : "Log entry"}
        </button>
      </section>

      {avg7 !== null && (
        <div className="rm-callout text-sm">
          7-day average: <strong>{avg7}/10</strong> · {user.injuryType} recovery
        </div>
      )}

      <section className="rm-panel p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">14-day trend</p>
        <div className="mt-4 flex h-24 items-end gap-1">
          {trend.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-alert/70 to-almost/40"
                style={{ height: d.level > 0 ? `${Math.max(8, (d.level / 10) * 100)}%` : "4px" }}
              />
              <span className="text-[0.625rem] text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className="rm-panel p-5">
          <h2 className="font-semibold">Recent entries</h2>
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {history.map((entry, i) => (
              <li key={i} className="flex gap-3 py-3 text-sm">
                <span
                  className={`font-bold ${
                    entry.level >= 7 ? "text-alert" : entry.level >= 4 ? "text-almost" : "text-correct"
                  }`}
                >
                  {entry.level}/10
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-muted capitalize">{entry.context.replace("-", " ")}</p>
                  {entry.note && <p className="text-body">{entry.note}</p>}
                  <p className="text-xs text-muted">
                    {new Date(entry.date).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PortalShell>
  );
}
