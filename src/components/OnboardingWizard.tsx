"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import type { InjuryType } from "@/lib/users";
import { getDefaultTargetRom, simulateBaselineRom } from "@/lib/users";
import { DeviceConnectFlow } from "./DeviceConnectFlow";
import { requestNotificationPermission } from "@/lib/notifications";

const TOTAL_STEPS = 6;

const injuries: { id: InjuryType; label: string; icon: string }[] = [
  { id: "knee", label: "Knee", icon: "🦵" },
  { id: "ankle", label: "Ankle", icon: "🦶" },
  { id: "elbow", label: "Elbow", icon: "💪" },
  { id: "wrist", label: "Wrist", icon: "✋" },
  { id: "other", label: "Other", icon: "⭐" },
];

const benefits = [
  { icon: "📊", text: "Track every PT exercise automatically" },
  { icon: "🔔", text: "Keep your caregiver informed" },
  { icon: "⭐", text: "See your recovery improve daily" },
];

export function OnboardingWizard() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState("");
  const [injuryType, setInjuryType] = useState<InjuryType>("wrist");
  const [baselineRom, setBaselineRom] = useState<number | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [sessionDays, setSessionDays] = useState(5);
  const [sessionTime, setSessionTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function captureBaseline() {
    setMeasuring(true);
    setTimeout(() => {
      setBaselineRom(simulateBaselineRom(injuryType));
      setMeasuring(false);
    }, 2000);
  }

  function finish() {
    if (!user || pin.length !== 4 || baselineRom === null || !deviceConnected) return;
    if (notificationsEnabled) {
      requestNotificationPermission();
    }
    updateUser({
      setupComplete: true,
      pin,
      injuryType,
      baselineRom,
      targetRom: getDefaultTargetRom(injuryType),
      sessionDays,
      sessionTime,
      notificationsEnabled,
    });
    router.replace("/check-in");
  }

  return (
    <div className="rm-card-elevated mx-auto max-w-lg p-8">
      <div className="mb-6 flex gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-surface-elevated"}`}
          />
        ))}
      </div>
      <p className="rm-label text-brand-light">
        Step {step + 1} of {TOTAL_STEPS}
      </p>

      {step === 0 && (
        <>
          <h1 className="rm-title mt-2 text-3xl text-white">Welcome to Revive Motion</h1>
          <p className="mt-3 text-body">Let&apos;s get you set up in a few minutes.</p>
          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b.text} className="rm-card flex items-center gap-4 px-4 py-4">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-base text-body">{b.text}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setStep(1)} className="rm-btn rm-btn-primary mt-8 w-full">
            Let&apos;s Go!
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="rm-title text-2xl text-white">Create your 4-digit PIN</h2>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="rm-card mt-6 w-full px-4 py-5 text-center text-3xl font-bold tracking-[0.5em]"
            placeholder="••••"
          />
          <button
            type="button"
            disabled={pin.length !== 4}
            onClick={() => setStep(2)}
            className="rm-btn rm-btn-brand mt-6 w-full disabled:opacity-40"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="rm-title text-2xl text-white">Choose your injury</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {injuries.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => {
                  setInjuryType(i.id);
                  setBaselineRom(null);
                }}
                className={`rm-card flex min-h-[5rem] flex-col items-center justify-center gap-1 py-4 font-bold transition ${
                  injuryType === i.id ? "border-brand bg-brand/15 text-brand-light" : ""
                } ${i.id === "other" ? "sm:col-span-1" : ""}`}
              >
                <span className="text-2xl">{i.icon}</span>
                {i.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(3)} className="rm-btn rm-btn-brand mt-6 w-full">
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="rm-title text-2xl text-white">Baseline ROM test</h2>
          <p className="mt-2 text-body">
            Bend your joint to your current max. When ready, tap once — your sensor will measure it.
          </p>

          <div className="rm-card mt-6 flex flex-col items-center px-6 py-8 text-center">
            {measuring ? (
              <>
                <div className="h-16 w-16 animate-pulse-soft rounded-full border-4 border-brand border-t-transparent" />
                <p className="mt-4 font-semibold text-brand-light">Hold your position…</p>
                <p className="mt-1 text-sm text-muted">Sensor reading angle</p>
              </>
            ) : baselineRom !== null ? (
              <>
                <p className="rm-label text-correct">Baseline captured</p>
                <p className="rm-display mt-2 text-correct">{baselineRom}°</p>
                <p className="mt-2 text-sm text-muted">Goal: {getDefaultTargetRom(injuryType)}°</p>
                <button
                  type="button"
                  onClick={captureBaseline}
                  className="mt-4 text-sm font-medium text-brand-light hover:text-brand"
                >
                  Measure again
                </button>
              </>
            ) : (
              <>
                <span className="text-5xl">📡</span>
                <p className="mt-4 text-body">Wear your sensor, bend to max, then tap below.</p>
                <button
                  type="button"
                  onClick={captureBaseline}
                  className="rm-btn rm-btn-primary mt-6 w-full max-w-xs"
                >
                  Capture baseline ROM
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            disabled={baselineRom === null || measuring}
            onClick={() => setStep(4)}
            className="rm-btn rm-btn-brand mt-6 w-full disabled:opacity-40"
          >
            Next
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="rm-title text-2xl text-white">Connect your device</h2>
          <p className="mt-2 text-body">
            Find and pair your Revive Motion sensor so we can track ROM during exercises. This demo
            simulates Bluetooth scanning — no hardware required.
          </p>
          <div className="mt-6">
            <DeviceConnectFlow onConnected={() => setDeviceConnected(true)} />
          </div>
          <button
            type="button"
            disabled={!deviceConnected}
            onClick={() => setStep(5)}
            className="rm-btn rm-btn-brand mt-6 w-full disabled:opacity-40"
          >
            Next
          </button>
        </>
      )}

      {step === 5 && (
        <>
          <h2 className="rm-title text-2xl text-white">You&apos;re ready!</h2>
          <p className="mt-2 text-body">Review your recovery plan and notification preferences.</p>

          {baselineRom !== null && (
            <div className="rm-card mt-6 border-correct/30 bg-correct/10 p-5">
              <p className="rm-label text-correct">Your recovery goal</p>
              <p className="mt-2 text-lg font-bold text-white capitalize">{injuryType} rehab</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-muted">Start</p>
                  <p className="text-xl font-bold text-correct">{baselineRom}°</p>
                </div>
                <div>
                  <p className="text-muted">Goal</p>
                  <p className="text-xl font-bold text-brand-light">{getDefaultTargetRom(injuryType)}°</p>
                </div>
                <div>
                  <p className="text-muted">To gain</p>
                  <p className="text-xl font-bold text-gold">
                    {getDefaultTargetRom(injuryType) - baselineRom}°
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <p className="rm-label mb-2">Session schedule</p>
              <div className="flex gap-2">
                {[3, 4, 5].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSessionDays(d)}
                    className={`rm-card flex-1 py-3 font-bold ${sessionDays === d ? "border-brand bg-brand/15" : ""}`}
                  >
                    {d}/wk
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                {(["morning", "afternoon", "evening"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSessionTime(t)}
                    className={`rm-card flex-1 py-3 text-sm font-bold capitalize ${sessionTime === t ? "border-brand bg-brand/15" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="rm-card flex cursor-pointer items-center gap-3 px-4 py-4">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="accent-brand"
              />
              <div>
                <p className="font-semibold">Daily exercise reminders</p>
                <p className="text-sm text-muted">Get notified when it&apos;s time for your session</p>
              </div>
            </label>
          </div>

          <button type="button" onClick={finish} className="rm-btn rm-btn-primary mt-6 w-full">
            Start my recovery
          </button>
        </>
      )}
    </div>
  );
}
