"use client";

import { useState } from "react";
import type { RomTest } from "@/lib/assessments";
import {
  runDeviceRecording,
  simulateDeviceConnect,
  type DeviceReading,
  type DeviceSession,
} from "@/lib/device-sensor";
import { DeviceLineChart } from "./DeviceLineChart";
import { SensorHelp } from "./SensorHelp";

type DeviceRecordingProps = {
  tests: RomTest[];
  areaId: string;
  onComplete: (session: DeviceSession) => void;
};

export function DeviceRecording({ tests, areaId, onComplete }: DeviceRecordingProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [readings, setReadings] = useState<DeviceReading[]>([]);
  const [movementIndex, setMovementIndex] = useState(0);

  async function handleConnect() {
    setConnecting(true);
    await simulateDeviceConnect();
    setConnecting(false);
    setConnected(true);
  }

  async function startRecording() {
    setRecording(true);
    setReadings([]);
    const session = await runDeviceRecording(tests, areaId, (reading, index) => {
      setReadings((prev) => [...prev, reading]);
      setMovementIndex(index);
    });
    setRecording(false);
    onComplete(session);
  }

  const activeTest = tests[movementIndex];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-surface p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Revive Motion sensor</h2>
          <p className="mt-2 text-muted">
            Wear your device on the affected area. The sensor records range of
            motion in real time during each movement.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl border border-[var(--border)] bg-background p-5">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                connected ? "bg-brand/20" : "bg-surface"
              }`}
            >
              <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
                <rect
                  x="14"
                  y="8"
                  width="20"
                  height="32"
                  rx="6"
                  fill={connected ? "#2563EB" : "#334155"}
                />
                <circle cx="24" cy="36" r="2" fill="#93C5FD" />
                {connected && (
                  <circle
                    cx="24"
                    cy="20"
                    r="6"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}
              </svg>
            </div>
            <div>
              <p className="font-medium">
                {connecting
                  ? "Connecting sensor…"
                  : connected
                    ? "Sensor connected"
                    : "Sensor not connected"}
              </p>
              <p className="text-sm text-muted">
                {connecting
                  ? "Demo pairing — about 2 seconds"
                  : connected
                    ? "Demo device ready — green light active"
                    : "Connect the demo sensor before recording"}
              </p>
            </div>
            {!connected && (
              <button
                type="button"
                disabled={connecting}
                onClick={handleConnect}
                className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:bg-brand-light disabled:opacity-60"
              >
                {connecting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {connecting ? "Connecting…" : "Connect device"}
              </button>
            )}
          </div>

          <div className="mt-4">
            <SensorHelp variant="compact" />
          </div>

          {connected && !recording && readings.length === 0 && (
            <button
              type="button"
              onClick={startRecording}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand-light"
            >
              Start ROM recording
            </button>
          )}

          {recording && activeTest && (
            <div className="mt-6 rounded-xl border border-brand/30 bg-brand/10 p-4">
              <p className="text-sm font-medium text-brand-light">Recording now</p>
              <p className="mt-1 text-lg font-semibold">{activeTest.name}</p>
              <p className="mt-1 text-sm text-muted">{activeTest.instructions}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-brand" />
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:max-w-md">
          <DeviceLineChart
            readings={readings}
            activeMovementId={activeTest?.id}
          />
        </div>
      </div>
    </section>
  );
}
