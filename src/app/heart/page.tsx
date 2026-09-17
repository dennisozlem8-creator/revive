"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashCard, DashEmpty, DashIntro, DashShell } from "@/components/clinic/DashKit";
import { HeartRatePanel } from "@/components/HeartRatePanel";
import { useAuth } from "@/components/AuthProvider";
import { deleteHeartRecording, loadHeartRecordings, type HeartRecording } from "@/lib/heart-log";

function HelpBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="mt-3 overflow-hidden rounded-[1.35rem] bg-white p-5 shadow-[0_12px_28px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12">
      <summary className="cursor-pointer font-semibold text-[#1b3348]">{title}</summary>
      <div className="mt-3 space-y-2 text-sm leading-6 text-[#2f4a60]">{children}</div>
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
    <DashShell wide={false}>
      <DashIntro
        kicker="Optional sensor"
        title="Heart sensor"
        text="Skipping this chip? Connect MyoWare instead. Three analog wires, no I2C."
      />
      <DashCard className="mt-5 p-5">
        <p className="text-base leading-7 text-[#1b3348]">
          <Link href="/muscle" className="font-semibold text-[#1b3348] underline">
            Connect MyoWare 2.0
          </Link>{" "}
          if you are not using the heart chip. <strong>No I2C</strong> means the USB cable works and the heart chip did not answer — that is a power or wire problem, not a website problem.
        </p>
      </DashCard>

      <DashCard className="mt-6 p-5">
        <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Do this now — no I2C</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#2f4a60]">
          <li>Unplug the USB cable. Close Serial Monitor. Tap Disconnect if this page is connected.</li>
          <li>
            Read the power pin name on the sensor. If it says <strong className="text-[#1b3348]">VIN</strong> or{" "}
            <strong className="text-[#1b3348]">VCC</strong>, move that one wire to Uno{" "}
            <strong className="text-[#1b3348]">5V</strong>. Leave the sensor’s own 3.3V pin empty.
          </li>
          <li>
            If the pin says only <strong className="text-[#1b3348]">3.3V</strong>, keep it on Uno 3.3V. Never put 5V on a pin labeled only 3.3V.
          </li>
          <li>GND → GND on the Elegoo board (not only a breadboard rail).</li>
          <li>SCL → A5. SDA → A4. Push all four wires in hard. Leave INT empty.</li>
          <li>Plug USB back in. Refresh this page. Tap Connect with USB. Look for SCAN 0x57, not SCAN none.</li>
        </ol>
        <p className="mt-3 text-sm text-[#2f4a60]">
          If the red lights already went on and then died, this chip is dead. A new MAX30102 is the next step.
        </p>
      </DashCard>

      <div className="mt-6">
        <HeartRatePanel />
      </div>

      <DashCard className="mt-4 p-5">
        <h2 className="rm-serif text-xl font-semibold text-[#1b3348]">Wires</h2>
        <p className="mt-2 text-sm text-[#2f4a60]">Four wires only. VIN or VCC → Uno 5V. Leave the sensor 3.3V pin empty.</p>
        <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-[#4f90c6]/12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/max30102-wiring.svg"
            alt="MAX30102 VIN to 5V, GND to GND, SCL to A5, SDA to A4"
            width={640}
            height={280}
            className="h-auto w-full"
          />
        </div>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-[#2f4a60]">
          <li>VIN or VCC → Uno 5V. Leave the sensor 3.3V pin empty.</li>
          <li>GND → GND on the Elegoo board.</li>
          <li>SCL → A5. SDA → A4. Leave INT empty.</li>
        </ol>
        <a href="/firmware/wired-heart" className="rm-btn rm-btn-ghost mt-4 inline-flex w-full justify-center rounded-full">
          Download wired-heart.ino
        </a>
      </DashCard>

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
          The cable is fine. The chip did not answer. Most MAX30102 boards want 5V on the VIN pin, not 3.3V. The sketch already tries SDA and SCL swapped.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Disconnect on this page. Close Serial Monitor.</li>
          <li>Move VIN/VCC to Uno 5V. Leave the sensor 3.3V pin empty.</li>
          <li>Unplug USB for 10 seconds. Push VIN, GND, SCL, and SDA in hard.</li>
          <li>Plug in. Connect with USB. If SCAN is still none and the lights stay off, the chip is dead.</li>
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

      <DashCard className="mt-6">
        {rows.length === 0 ? (
          <DashEmpty title="No heart recordings yet" text="Connect a strap or the wired chip, then save a reading. Stored on this device only." href="/session" action="Back to session" />
        ) : (
          <div className="p-5">
            <h2 className="rm-serif text-xl font-semibold text-[#1b3348]">Saved recordings</h2>
            <ul className="mt-4 space-y-2">
              {rows
                .slice()
                .reverse()
                .map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 rounded-[1.1rem] bg-[#f7fbfe] px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-[#1b3348]">
                        {row.avgBpm} bpm avg · {row.minBpm}–{row.maxBpm}
                      </p>
                      <p className="text-[#2f4a60]">
                        {new Date(row.date).toLocaleString()} · {row.source} · {row.durationSec}s · {row.samples.length} beats
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#9a4f4f]"
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
          </div>
        )}
      </DashCard>

      <p className="mt-6 text-center text-sm text-[#2f4a60]">For progress tracking only. This is not a medical heart monitor or a diagnosis.</p>
      <p className="mt-4 text-center">
        <Link href="/session" className="text-sm font-semibold text-[#1b3348]">
          Back to session →
        </Link>
      </p>
    </DashShell>
  );
}
