"use client";

import Link from "next/link";
import { DashCard, DashIntro, DashPhotoLink, DashShell } from "@/components/clinic/DashKit";
import { PreBriefingFlow } from "@/components/PreBriefingFlow";

export default function CheckInPage() {
  return (
    <DashShell nav={false} wide={false}>
      <DashIntro
        kicker="Check-in"
        title="How do you feel today?"
        text="Pain and stiffness go with today’s plan. Then take the photo or start the session."
      />
      <DashCard className="mt-6 p-5 sm:p-6">
        <PreBriefingFlow />
      </DashCard>
      <div className="mt-6">
        <DashPhotoLink
          href="/goniometer"
          src="/images/landing-photo-goniometer.png?v=1"
          kicker="After check-in"
          title="Photo Goniometer"
          text="Record a side-view clip so the coach can save today’s peak."
        />
      </div>
      <p className="mt-4 text-center">
        <Link href="/briefing" className="text-sm font-semibold text-[#1b3348]">
          Back to briefing →
        </Link>
      </p>
    </DashShell>
  );
}
