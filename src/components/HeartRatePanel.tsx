"use client";

import { useState } from "react";
import { heartRateBrowserHelp, requestUsbHeartPort, usbBlockReason } from "@/lib/heart-sensor";
import { useAuth } from "./AuthProvider";
import { useHeartRate } from "./HeartRateProvider";

type HeartRatePanelProps = {
  compact?: boolean;
  onConnected?: () => void;
};

export function HeartRatePanel({ compact, onConnected }: HeartRatePanelProps) {
  const { user } = useAuth();
  const {
    bluetoothSupported,
    usbSupported,
    connecting,
    connected,
    source,
    deviceName,
    bpm,
    history,
    rawHistory,
    error,
    serialLog,
    recording,
    recordCount,
    connect,
    connectUsb,
    disconnect,
    startRecording,
    stopAndSave,
  } = useHeartRate();
  const [saveMessage, setSaveMessage] = useState("");
  const blocked = usbBlockReason();
  const live = connected && bpm != null && bpm > 0;
  const chart = live ? history.map((v) => (v > 0 ? v : bpm ?? 0)) : history;
  const canConnect = bluetoothSupported || usbSupported;

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
                ? source === "usb"
                  ? "Wired heart sensor live"
                  : "Heart sensor live"
                : connected
                  ? "Heart sensor connected — waiting for a beat"
                  : "Connect a heart sensor"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {live
              ? `${deviceName} · live beats per minute`
              : connected
                ? `${deviceName} · keep the sensor on the finger or chest`
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

      {source === "usb" && rawHistory.some((v) => v > 0) && (
        <div className="mt-4">
          <p className="rm-label">Wire signal</p>
          <div className="mt-2 flex h-16 items-end gap-0.5">
            {rawHistory.map((value, i) => {
              const rawMax = Math.max(1, ...rawHistory);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-brand/70"
                  style={{
                    height: `${Math.max(6, Math.min(100, (value / rawMax) * 100))}%`,
                    opacity: 0.35 + (i / Math.max(1, rawHistory.length)) * 0.65,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {blocked && !connected && (
        <p className="mt-3 rounded-xl bg-alert/10 px-3 py-3 text-sm font-medium text-alert">{blocked}</p>
      )}

      {serialLog.length > 0 && (
        <div className="mt-3 rounded-xl bg-background px-3 py-2 font-mono text-xs text-muted">
          {serialLog.map((line, i) => (
            <p key={`${line}-${i}`}>{line}</p>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-alert">{error}</p>}
      {saveMessage && <p className="mt-3 text-sm text-muted">{saveMessage}</p>}
      {recording && (
        <p className="mt-3 text-sm font-semibold text-brand-light">
          Recording… {recordCount} beats saved in this clip
        </p>
      )}

      {!canConnect && (
        <p className="mt-3 text-sm text-muted">
          Open this site on a Windows or Mac computer in <strong className="text-foreground">Chrome or Edge</strong>.
          A phone — even Chrome on iPhone — cannot see the USB cable. Arduino IDE does not turn USB on for the phone.
        </p>
      )}

      <div className={`mt-4 flex flex-col gap-2 ${compact ? "" : "sm:flex-row sm:flex-wrap"}`}>
        {!connected ? (
          <>
            <button
              type="button"
              className="rm-btn rm-btn-brand flex-1 disabled:opacity-40"
              disabled={connecting}
              onClick={async () => {
                setSaveMessage("");
                try {
                  const port = await requestUsbHeartPort();
                  const ok = await connectUsb(port);
                  if (ok) onConnected?.();
                } catch (err) {
                  const name = err instanceof DOMException ? err.name : "";
                  if (name === "NotFoundError" || name === "AbortError") {
                    setSaveMessage(
                      "No USB device was chosen. Plug in the Elegoo, close Arduino Serial Monitor, tap Connect with USB, then click the Arduino / USB Serial Device in the Chrome window."
                    );
                    return;
                  }
                  const ok = await connectUsb();
                  if (ok) onConnected?.();
                }
              }}
            >
              {connecting ? "Connecting…" : "Connect with USB"}
            </button>
            <button
              type="button"
              className="rm-btn rm-btn-ghost flex-1 disabled:opacity-40"
              disabled={connecting}
              onClick={async () => {
                setSaveMessage("");
                const ok = await connect(false);
                if (ok) onConnected?.();
              }}
            >
              Bluetooth strap
            </button>
            {bluetoothSupported && (
              <button
                type="button"
                className="text-sm font-medium text-brand-light"
                disabled={connecting}
                onClick={async () => {
                  setSaveMessage("");
                  const ok = await connect(true);
                  if (ok) onConnected?.();
                }}
              >
                Bluetooth sensor is not listed
              </button>
            )}
          </>
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
          Wired: Elegoo Uno R3 + MAX30102 (VIN→5V, GND→GND, SCL→A5, SDA→A4), then Connect with USB.
          Bluetooth: Polar H9/H10, Wahoo TICKR, Coospo, Magene.
        </p>
      )}
    </section>
  );
}
