"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { DashCard, DashIntro, DashShell } from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import { PhotoFrame } from "@/components/LandingMedia";
import { MotionLiveDemo } from "@/components/MotionLiveDemo";
import { MotionPanel } from "@/components/MotionPanel";

function HelpBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="mt-3 overflow-hidden rounded-[1.35rem] bg-white p-5 shadow-[0_12px_28px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12">
      <summary className="cursor-pointer font-semibold text-[#1b3348]">{title}</summary>
      <div className="mt-3 space-y-2 text-sm leading-6 text-[#2f4a60]">{children}</div>
    </details>
  );
}

export default function MotionSensorPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashShell>
      <DashIntro
        kicker="Motion sensor"
        title="MPU-6050"
        text="Elegoo Uno R3 plus MPU-6050. Play a demo move, then Connect with USB. Live angle fills the Recovery Passport."
      />
      <div className="mt-5">
        <MotionLiveDemo />
      </div>
      <PhotoFrame
        src="/images/landing-mpu.png?v=8"
        alt="MPU-6050 modules on the upper arm and wrist"
        className="mt-6 h-56 rounded-[1.35rem] sm:h-64 lg:hidden"
        imgClassName="object-cover object-[left_42%]"
      />

      <div className="mt-6">
        <MotionPanel />
      </div>

      <DashCard className="mt-4 p-5">
        <h2 className="rm-serif text-xl font-semibold text-[#1b3348]">Elegoo Uno — four wires</h2>
        <p className="mt-2 text-sm text-[#2f4a60]">Use the computer that has Arduino IDE. Chrome or Edge, not Safari.</p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-body">
          <li>VCC → Uno 5V. If that pin is labeled only 3.3V, use Uno 3.3V instead. Never put 5V on a 3.3V-only pin.</li>
          <li>GND → GND</li>
          <li>SCL → A5</li>
          <li>SDA → A4. Leave INT and AD0 empty.</li>
        </ol>
        <a
          href="/firmware/wired-mpu"
          className="rm-btn rm-btn-ghost mt-4 inline-flex w-full justify-center"
        >
          Download wired-mpu.ino
        </a>
      </DashCard>

      <HelpBlock title="Load the program, then connect">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Download{" "}
            <a className="font-medium text-brand-light underline" href="/firmware/wired-mpu">
              wired-mpu.ino
            </a>
            . File → Open that file. Do not paste it into an old sketch.
          </li>
          <li>Tools → Board → Arduino Uno. Tools → Port → the Elegoo. Upload. Close Serial Monitor.</li>
          <li>Tape the MPU-6050 on one bone of the joint so it cannot flop.</li>
          <li>Keep USB in the computer. This page → Connect with USB → pick Arduino Uno. Move. ANGLE should change.</li>
        </ol>
      </HelpBlock>

      <HelpBlock title="If SCAN says none">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Power: VCC on 5V, or 3.3V if the module pin is labeled only 3.3V. GND must be on GND.</li>
          <li>SCL in A5, SDA in A4. Swap those two only if SCAN stays none after a power check.</li>
          <li>Close Serial Monitor. Only Chrome can hold the USB port at the same time as this page.</li>
        </ol>
      </HelpBlock>

      <p className="mt-6 text-center text-sm text-[#2f4a60]">
        For progress tracking only. This is not a diagnosis.
      </p>
      <p className="mt-4 text-center">
        <Link href="/session" className="text-sm font-semibold text-[#1b3348]">
          Use this in a session →
        </Link>
      </p>
    </DashShell>
  );
}
