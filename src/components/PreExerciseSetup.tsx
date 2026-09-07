"use client";

import { useState } from "react";
import { preExerciseSetup } from "@/lib/recovery-plan";

export function PreExerciseSetup({ exercise }: { exercise: string }) {
  const steps = preExerciseSetup(exercise);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const checked = steps.filter((step) => done[step.title]).length;

  return (
    <section className="rm-card border-brand/25 p-5">
      <p className="rm-label">Before you record</p>
      <h2 className="mt-1 text-lg font-bold">Setup for a usable clip</h2>
      <p className="mt-2 text-sm text-body">
        Do these steps first. The coach can only measure what the camera sees, and your doctor
        can only trust a clip that used the same setup as last time.
      </p>
      <p className="mt-2 text-xs font-semibold text-muted">
        {checked} of {steps.length} ready
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step.title}>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-[var(--border)] bg-background px-3 py-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--brand)]"
                checked={Boolean(done[step.title])}
                onChange={(event) =>
                  setDone((prev) => ({ ...prev, [step.title]: event.target.checked }))
                }
              />
              <span>
                <span className="font-semibold text-foreground">
                  {index + 1}. {step.title}
                </span>
                <span className="mt-1 block text-sm text-body">{step.detail}</span>
                <span className="mt-1 block text-xs text-muted">{step.why}</span>
              </span>
            </label>
          </li>
        ))}
      </ol>
    </section>
  );
}
