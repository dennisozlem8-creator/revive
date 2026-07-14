"use client";

import { Header } from "@/components/Header";
import { KidsModeLink } from "@/components/KidsModeLink";
import { PageHeroImage } from "@/components/PageHeroImage";
import { OnboardingWizard } from "@/components/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-full rm-glow-patient pb-12 text-foreground">
      <Header />
      <main className="px-6 py-8">
        <div className="mx-auto max-w-lg">
          <PageHeroImage
            src="/images/onboarding-hero.svg"
            alt="Getting started with Revive Motion"
            className="mb-6"
          />
          <KidsModeLink />
        </div>
        <OnboardingWizard />
      </main>
    </div>
  );
}
