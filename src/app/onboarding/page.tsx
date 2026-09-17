"use client";

import { KidsModeLink } from "@/components/KidsModeLink";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { DashHero, DashIntro, DashLoop, DashShell } from "@/components/clinic/DashKit";

export default function OnboardingPage() {
  return (
    <DashShell nav={false} wide={false}>
      <DashHero
        src="/images/landing-older-phone.webp?v=1"
        kicker="Get set up"
        title="Your first home session"
        text="PIN, injury, baseline, then a sensor. About five minutes."
        imgClassName="object-cover object-[center_18%]"
      />
      <div className="mt-6">
        <DashIntro
          kicker="Onboarding"
          title="Measure · Coach · Report · Improve"
          text="We save your baseline on this device so later charts have a real starting point."
        />
        <DashLoop />
      </div>
      <div className="mt-6">
        <KidsModeLink />
      </div>
      <div className="mt-6">
        <OnboardingWizard />
      </div>
    </DashShell>
  );
}
