"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { simulateDeviceConnect } from "@/lib/device-sensor";
import { demoMotionAt } from "@/lib/motion-demo";
import { SafePicture } from "@/components/SafePicture";

type MotionPanelProps = {
  compact?: boolean;
  live?: boolean;
  onConnected?: () => void;
  onAngle?: (angle: number) => void;
};

export function MotionPanel({ compact, live, onConnected, onAngle }: MotionPanelProps) {
  const [connecting, setConnecting] = useState(false);
  const [ready, setReady] = useState(false);
  const [angle, setAngle] = useState(0);
  const startedRef = useRef(0);
  const onAngleRef = useRef(onAngle);
  onAngleRef.current = onAngle;

  useEffect(() => {
    if (!ready || !live) return;
    startedRef.current = performance.now();
    const id = window.setInterval(() => {
      const sample = demoMotionAt(performance.now() - startedRef.current);
      setAngle(sample.angle);
      onAngleRef.current?.(sample.angle);
    }, 80);
    return () => window.clearInterval(id);
  }, [ready, live]);

  async function connect() {
    setConnecting(true);
    await simulateDeviceConnect();
    setConnecting(false);
    setReady(true);
    onConnected?.();
  }

  return (
    <section className={`rm-card ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-4">
        <SafePicture
          src="/images/landing-mpu.png?v=8"
          alt=""
          width={160}
          height={120}
          className="h-16 w-20 shrink-0 rounded-2xl object-cover object-[left_40%]"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">
            {connecting
              ? "Finding the motion sensor"
              : ready
                ? live
                  ? "MPU-6050 — live angle"
                  : "MPU-6050 connected — motion sensor ready"
                : "Connect MPU-6050"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {ready
              ? "Wireless motion on the joint. The live number is the angle."
              : "Strap the wireless sensor above and below the joint, then Connect."}
          </p>
        </div>
        {ready ? <p className="rm-display tabular-nums text-[#1b3348]">{angle}°</p> : null}
      </div>

      {!ready ? (
        <button
          type="button"
          className="rm-btn rm-btn-brand mt-4 w-full disabled:opacity-40 sm:w-auto sm:px-8"
          disabled={connecting}
          onClick={() => void connect()}
        >
          {connecting ? "Connecting…" : "Connect"}
        </button>
      ) : (
        <p className="mt-3 text-sm text-muted">Wireless MPU-6050. Live angle while you move.</p>
      )}
    </section>
  );
}

export function PhotoMeasureCard() {
  return (
    <Link href="/goniometer" className="rm-card flex overflow-hidden p-0 no-underline">
      <SafePicture
        src="/images/landing-photo-goniometer.png?v=2"
        alt=""
        width={240}
        height={180}
        className="h-28 w-32 shrink-0 object-cover sm:h-32 sm:w-40"
      />
      <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4">
        <span className="text-sm font-semibold text-[#2f4a60]">Photo Goniometer</span>
        <span className="mt-0.5 font-semibold text-foreground">Measure with a photo</span>
        <span className="mt-1 text-sm text-muted">
          Phone or laptop camera. The app marks hip, knee, and ankle — or you tap the three points.
        </span>
        <span className="rm-btn rm-btn-brand mt-3 inline-flex h-10 w-fit min-h-0 rounded-full px-5 text-sm">
          Open Photo Goniometer
        </span>
      </span>
    </Link>
  );
}
