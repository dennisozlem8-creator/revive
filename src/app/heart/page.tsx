"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { HeartRatePanel } from "@/components/HeartRatePanel";
import { useAuth } from "@/components/AuthProvider";
import { deleteHeartRecording, loadHeartRecordings, type HeartRecording } from "@/lib/heart-log";

export default function HeartSensorPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<HeartRecording[]>([]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setRows(loadHeartRecordings(user.email));
    refresh();
    window.addEventListener("revive-heart-saved", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("revive-heart-saved", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 pb-8">
        <p className="rm-label">Wired sensor</p>
        <h1 className="rm-title mt-1 text-3xl text-foreground">Heart sensor</h1>
        <p className="mt-2 text-body">
          For an Elegoo Uno R3 and a MAX30102, Arduino IDE is only for Upload. Connecting the app
          happens in Google Chrome on the same computer — not Safari, not your phone. After USB
          connects, this page must show a green confirmation that RAW and BPM lines are coming from
          the MAX30102, not a demo number.
        </p>

        <section className="rm-card mt-6 p-5">
          <h2 className="font-semibold">Do I need Arduino IDE?</h2>
          <p className="mt-2 text-sm text-body">
            Yes, one time. Download Arduino IDE, upload the MAX30102 program, then close Serial
            Monitor. After that you only plug USB into the computer and tap Connect with USB on this
            page. You do not need a second phone app.
          </p>
        </section>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Wires: MAX30102 → Elegoo Uno R3</h2>
          <p className="mt-2 text-sm text-muted">
            MAX30102 talks over I2C. Do not use A0. Use A4 and A5. If the app says packets but no
            data, the USB cable is fine — cover both LEDs on the MAX30102 with a fingertip.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-background">
                <tr>
                  <th className="px-3 py-2 font-semibold">MAX30102 pin</th>
                  <th className="px-3 py-2 font-semibold">Elegoo Uno R3 pin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">VIN or VCC</td>
                  <td className="px-3 py-2 font-medium">5V</td>
                </tr>
                <tr className="border-t border-[var(--border)] bg-background/60">
                  <td className="px-3 py-2">GND</td>
                  <td className="px-3 py-2 font-medium">GND</td>
                </tr>
                <tr className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">SCL</td>
                  <td className="px-3 py-2 font-medium">A5 (or the pin labeled SCL)</td>
                </tr>
                <tr className="border-t border-[var(--border)] bg-background/60">
                  <td className="px-3 py-2">SDA</td>
                  <td className="px-3 py-2 font-medium">A4 (or the pin labeled SDA)</td>
                </tr>
                <tr className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">INT</td>
                  <td className="px-3 py-2">Leave unconnected</td>
                </tr>
                <tr className="border-t border-[var(--border)] bg-background/60">
                  <td className="px-3 py-2">IRD or RD</td>
                  <td className="px-3 py-2">Leave unconnected</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">
            If the MAX30102 board has a pin named only <strong className="text-foreground">3.3V</strong>{" "}
            and no VIN, use Uno <strong className="text-foreground">3.3V</strong> instead of 5V. Never
            put 5V into a pin labeled 1.8V.
          </p>
          <p className="mt-2 text-sm text-body">
            Rest a fingertip on the two LEDs on the MAX30102 and keep still.
          </p>
        </section>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Load the program</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>Install Arduino IDE from arduino.cc on this computer.</li>
            <li>
              Open <code className="rounded bg-background px-1">firmware/wired-heart/wired-heart.ino</code>
              .
            </li>
            <li>Tools → Board → Arduino Uno. Tools → Port → the Elegoo COM port.</li>
            <li>Click Upload. Wait until it says Done uploading.</li>
            <li>Close Serial Monitor, leave USB plugged in, then tap Connect with USB below.</li>
          </ol>
        </section>

        <section className="rm-card mt-4 border-alert/30 p-5">
          <h2 className="font-semibold">If Connect with USB does nothing</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>On a Mac, open Google Chrome. Do not use Safari. Safari cannot talk to USB.</li>
            <li>Plug the Elegoo USB cable into that same computer.</li>
            <li>Close Arduino Serial Monitor. Chrome cannot share the port with Arduino IDE.</li>
            <li>Tap Connect with USB. A Chrome window must open. Click the Arduino / USB Serial Device, then Connect.</li>
            <li>Do not tap Bluetooth strap. The MAX30102 is wired, not a Polar belt.</li>
          </ol>
        </section>

        <div className="mt-6">
          <HeartRatePanel />
        </div>

        <section className="rm-card mt-6 p-5">
          <h2 className="font-semibold">Saved recordings</h2>
          <p className="mt-1 text-sm text-muted">Stored on this device only.</p>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No heart recordings yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {rows
                .slice()
                .reverse()
                .map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {row.avgBpm} bpm avg · {row.minBpm}–{row.maxBpm}
                      </p>
                      <p className="text-muted">
                        {new Date(row.date).toLocaleString()} · {row.source} · {row.durationSec}s ·{" "}
                        {row.samples.length} beats
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-alert hover:underline"
                      onClick={() => {
                        deleteHeartRecording(row.id);
                        setRows(loadHeartRecordings(user.email));
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-muted">
          For progress tracking only. This is not a medical heart monitor or a diagnosis.
        </p>
        <p className="mt-4 text-center">
          <Link href="/session" className="text-sm font-medium text-brand-light">
            Back to session →
          </Link>
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
