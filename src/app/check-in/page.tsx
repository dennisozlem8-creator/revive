"use client";

import { Header } from "@/components/Header";
import { PageHeroImage } from "@/components/PageHeroImage";
import { PreBriefingFlow } from "@/components/PreBriefingFlow";

export default function CheckInPage() {
  return (
    <div className="min-h-full rm-glow-patient pb-12 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 py-6">
        <PageHeroImage
          src="/images/check-in-hero.svg"
          alt="Daily check-in"
          className="mb-6"
        />
        <PreBriefingFlow />
      </main>
    </div>
  );
}
