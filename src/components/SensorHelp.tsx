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
            <strong className="text-foreground">Heart rate can be live.</strong> Tap{" "}
            <strong className="text-foreground">Connect heart sensor</strong> in Chrome or Edge.
            Wear a Bluetooth heart-rate strap (Polar, Wahoo TICKR, Coospo, Magene, and similar).
            Live BPM then replaces the fake heart numbers.
          </p>
          <p>
            <strong className="text-foreground">Joint ROM is still a demo.</strong> Scan / Connect
            for the ankle or knee sensor still generates practice angles in the browser. Photo
            Goniometer is the real knee-angle tool today.
          </p>
          <p>
            Apple Watch and many Fitbits do not share heart rate with a website. iPhone Safari
            cannot pair Bluetooth straps — use Chrome on Android or Chrome/Edge on a computer.
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
