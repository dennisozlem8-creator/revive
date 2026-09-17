"use client";

import Link from "next/link";
import { DashIntro, DashShell } from "@/components/clinic/DashKit";
import { PhotoGoniometer } from "@/components/PhotoGoniometer";
import { useAuth } from "@/components/AuthProvider";
import { PhotoFrame } from "@/components/LandingMedia";

export default function GoniometerPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center text-[#2f4a60]">
        Loading camera…
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashShell wide={false}>
      <DashIntro
        kicker="Measure"
        title="Photo Goniometer"
        text="Take a side-view photo or clip. Tap hip, knee, then ankle if the camera cannot see the joint."
      />
      <PhotoFrame
        src="/images/landing-photo-goniometer.png?v=1"
        alt=""
        className="mt-5 h-36 rounded-[1.35rem] sm:h-44"
      />
      <div className="mt-6">
        <PhotoGoniometer userEmail={user.email} goal={user.targetRom || 100} />
      </div>
      <p className="mt-8 text-center text-sm leading-6 text-[#2f4a60]">
        Estimated angle for progress tracking only. This is not a diagnosis and does not replace a physical therapist.
      </p>
      <p className="mt-4 text-center">
        <Link href="/charts" className="text-sm font-semibold text-[#1b3348]">
          Open progress charts →
        </Link>
      </p>
    </DashShell>
  );
}
