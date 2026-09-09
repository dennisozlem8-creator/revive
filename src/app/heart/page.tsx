"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { HeartRatePanel } from "@/components/HeartRatePanel";
import { useAuth } from "@/components/AuthProvider";
import { deleteHeartRecording, loadHeartRecordings, type HeartRecording } from "@/lib/heart-log";

function HelpBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rm-card mt-3 p-5">
      <summary className="cursor-pointer font-semibold text-foreground">{title}</summary>
      <div className="mt-3 space-y-2 text-sm text-body">{children}</div>
    </details>
  );
}

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
          I cannot see the physical chip from here. USB to the Elegoo is the part that already
          works. The MAX30102 itself is quiet — usually power on the wrong pin, or SDA/SCL loose.
        </p>

        <section className="rm-card mt-6 border-alert/30 p-5">
          <h2 className="font-semibold">Do this now</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>Unplug the USB cable. Close Serial Monitor. Tap Disconnect if this page is connected.</li>
            <li>
              Power only the <strong className="text-foreground">VIN</strong> pin from Uno{" "}
              <strong className="text-foreground">3.3V</strong>. Leave the sensor’s own 3.3V pin
              empty. Do not put 5V on a pin labeled only 3.3V — that can kill the red lights.
            </li>
            <li>GND → GND on the Elegoo board (not only a breadboard rail).</li>
            <li>SCL → A5. SDA → A4. Push all four wires in until they click. Leave INT empty.</li>
            <li>
              Download <a className="font-medium text-brand-light underline" href="/firmware/wired-heart">wired-heart.ino</a>.
              Arduino IDE → File → Open that file. Tools → Board → Arduino Uno. Upload. Close Serial Monitor.
            </li>
            <li>Plug USB back in. On this page tap Connect with USB. Pick the Arduino. Cover both LEDs with one fingertip.</li>
          </ol>
          <p className="mt-3 text-sm text-muted">
            Good signs: SCAN shows 0x57, ID 21, then RAW numbers. If SCAN stays none after this, the
            chip is unpowered or the SDA/SCL wires are in the wrong holes.
          </p>
        </section>

        <div className="mt-6">
          <HeartRatePanel />
        </div>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Wires</h2>
          <p className="mt-2 text-sm text-muted">
            Four wires only. Power VIN from Uno 3.3V. Leave the sensor 3.3V pin empty.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/max30102-wiring.svg"
              alt="MAX30102 VIN to 5V or 3.3V, GND to GND, SCL to A5, SDA to A4"
              width={640}
              height={280}
              className="h-auto w-full"
            />
          </div>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-body">
            <li>VIN or VCC → Uno 3.3V. Leave the sensor 3.3V pin empty.</li>
            <li>GND → GND on the Elegoo board.</li>
            <li>SCL → A5. SDA → A4. Leave INT empty.</li>
          </ol>
          <a
            href="/firmware/wired-heart"
            className="rm-btn rm-btn-ghost mt-4 inline-flex w-full justify-center"
          >
            Download wired-heart.ino
          </a>
        </section>

        <HelpBlock title="Load the program in Arduino IDE">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Download the file above. In Arduino IDE: File → Open that file. Do not paste it into an old sketch.</li>
            <li>Tools → Board → Arduino Uno. Tools → Port → the Elegoo.</li>
            <li>Upload. Wait for Done uploading. Close Serial Monitor.</li>
            <li>Come back here and tap Connect with USB.</li>
          </ol>
        </HelpBlock>

        <HelpBlock title="If USB works but there is no I2C">
          <p>
            The cable is fine. The four sensor wires are loose, on the wrong voltage, or SDA/SCL are
            swapped. This sketch now tries the swap for you after you upload it.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Disconnect on this page. Close Serial Monitor.</li>
            <li>Upload the latest wired-heart.ino.</li>
            <li>Unplug USB for 10 seconds. Push VIN, GND, SCL, and SDA in hard.</li>
            <li>Plug in. Connect with USB. Cover both LEDs with a fingertip.</li>
          </ol>
        </HelpBlock>

        <HelpBlock title="If Upload says Resource busy">
          <p>Chrome or Serial Monitor is already using the port.</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Tap Disconnect, or close this tab.</li>
            <li>Close Serial Monitor.</li>
            <li>Unplug USB, wait 3 seconds, plug it back in, then Upload.</li>
          </ol>
        </HelpBlock>

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
