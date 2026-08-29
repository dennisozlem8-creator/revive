"use client";

import { useState } from "react";
import { KidsIcon } from "./KidsIcon";

type SensorHelpProps = {
  variant?: "default" | "kids" | "compact";
};

export function SensorHelp({ variant = "default" }: SensorHelpProps) {
  const [open, setOpen] = useState(variant === "compact");

  const isKids = variant === "kids";

  return (
    <div
      className={`rounded-xl border ${
        isKids
          ? "border-4 border-violet-200 bg-gradient-to-br from-violet-50 to-sky-50"
          : "border-[var(--border)] bg-surface"
      } ${variant === "compact" ? "p-3" : "p-4"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-sm font-semibold text-foreground">
          {isKids ? (
            <span className="inline-flex items-center gap-2">
              <KidsIcon name="gamepad" size={20} />
              Demo sensor mode
            </span>
          ) : (
            "How sensor connection works"
          )}
        </span>
        <span className="text-xs text-muted">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2 text-sm text-body">
          <p>
            <strong className="text-foreground">This app uses a simulated sensor.</strong> Tap Connect
            or Scan — readings are generated in your browser for demo purposes. No Bluetooth pairing
            happens yet.
          </p>
          <p>
            To connect real Revive Motion hardware later, a production app would use{" "}
            <strong className="text-foreground">Web Bluetooth</strong> (wireless straps in Chrome or
            Edge) or a <strong className="text-foreground">USB/serial bridge</strong> for wired
            sensors. Those drivers would replace the simulated readings you see here.
          </p>
          {isKids && (
            <p className="flex items-start gap-2 font-bold text-orange-700">
              <KidsIcon name="sparkle" size={18} className="mt-0.5" />
              <span>
                In quest mode, move along with the on-screen exercise — reps count automatically
                from the demo readings!
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
