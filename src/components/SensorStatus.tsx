"use client";

import { getConnectionDescription, getConnectionLabel } from "@/lib/sensor-hub";
import { useSensor } from "./SensorProvider";

export function SensorStatus({ compact }: { compact?: boolean }) {
  const { connection, connected, liveHr, liveSpO2 } = useSensor();

  if (!connected || !connection) {
    return (
      <div className={`rounded-xl border border-alert/30 bg-alert/5 ${compact ? "px-3 py-2" : "px-4 py-3"}`}>
        <p className="text-xs font-medium text-alert">No sensor connected</p>
        {!compact && (
          <p className="mt-0.5 text-xs text-muted">
            Connect a ROM strap or MAX30102 pulse sensor before your session.
          </p>
        )}
      </div>
    );
  }

  const pulseLabel =
    connection.hasHeartRate && liveHr
      ? ` · ${liveHr} BPM${connection.source === "bluetooth" ? " (MAX30102)" : ""}`
      : connection.hasHeartRate
        ? " · pulse ready"
        : "";

  return (
    <div className={`rounded-xl border border-correct/30 bg-correct/5 ${compact ? "px-3 py-2" : "px-4 py-3"}`}>
      <p className="text-xs font-medium text-correct">
        {getConnectionLabel(connection)} · {connection.deviceName}
        {pulseLabel}
      </p>
      {!compact && (
        <p className="mt-0.5 text-xs text-muted">
          {getConnectionDescription(connection)}
          {liveSpO2 ? ` · SpO₂ ${liveSpO2}%` : ""}
          {connection.source === "simulated" && " (demo mode)"}
        </p>
      )}
    </div>
  );
}
