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
        <p className="rm-label">Wired sensor</p>
        <h1 className="rm-title mt-1 text-3xl text-foreground">MyoWare 2.0</h1>
        <p className="mt-2 text-body">
          This is analog, not I2C. Three wires. When you flex, the ENV number should rise.
        </p>

        <section className="rm-card mt-6 border-brand/30 p-5">
          <h2 className="font-semibold">Do this now</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>Unplug USB. Close Serial Monitor. Tap Disconnect on the Heart page if that tab is still open.</li>
            <li>
              <strong className="text-foreground">VIN → Uno 5V</strong>.{" "}
              <strong className="text-foreground">GND → GND</strong> on the Elegoo board.{" "}
              <strong className="text-foreground">ENV → A0</strong>. Leave RAW, RECT, and INT empty.
            </li>
            <li>Flip the MyoWare <strong className="text-foreground">power switch ON</strong>. The VIN LED should stay lit.</li>
            <li>
              Snap three electrodes: <strong className="text-foreground">MID</strong> on the muscle belly,{" "}
              <strong className="text-foreground">END</strong> along the muscle,{" "}
              <strong className="text-foreground">REF</strong> on nearby bone (not on the same muscle).
            </li>
            <li>
              Download{" "}
              <a className="font-medium text-brand-light underline" href="/firmware/wired-myoware">
                wired-myoware.ino
              </a>
              . Arduino IDE → File → Open that file. Tools → Board → Arduino Uno. Upload. Close Serial Monitor.
            </li>
            <li>Plug USB back in. On this page tap Connect with USB. Pick the Arduino. Flex the muscle.</li>
          </ol>
          <p className="mt-3 text-sm text-muted">
            Good signs: HELLO MYOWARE, then ENV numbers that jump when you flex. If ENV stays 0, the
            switch is off or ENV is not in A0.
          </p>
        </section>

        <div className="mt-6">
          <MyoWarePanel />
        </div>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Wires</h2>
          <p className="mt-2 text-sm text-muted">Three wires only. Power switch ON.</p>
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

        <HelpBlock title="If you have a MyoWare Link Shield">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Snap the shield onto the sensor. Align GND and REF so it only fits one way.</li>
            <li>Set the OUTPUT switch to ENV. Do not flip that switch while power is on.</li>
            <li>Power switch ON. Cable: VIN → 5V, GND → GND, signal → A0.</li>
          </ol>
        </HelpBlock>

        <HelpBlock title="If ENV stays 0">
          <ol className="list-decimal space-y-2 pl-5">
            <li>The power switch must be ON. VIN LED stays lit.</li>
            <li>ENV must be in A0, not A4 or A5 (those were for the heart chip).</li>
            <li>Close Serial Monitor. Only this page can use the USB port.</li>
            <li>If the ENV LED stays on at rest, turn the GAIN screw a little counterclockwise.</li>
          </ol>
        </HelpBlock>

        <HelpBlock title="Load the program in Arduino IDE">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Download the file above. File → Open that file. Do not paste it into an old sketch.</li>
            <li>Tools → Board → Arduino Uno. Tools → Port → the Elegoo.</li>
            <li>Upload. Wait for Done uploading. Close Serial Monitor.</li>
            <li>Come back here and tap Connect with USB.</li>
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
