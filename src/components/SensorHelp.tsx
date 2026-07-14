"use client";

import { useState } from "react";

type SensorHelpProps = {
  variant?: "default" | "kids" | "compact";
};

export function SensorHelp({ variant = "default" }: SensorHelpProps) {
  const [open, setOpen] = useState(variant === "compact");

  const isKids = variant === "kids";

  return (
    <div
      className={`rounded-xl border ${
        isKids ? "border-purple/30 bg-purple/10" : "border-brand/25 bg-brand/5"
      } ${variant === "compact" ? "p-3" : "p-4"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className={`text-sm font-semibold ${isKids ? "text-purple" : "text-brand-light"}`}>
          {isKids ? "🎮 Demo sensor mode" : "📡 Sensors & MAX30102 heart rate"}
        </span>
        <span className="text-xs text-muted">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3 text-sm text-body">
          <div>
            <p className="font-semibold text-foreground">Arduino + HC-05 (wireless, no ESP32)</p>
            <p className="mt-1">
              Wire MAX30102 to Arduino and HC-05 to pins 0/1, upload{" "}
              <code className="text-brand-light">hardware/arduino-max30102-hc05.ino</code>, pair HC-05
              in Windows Bluetooth, then tap <strong className="text-foreground">HC-05 Bluetooth</strong> and
              pick the COM port (not Real BLE).
            </p>
            <p className="mt-1 text-xs text-muted">
              See <code className="text-brand-light">hardware/HC05-SETUP.md</code> for wiring and pairing.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Arduino + USB (no ESP32)</p>
            <p className="mt-1">
              Wire MAX30102 to Arduino Uno (3.3V, SDA→A4, SCL→A5), upload{" "}
              <code className="text-brand-light">hardware/arduino-max30102-usb.ino</code>, then tap{" "}
              <strong className="text-foreground">USB Cable</strong> on the session screen.
            </p>
            <p className="mt-1 text-xs text-muted">
              Close Arduino Serial Monitor before connecting — only one app can use the port.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">MAX30102 (Bluetooth / ESP32)</p>
            <p className="mt-1">
              The MAX30102 connects by <strong className="text-foreground">I2C to an ESP32</strong> (not
              directly to the phone). The ESP32 reads your pulse and sends BPM over Bluetooth to this app.
            </p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
              <li>Wire MAX30102: VIN→3.3V, GND→GND, SDA→GPIO21, SCL→GPIO22</li>
              <li>Flash <code className="text-brand-light">hardware/esp32-max30102-ble.ino</code> to ESP32</li>
              <li>Place sensor on fingertip — stay still 5–10 seconds</li>
              <li>In app: Session → <strong>Real BLE</strong> → select &quot;Revive MAX30102&quot;</li>
            </ol>
          </div>

          <div>
            <p className="font-semibold text-foreground">ROM / movement sensors</p>
            <p className="mt-1">
              Use <strong>Scan</strong> for demo devices, or <strong>Real BLE</strong> for a strap that
              sends joint angle. BPM tile uses MAX30102 when paired; otherwise it estimates from movement.
            </p>
          </div>

          <p className="text-xs text-muted">
            Requires Chrome or Edge on HTTPS or localhost. See hardware folder for wiring diagram and
            firmware.
          </p>

          {isKids && (
            <p className="text-orange">
              In quest mode, reps count from movement readings — pair pulse sensor for live BPM!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
