"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MyoWarePanel } from "@/components/MyoWarePanel";
import { useAuth } from "@/components/AuthProvider";
import { deleteMyoWareRecording, loadMyoWareRecordings, type MyoWareRecording } from "@/lib/myoware-log";

function HelpBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rm-card mt-3 p-5">
      <summary className="cursor-pointer font-semibold text-foreground">{title}</summary>
      <div className="mt-3 space-y-2 text-sm text-body">{children}</div>
    </details>
  );
}

export default function MuscleSensorPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<MyoWareRecording[]>([]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setRows(loadMyoWareRecordings(user.email));
    refresh();
    window.addEventListener("revive-myoware-saved", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("revive-myoware-saved", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 pb-8">
        <p className="rm-label">Muscle sensor</p>
        <h1 className="rm-title mt-1 text-3xl text-foreground">MyoWare 2.0</h1>
        <p className="mt-2 text-body">
          Wireless uses the MyoWare Wireless Shield over Bluetooth. You do not use the Elegoo Uno
          for this. USB into the shield is only to load the program once.
        </p>

        <section className="rm-card mt-6 border-brand/30 p-5">
          <h2 className="font-semibold">Wireless — do this now</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>Leave the Elegoo Uno unplugged. The Wireless Shield has its own USB port and battery.</li>
            <li>Unstack the Wireless Shield from the muscle sensor. Plug USB into the <strong className="text-foreground">Wireless Shield</strong>.</li>
            <li>
              Set <strong className="text-foreground">POWER SOURCE</strong> to{" "}
              <strong className="text-foreground">VBAT</strong>. Flip <strong className="text-foreground">POWER ON</strong>.
            </li>
            <li>
              Arduino IDE: Boards Manager → install <strong className="text-foreground">esp32</strong> by Espressif.
              Tools → Board → <strong className="text-foreground">ESP32 Dev Module</strong>. Tools → Port → the shield.
            </li>
            <li>
              Download{" "}
              <a className="font-medium text-brand-light underline" href="/firmware/wireless-myoware">
                wireless-myoware.ino
              </a>
              . File → Open that file. Upload. Wait for Done uploading. Close Serial Monitor.
            </li>
            <li>Flip POWER OFF. Unplug USB. Snap the shield onto the muscle sensor (GND / REF only fit one way).</li>
            <li>
              Pads: <strong className="text-foreground">MID</strong> on the muscle,{" "}
              <strong className="text-foreground">END</strong> along the muscle,{" "}
              <strong className="text-foreground">REF</strong> on nearby bone.
            </li>
            <li>
              POWER ON. The LED should blink. Chrome on a computer → this page →{" "}
              <strong className="text-foreground">Connect with Bluetooth</strong> → pick{" "}
              <strong className="text-foreground">MyoWareSensor1</strong>. Flex.
            </li>
          </ol>
          <p className="mt-3 text-sm text-muted">
            Good signs: the LED stays on after Chrome connects, then ENV numbers jump when you flex.
            Factory firmware waits for USB and will not work with this website — upload the file above.
          </p>
        </section>

        <div className="mt-6">
          <MyoWarePanel />
        </div>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Wireless stack</h2>
          <p className="mt-2 text-sm text-muted">No jumper wires. The shield snaps onto the sensor.</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/myoware-wireless.svg"
              alt="MyoWare Wireless Shield snapped onto the muscle sensor"
              width={640}
              height={280}
              className="h-auto w-full"
            />
          </div>
          <a
            href="/firmware/wireless-myoware"
            className="rm-btn rm-btn-ghost mt-4 inline-flex w-full justify-center"
          >
            Download wireless-myoware.ino
          </a>
        </section>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Wired Uno instead</h2>
          <p className="mt-2 text-sm text-muted">Three wires only if you are not using the Wireless Shield.</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/myoware-wiring.svg"
              alt="MyoWare 2.0 VIN to 5V, GND to GND, ENV to A0"
              width={640}
              height={280}
              className="h-auto w-full"
            />
          </div>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-body">
            <li>VIN → Uno 5V</li>
            <li>GND → GND on the Elegoo board</li>
            <li>ENV → A0</li>
          </ol>
          <a
            href="/firmware/wired-myoware"
            className="rm-btn rm-btn-ghost mt-4 inline-flex w-full justify-center"
          >
            Download wired-myoware.ino
          </a>
        </section>

        <HelpBlock title="If Bluetooth cannot find MyoWareSensor1">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Use Chrome or Edge on a computer. Not Safari. Not iPhone.</li>
            <li>POWER SOURCE = VBAT. POWER ON. LED should blink until Chrome connects.</li>
            <li>Stay within a few feet. Do not leave USB plugged into the shield while using Bluetooth.</li>
            <li>If Mac does not see a port when uploading, install the CH340 USB driver, then pick ESP32 Dev Module.</li>
          </ol>
        </HelpBlock>

        <HelpBlock title="If ENV stays 0">
          <ol className="list-decimal space-y-2 pl-5">
            <li>The Wireless Shield POWER switch must be ON, or for wired Uno the sensor switch must be ON.</li>
            <li>Wireless: the shield must be snapped onto the muscle sensor. Wired: ENV must be in A0, not A4 or A5.</li>
            <li>Pads on clean skin: MID on the muscle, END along it, REF on bone.</li>
            <li>If the ENV LED stays on at rest, turn the GAIN screw a little counterclockwise.</li>
          </ol>
        </HelpBlock>

        <HelpBlock title="Load the wireless program in Arduino IDE">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Download wireless-myoware.ino. File → Open that file. Do not paste it into an old sketch.</li>
            <li>Tools → Board → ESP32 Dev Module. Tools → Port → the Wireless Shield (not the Elegoo).</li>
            <li>Upload. Wait for Done uploading. Close Serial Monitor. POWER OFF. Unplug USB.</li>
            <li>Snap onto the sensor, POWER ON, then Connect with Bluetooth.</li>
          </ol>
        </HelpBlock>

        <section className="rm-card mt-6 p-5">
          <h2 className="font-semibold">Saved recordings</h2>
          <p className="mt-1 text-sm text-muted">Stored on this device only.</p>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No muscle recordings yet.</p>
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
                        {row.avgEmg}% avg · peak {row.maxEmg}%
                      </p>
                      <p className="text-muted">
                        {new Date(row.date).toLocaleString()} · {row.durationSec}s · {row.samples.length}{" "}
                        readings
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-alert hover:underline"
                      onClick={() => {
                        deleteMyoWareRecording(row.id);
                        setRows(loadMyoWareRecordings(user.email));
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
          For progress tracking only. This is not a medical EMG test or a diagnosis.
        </p>
        <p className="mt-4 text-center">
          <Link href="/session" className="text-sm font-medium text-brand-light">
            Use this in a session →
          </Link>
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
