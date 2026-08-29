"use client";

import Link from "next/link";
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

        <section className="rm-card mt-8 p-5">
          <p className="rm-label">After check-in</p>
          <h2 className="mt-1 text-lg font-semibold">Photo Goniometer</h2>
          <p className="mt-2 text-sm text-body">
            Record a side-view video so the app can watch the knee move and save today&apos;s peak angle.
          </p>
          <Link href="/goniometer" className="rm-btn rm-btn-brand mt-4 w-full">
            Open Photo Goniometer
          </Link>
        </section>
      </main>
    </div>
  );
}
