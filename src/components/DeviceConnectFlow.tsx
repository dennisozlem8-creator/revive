"use client";

import { useEffect, useState } from "react";
import { SIMULATED_CONNECT_MS } from "@/lib/device-sensor";
import { HeartRatePanel } from "./HeartRatePanel";
import { SensorHelp } from "./SensorHelp";
import { useHeartRate } from "./HeartRateProvider";

type DeviceOption = {
  id: string;
  name: string;
  signal: number;
  battery: number;
};

const simulatedDevices: DeviceOption[] = [
  { id: "rm-ankle-01", name: "Revive Motion · Ankle Sensor", signal: 92, battery: 87 },
  { id: "rm-knee-02", name: "Revive Motion · Knee Sensor", signal: 78, battery: 64 },
  { id: "rm-flex-03", name: "Revive Motion · Flex Band", signal: 65, battery: 91 },
];

type DeviceConnectFlowProps = {
  onConnected: () => void;
  compact?: boolean;
};

export function DeviceConnectFlow({ onConnected, compact }: DeviceConnectFlowProps) {
  const heart = useHeartRate();
  const [phase, setPhase] = useState<"idle" | "scanning" | "found" | "connecting" | "connected">("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleDevices, setVisibleDevices] = useState<DeviceOption[]>([]);

  useEffect(() => {
    if (heart.connected) onConnected();
  }, [heart.connected, onConnected]);

  useEffect(() => {
    if (phase !== "scanning") return;
    setVisibleDevices([]);
    const timers = simulatedDevices.map((device, i) =>
      setTimeout(() => {
        setVisibleDevices((prev) => [...prev, device]);
        if (i === simulatedDevices.length - 1) {
          setPhase("found");
        }
      }, 600 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  function startScan() {
    setPhase("scanning");
    setSelectedId(null);
  }

  function connectDevice(id: string) {
    setSelectedId(id);
    setPhase("connecting");
    setTimeout(() => {
      setPhase("connected");
      onConnected();
    }, SIMULATED_CONNECT_MS);
  }

  const device = simulatedDevices.find((d) => d.id === selectedId);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <HeartRatePanel compact={compact} onConnected={onConnected} />

      <div className="rm-card flex items-center gap-4 px-5 py-5">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
            phase === "connected" ? "bg-correct/20" : phase === "connecting" ? "bg-brand/20" : "bg-surface-elevated"
          }`}
        >
          <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
            <rect
              x="14"
              y="8"
              width="20"
              height="32"
              rx="6"
              fill={phase === "connected" ? "#10B981" : phase === "connecting" ? "#2563EB" : "#334155"}
            />
            <circle cx="24" cy="36" r="2" fill="#93C5FD" />
            {(phase === "connecting" || phase === "connected") && (
              <circle
                cx="24"
                cy="20"
                r="6"
                fill="none"
                stroke={phase === "connected" ? "#10B981" : "#60A5FA"}
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">
            {phase === "idle" && "Or use the demo joint sensor"}
            {phase === "scanning" && "Scanning for devices…"}
            {phase === "found" && "Select your device"}
            {phase === "connecting" && "Connecting…"}
            {phase === "connected" && "Device connected"}
          </p>
          <p className="text-sm text-muted">
            {phase === "idle" && "Joint ROM is still demo. Heart rate above is the live reading."}
            {phase === "scanning" && "Looking for Bluetooth sensors within range"}
            {phase === "found" && "Tap a device below to pair"}
            {phase === "connecting" && `Pairing with ${device?.name ?? "sensor"}…`}
            {phase === "connected" && "Green light active — ready for ROM tests and exercises"}
          </p>
        </div>
        {phase === "idle" && (
          <button type="button" onClick={startScan} className="rm-btn rm-btn-brand shrink-0 px-5 py-3 text-sm">
            Scan
          </button>
        )}
        {phase === "scanning" && (
          <div className="h-10 w-10 shrink-0 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        )}
      </div>

      {(phase === "found" || phase === "connecting") && (
        <ul className="space-y-2">
          {visibleDevices.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                disabled={phase === "connecting"}
                onClick={() => connectDevice(d.id)}
                className={`rm-card flex w-full items-center gap-4 px-4 py-4 text-left transition ${
                  selectedId === d.id ? "border-brand bg-brand/15" : "hover:border-brand/40"
                } disabled:opacity-60`}
              >
                <span className="text-sm font-medium text-muted">Sensor</span>
                <div className="flex-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-muted">
                    Signal {d.signal}% · Battery {d.battery}%
                  </p>
                </div>
                {selectedId === d.id && phase === "connecting" ? (
                  <span className="text-sm text-brand-light">Pairing…</span>
                ) : (
                  <span className="text-sm font-medium text-brand-light">Connect</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {phase === "connected" && device && (
        <div className="rm-card border-correct/30 bg-correct/10 p-5">
          <p className="text-sm font-semibold text-correct">✓ {device.name}</p>
          <p className="mt-1 text-sm text-body">
            Demo sensor paired — simulated readings ready for ROM tests and exercises.
          </p>
        </div>
      )}

      <SensorHelp variant={compact ? "compact" : "default"} />
    </div>
  );
}
