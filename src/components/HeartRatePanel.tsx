"use client";

import { heartRateBrowserHelp } from "@/lib/heart-sensor";
import { useHeartRate } from "./HeartRateProvider";

type HeartRatePanelProps = {
  compact?: boolean;
  onConnected?: () => void;
};

export function HeartRatePanel({ compact, onConnected }: HeartRatePanelProps) {
  const {
    supported,
    connecting,
    connected,
    deviceName,
    bpm,
    history,
    error,
    connect,
    disconnect,
  } = useHeartRate();

  async function handleConnect(acceptAll = false) {
    return connect(acceptAll);
  }

  const live = connected && bpm != null && bpm > 0;
  const chart = live ? history.map((v) => (v > 0 ? v : bpm ?? 0)) : history;

  return (
    <section className={`rm-card ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
            live ? "bg-correct/15" : connecting ? "bg-brand/15" : "bg-surface-elevated"
          }`}
        >
          <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
            <path
              d="M24 40s-14-8.8-14-18.2C10 16 14.2 12 19 12c2.8 0 4.6 1.4 5 3.2.4-1.8 2.2-3.2 5-3.2 4.8 0 9 4 9 9.8C38 31.2 24 40 24 40z"
              fill={live ? "#3a7d62" : connecting ? "#4f90c6" : "#9bb8d0"}
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">
            {connecting
              ? "Looking for your heart sensor…"
              : live
                ? "Heart sensor live"
                : connected
                  ? "Heart sensor connected — waiting for a beat"
                  : "Connect a heart sensor"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {live
              ? `${deviceName} · live beats per minute`
              : connected
                ? `${deviceName} · wear the strap so it can send a pulse`
                : heartRateBrowserHelp()}
          </p>
        </div>
        {live ? (
          <p className="rm-display text-correct tabular-nums">{bpm}</p>
        ) : null}
      </div>

      {live && (
        <div className="mt-4">
          <p className="rm-label">Live heart rate</p>
          <div className="mt-2 flex h-20 items-end gap-0.5">
            {chart.map((value, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-correct/80"
                style={{
                  height: `${Math.max(8, Math.min(100, ((value || 40) / 180) * 100))}%`,
                  opacity: 0.4 + (i / Math.max(1, chart.length)) * 0.6,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-alert">{error}</p>}

      {!supported && (
        <p className="mt-3 text-sm text-muted">
          Open this site in <strong className="text-foreground">Chrome or Edge</strong> on a computer,
          or Chrome on Android. iPhone Safari cannot pair a Bluetooth heart strap.
        </p>
      )}

      <div className={`mt-4 flex flex-col gap-2 ${compact ? "" : "sm:flex-row"}`}>
        {!connected ? (
          <>
            <button
              type="button"
              className="rm-btn rm-btn-brand flex-1 disabled:opacity-40"
              disabled={!supported || connecting}
              onClick={async () => {
                const ok = await handleConnect(false);
                if (ok) onConnected?.();
              }}
            >
              {connecting ? "Connecting…" : "Connect heart sensor"}
            </button>
            <button
              type="button"
              className="rm-btn rm-btn-ghost flex-1 disabled:opacity-40"
              disabled={!supported || connecting}
              onClick={async () => {
                const ok = await handleConnect(true);
                if (ok) onConnected?.();
              }}
            >
              My sensor is not listed
            </button>
          </>
        ) : (
          <button type="button" className="rm-btn rm-btn-ghost w-full" onClick={disconnect}>
            Disconnect heart sensor
          </button>
        )}
      </div>

      {!compact && (
        <p className="mt-3 text-xs text-muted">
          Works with most Bluetooth heart-rate straps (Polar H9/H10, Wahoo TICKR, Coospo, Magene, and
          similar). Apple Watch and many Fitbits do not share heart rate with a website.
        </p>
      )}
    </section>
  );
}
