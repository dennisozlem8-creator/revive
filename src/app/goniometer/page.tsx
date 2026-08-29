"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PhotoGoniometer } from "@/components/PhotoGoniometer";
import { useAuth } from "@/components/AuthProvider";

export default function GoniometerPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 pb-8">
        <p className="rm-label">Photo tool</p>
        <h1 className="rm-title mt-1 text-3xl text-foreground">Photo Goniometer</h1>
        <p className="mt-2 text-body">
          Take a side-view photo, mark hip → knee → ankle, then save the estimated angle
          and watch progress.
        </p>

        <div className="mt-6">
          <PhotoGoniometer userEmail={user.email} goal={user.targetRom || 100} />
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted">
          Estimated angle for progress tracking only. This is not a medical diagnosis and
          does not replace a physical therapist.
        </p>
        <p className="mt-4 text-center">
          <Link href="/charts" className="text-sm font-medium text-brand-light hover:text-brand">
            Back to charts →
          </Link>
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
