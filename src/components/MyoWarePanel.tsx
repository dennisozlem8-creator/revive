"use client";

import { useEffect, useState } from "react";
import { myoWareBrowserHelp, myoWareHasSignal, requestUsbMyoWarePort } from "@/lib/myoware-sensor";
import { usbBlockReason } from "@/lib/heart-sensor";
import { useAuth } from "./AuthProvider";
import { useMyoWare } from "./MyoWareProvider";

type MyoWarePanelProps = {
  compact?: boolean;
};

export function MyoWarePanel({ compact }: MyoWarePanelProps) {
  const { user } = useAuth();
  const {
    usbSupported,
    connecting,
    connected,
    deviceName,
    emg,
    env,
    history,
    error,
    serialLog,
    usbProof,
    recording,
    recordCount,
    connectUsb,
    disconnect,
    startRecording,
    stopAndSave,
  } = useMyoWare();
  const [saveMessage, setSaveMessage] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const blocked = usbBlockReason().replace("/heart", "/muscle");
  const live = connected && emg != null;
  const flexed = live && emg >= 12;

  useEffect(() => {
    if (!connected) return;
    const tick = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(tick);
  }, [connected]);

  return (
    <section className={`rm-card ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
            flexed ? "bg-correct/15" : connecting ? "bg-brand/15" : "bg-surface-elevated"
          }`}
        >
          <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
            <path
              d="M10 28c3-8 6-14 10-14s5 8 8 8 4-10 10-10 6 10 8 16"
              fill="none"
              stroke={flexed ? "#3a7d62" : connecting ? "#4f90c6" : "#9bb8d0"}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">
            {connecting
              ? "Looking for MyoWare…"
              : live
                ? flexed
                  ? "MyoWare 2.0 — muscle working"
                  : "MyoWare 2.0 connected — flex to see effort"
                : connected
                  ? "MyoWare connected — waiting for ENV numbers"
                  : "Connect MyoWare 2.0"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {live
              ? `${deviceName} · live muscle effort`
              : connected
                ? `${deviceName} · snap pads on the muscle, then flex`
                : myoWareBrowserHelp()}
          </p>
        </div>
        {live ? <p className="rm-display text-correct tabular-nums">{emg}</p> : null}
      </div>

      {connected && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 ${
            flexed
              ? "border-correct/40 bg-correct/10"
              : myoWareHasSignal(usbProof)
                ? "border-almost/40 bg-almost/10"
                : "border-[var(--border)] bg-background"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Muscle signal</p>
          <p className="mt-1 font-semibold text-foreground">
            {flexed
              ? "Yes — ENV is changing with the muscle"
              : myoWareHasSignal(usbProof)
                ? "USB yes — flex the muscle under the pads"
                : usbProof.started
                  ? "USB yes — ENV is still near zero"
                  : "Waiting for HELLO MYOWARE"}
          </p>
          <p className="mt-1 text-sm text-body">
            {flexed
              ? "Hold a 5-second squeeze, then rest. The number should rise, then fall."
              : myoWareHasSignal(usbProof)
                ? "Pads: MID on the muscle belly, END along the muscle, REF on nearby bone. Then flex."
                : "If ENV stays 0, the power switch is off, VIN is not on 5V, or ENV is not in A0."}
          </p>
          {!compact && (
            <ul className="mt-3 space-y-1 text-sm text-body">
              <li>Board: {usbProof.board ?? "Elegoo Uno R3"}</li>
              <li>Sensor: {usbProof.chip ?? "waiting for CHIP MYOWARE2"}</li>
              <li>
                ENV: {env ?? "—"}
                {usbProof.lastPacketAt != null && now - usbProof.lastPacketAt < 2500 ? " · live" : ""}
              </li>
              <li>Effort: {emg != null ? `${emg}%` : "none yet"}</li>
            </ul>
          )}
        </div>
      )}

      {live && (
        <div className="mt-4">
          <p className="rm-label">Live muscle effort</p>
          <div className="mt-2 flex h-20 items-end gap-0.5">
            {history.map((value, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-correct/80"
                style={{
                  height: `${Math.max(8, Math.min(100, value))}%`,
                  opacity: 0.4 + (i / Math.max(1, history.length)) * 0.6,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {blocked && !connected && (
        <p className="mt-3 rounded-xl bg-alert/10 px-3 py-3 text-sm font-medium text-alert">{blocked}</p>
      )}

      {serialLog.length > 0 && (
        <div className="mt-3 rounded-xl bg-background px-3 py-2 font-mono text-xs text-muted">
          <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-muted">
            USB log — look for HELLO MYOWARE and ENV
          </p>
          {serialLog.map((line, i) => (
            <p
              key={`${line}-${i}`}
              className={
                /^(HELLO|ENV|EMG)\b/i.test(line) ? "font-semibold text-foreground" : undefined
              }
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-alert">{error}</p>}
      {saveMessage && !connected && <p className="mt-3 text-sm text-muted">{saveMessage}</p>}
      {recording && (
        <p className="mt-3 text-sm font-semibold text-brand-light">
          Recording… {recordCount} readings in this clip
        </p>
      )}

      {!usbSupported && (
        <p className="mt-3 text-sm text-muted">
          Open this site on a Windows or Mac computer in <strong className="text-foreground">Chrome or Edge</strong>.
          A phone cannot see the USB cable.
        </p>
      )}

      <div className={`mt-4 flex flex-col gap-2 ${compact ? "" : "sm:flex-row sm:flex-wrap"}`}>
        {!connected ? (
          <button
            type="button"
            className="rm-btn rm-btn-brand flex-1 disabled:opacity-40"
            disabled={connecting || !usbSupported}
            onClick={async () => {
              setSaveMessage("");
              if (!usbSupported) return;
              try {
                const port = await requestUsbMyoWarePort();
                await connectUsb(port);
              } catch (err) {
                const name = err instanceof DOMException ? err.name : "";
                if (name !== "NotFoundError" && name !== "AbortError") {
                  await connectUsb();
                }
              }
            }}
          >
            {connecting ? "Connecting…" : "Connect with USB"}
          </button>
        ) : (
          <>
            {!recording ? (
              <button
                type="button"
                className="rm-btn rm-btn-brand flex-1"
                onClick={() => {
                  setSaveMessage("");
                  startRecording();
                }}
              >
                Record this session
              </button>
            ) : (
              <button
                type="button"
                className="rm-btn rm-btn-primary flex-1"
                onClick={() => {
                  if (!user) {
                    setSaveMessage("Sign in to save the recording on this device.");
                    return;
                  }
                  setSaveMessage(stopAndSave(user.email));
                }}
              >
                Stop and save
              </button>
            )}
            <button type="button" className="rm-btn rm-btn-ghost flex-1" onClick={disconnect}>
              Disconnect
            </button>
          </>
        )}
      </div>

      {!compact && (
        <p className="mt-3 text-xs text-muted">
          Wired: Elegoo Uno R3 + MyoWare 2.0. VIN→5V, GND→GND, ENV→A0. Flip the sensor power switch ON.
        </p>
      )}
    </section>
  );
}
