"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { KidsIcon } from "./KidsIcon";
import { SafePicture } from "./SafePicture";
import { ResetAppButton } from "./ResetAppButton";
import type { UserRole } from "@/lib/users";

type GoInRole = UserRole;

const entries: {
  id: GoInRole;
  title: string;
  action: string;
  subtitle: string;
  tileClass: string;
  chevronClass: string;
}[] = [
  {
    id: "patient",
    title: "Patient",
    action: "Sign in as a patient",
    subtitle: "Home sessions, measurement, and today’s plan.",
    tileClass: "border-[#9ec6e0] bg-[#e8f3fb] text-[#1b3348] hover:border-[#4f90c6]",
    chevronClass: "text-[#3d7eb4]",
  },
  {
    id: "doctor",
    title: "Clinician",
    action: "Sign in as a clinician",
    subtitle: "Open the care dashboard for linked patients.",
    tileClass: "border-[#9dc4b0] bg-[#e7f1ea] text-[#2a4638] hover:border-[#3a7d62]",
    chevronClass: "text-[#3a7d62]",
  },
  {
    id: "caregiver",
    title: "Caregiver",
    action: "Sign in as a caregiver",
    subtitle: "Follow a family member’s recovery on this device.",
    tileClass: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32] hover:border-[#7a6548]",
    chevronClass: "text-[#7a6548]",
  },
];

const registerActions: Record<GoInRole, string> = {
  patient: "Create a patient account",
  doctor: "Create a clinician account",
  caregiver: "Create a caregiver account",
};

type GoInScreenProps = {
  mode: "login" | "register";
};

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 ${className ?? "text-brand-light"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GoInScreen({ mode }: GoInScreenProps) {
  const [entry, setEntry] = useState<GoInRole | null>(null);
  const signingIn = mode === "login";

  if (entry) {
    return (
      <>
        <p className="rm-label text-brand-light">Step 2 of 2</p>
        <button
          type="button"
          onClick={() => setEntry(null)}
          className="mt-1 mb-4 text-sm font-medium text-brand-light hover:text-brand"
        >
          ← Choose a different role
        </button>
        <AuthForm key={entry} mode={mode} defaultRole={entry} />
        <ResetAppButton variant="quiet" />
        <SwitchAuthLink mode={mode} />
      </>
    );
  }

  return (
    <>
      <p className="rm-label text-brand-light">Step 1 of 2</p>
      <h2 className="rm-serif mt-1 text-2xl font-semibold text-foreground">
        {signingIn ? "Sign in" : "Create an account"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        {signingIn
          ? "Tap who you are. Next you will type that account’s email and password."
          : "Tap who you are. Next you will create an email and password for that role."}
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {entries.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEntry(item.id)}
            className={`flex min-h-[4.75rem] items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${item.tileClass}`}
          >
            <span>
              <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">{item.title}</p>
              <p className="mt-0.5 text-lg font-bold leading-snug">
                {signingIn ? item.action : registerActions[item.id]}
              </p>
              <p className="mt-0.5 text-sm leading-6 opacity-90">{item.subtitle}</p>
            </span>
            <span className={`shrink-0 text-sm font-semibold ${item.chevronClass}`}>Next</span>
          </button>
        ))}
        <Link
          href="/kids"
          className="overflow-hidden rounded-2xl border-2 border-[#f0c36a] text-left shadow-[0_10px_24px_rgba(180,100,20,0.16)] transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="relative h-24 overflow-hidden">
            <SafePicture
              src="/images/landing-kids-quest.webp"
              alt=""
              className="h-full w-full object-cover object-[center_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4a2c78]/75 via-transparent to-transparent" />
            <p className="rm-kids-type absolute bottom-2 left-4 flex items-center gap-2 text-lg font-bold text-white drop-shadow">
              <KidsIcon name="star" size={20} /> No sign-in
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#ffe08a] via-[#ffd0f0] to-[#b8e0ff] px-5 py-3">
            <span>
              <p className="rm-kids-type flex items-center gap-2 text-lg font-bold text-[#2a1848]">
                <KidsIcon name="gamepad" size={22} /> Kids Quest
              </p>
              <p className="text-sm font-semibold text-[#5a3a18]">Open the storybook. No email needed.</p>
            </span>
            <Chevron className="text-[#c47a32]" />
          </div>
        </Link>
      </div>
      <ResetAppButton variant="quiet" />
      <SwitchAuthLink mode={mode} />
    </>
  );
}

function SwitchAuthLink({ mode }: { mode: "login" | "register" }) {
  return (
    <p className="mt-5 text-center text-sm text-muted">
      {mode === "login" ? (
        <>
          No account yet?{" "}
          <Link href="/register" className="font-semibold text-brand-light hover:text-brand">
            Create one
          </Link>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-light hover:text-brand">
            Sign in
          </Link>
        </>
      )}
    </p>
  );
}
