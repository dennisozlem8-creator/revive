"use client";

import Link from "next/link";
import { DashIntro, DashShell } from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import { PhotoFrame } from "@/components/LandingMedia";
import { MotionLiveDemo } from "@/components/MotionLiveDemo";

export default function MotionSensorPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashShell>
      <DashIntro
        kicker="Motion sensor"
        title="MPU-6050"
        text="Play a demo move to see live angle spike. Strap above and below the joint when you have the sensor."
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
