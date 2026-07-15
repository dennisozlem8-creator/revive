"use client";

import { useEffect, useState } from "react";
import { DEMO_DEVICES, getConnectionLabel } from "@/lib/sensor-hub";
import { SensorHelp } from "./SensorHelp";
import { useSensor } from "./SensorProvider";

type DeviceConnectFlowProps = {
  onConnected: () => void;
  compact?: boolean;
};

type ConnectPhase = "idle" | "scanning" | "found" | "connecting" | "connected";

export function DeviceConnectFlow({ onConnected, compact }: DeviceConnectFlowProps) {
  const { connection, connectSimulated, connectBluetooth, connectSerial, connectHc05, bluetoothAvailable, serialAvailable } = useSensor();
  const [phase, setPhase] = useState<ConnectPhase>("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleDevices, setVisibleDevices] = useState<typeof DEMO_DEVICES>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connection) {
      setPhase("connected");
      setSelectedId(connection.deviceId);
    }
  }, [connection]);

  useEffect(() => {
    if (phase !== "scanning") return;
    setVisibleDevices([]);
    const timers = DEMO_DEVICES.map((device, i) =>
      setTimeout(() => {
        setVisibleDevices((prev) => [...prev, device]);
        if (i === DEMO_DEVICES.length - 1) setPhase("found");
      }, 600 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  function startScan() {
    setError(null);
    setPhase("scanning");
    setSelectedId(null);
  }

  async function attemptPair(
    connect: () => Promise<boolean>,
    failureMessage: string,
    failurePhase: Extract<ConnectPhase, "idle" | "found"> = "idle"
  ) {
    setPhase("connecting");
    setError(null);
    const ok = await connect();
    if (ok) {
      setPhase("connected");
      onConnected();
      return;
    }
    setError(failureMessage);
    setPhase(failurePhase);
  }

  async function connectDevice(id: string, name: string, kind: "rom" | "pulse" | "combo" = "rom") {
    setSelectedId(id);
    setError(null);
    try {
      await connectSimulated(id, name, kind);
      setPhase("connected");
      onConnected();
    } catch {
      setError("Could not connect. Try again.");
      setPhase("found");
    }
  }

  const deviceName =
    connection?.deviceName ??
    DEMO_DEVICES.find((d) => d.id === selectedId)?.name;

  const connectionLabel = getConnectionLabel(connection);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
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
            {phase === "idle" && "Connect your sensor"}
            {phase === "scanning" && "Scanning for devices…"}
            {phase === "found" && "Select your device"}
            {phase === "connecting" && "Connecting…"}
            {phase === "connected" && "Sensor connected"}
          </p>
          <p className="text-sm text-muted">
            {phase === "idle" && "Pair via USB, HC-05 Bluetooth, BLE, or demo sensor."}
            {phase === "scanning" && "Looking for Revive Motion sensors"}
            {phase === "found" && "Tap a device to pair — readings feed measurements automatically"}
            {phase === "connecting" && `Pairing with ${deviceName ?? "sensor"}…`}
            {phase === "connected" &&
              `${connectionLabel} · ${
                connection?.hasHeartRate ? "MAX30102 BPM" : "ROM"
              }${connection?.kind === "combo" ? " + angle" : ""}`}
          </p>
        </div>
        {phase === "idle" && (
          <div className="flex shrink-0 flex-col gap-2">
            {serialAvailable && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    attemptPair(
                      connectSerial,
                      "USB connection cancelled or failed. Close Arduino Serial Monitor first."
                    )
                  }
                  className="rm-btn rm-btn-primary px-5 py-3 text-sm"
                >
                  USB Cable
                </button>
                <button
                  type="button"
                  onClick={() =>
                    attemptPair(
                      connectHc05,
                      "HC-05 connection failed. Pair in Windows Bluetooth first, then pick the COM port."
                    )
                  }
                  className="rm-btn rm-btn-primary px-5 py-3 text-sm"
                >
                  HC-05 Bluetooth
                </button>
              </>
            )}
            <button type="button" onClick={startScan} className="rm-btn rm-btn-brand px-5 py-3 text-sm">
              Scan
            </button>
            {bluetoothAvailable && (
              <button
                type="button"
                onClick={() =>
                  attemptPair(connectBluetooth, "Bluetooth pairing cancelled or unavailable.")
                }
                className="rm-btn rm-btn-ghost px-5 py-2 text-xs"
              >
                Real BLE
              </button>
            )}
          </div>
        )}
        {phase === "scanning" && (
          <div className="h-10 w-10 shrink-0 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-alert/30 bg-alert/10 px-4 py-3 text-sm text-alert">{error}</p>
      )}

      {(phase === "found" || phase === "connecting") && (
        <ul className="space-y-2">
          {visibleDevices.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                disabled={phase === "connecting"}
                onClick={() => connectDevice(d.id, d.name, d.kind)}
                className={`rm-card flex w-full items-center gap-4 px-4 py-4 text-left transition ${
                  selectedId === d.id ? "border-brand bg-brand/15" : "hover:border-brand/40"
                } disabled:opacity-60`}
              >
                <span className="text-2xl">📡</span>
                <div className="flex-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-muted">
                    {d.kind === "pulse"
                      ? "MAX30102 demo · live BPM"
                      : "ROM + movement · streams to session"}
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

      {phase === "connected" && connection && (
        <div className="rm-card border-correct/30 bg-correct/10 p-5">
          <p className="text-sm font-semibold text-correct">✓ {connection.deviceName}</p>
          <p className="mt-1 text-sm text-body">
            Measurements will use this sensor for ROM tests and exercise rep counting.
          </p>
        </div>
      )}

      <SensorHelp variant={compact ? "compact" : "default"} />
    </div>
  );
}
