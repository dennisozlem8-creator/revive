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
          A wired pulse sensor plus an Arduino can send live heart data into this app over a USB
          cable. No extra phone app.
        </p>

        <section className="rm-card mt-6 p-5">
          <h2 className="font-semibold">What to buy</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>An Arduino Uno or Nano</li>
            <li>A pulse sensor (PulseSensor, KY-039, or similar analog heart sensor)</li>
            <li>Three jumper wires and a USB cable for the Arduino</li>
          </ol>
        </section>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">How to wire it</h2>
          <ul className="mt-3 space-y-2 text-sm text-body">
            <li>
              <strong className="text-foreground">Sensor VCC</strong> → Arduino 5V
            </li>
            <li>
              <strong className="text-foreground">Sensor GND</strong> → Arduino GND
            </li>
            <li>
              <strong className="text-foreground">Sensor OUT / S</strong> → Arduino A0
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted">
            Clip or tape the sensor to a fingertip. Stay still for a few seconds so the pulse can
            settle.
          </p>
        </section>

        <section className="rm-card mt-4 p-5">
          <h2 className="font-semibold">Load the program</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>Install Arduino IDE on the same computer you will use for Revive Motion.</li>
            <li>
              Open <code className="rounded bg-background px-1">firmware/wired-heart/wired-heart.ino</code>{" "}
              from this project.
            </li>
            <li>Choose your board and the USB port, then click Upload.</li>
            <li>Leave the USB cable plugged in. Open this page in Chrome or Edge.</li>
            <li>Tap Connect with USB and pick the Arduino.</li>
          </ol>
          <p className="mt-3 text-sm text-muted">
            The Arduino should print lines like <code className="rounded bg-background px-1">BPM 74</code>{" "}
            and <code className="rounded bg-background px-1">RAW 512</code>. This site reads those
            lines and graphs them. Tap Record this session, then Stop and save.
          </p>
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
