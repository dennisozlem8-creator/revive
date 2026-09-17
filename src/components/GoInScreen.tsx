"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { KidsIcon } from "./KidsIcon";
import { ResetAppButton } from "./ResetAppButton";
import type { UserRole } from "@/lib/users";

type GoInRole = UserRole;

const entries: {
  id: GoInRole;
  title: string;
  subtitle: string;
  tileClass: string;
  chevronClass: string;
}[] = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Home sessions, measurement, and today’s plan",
    tileClass: "border-[#9ec6e0] bg-[#e8f3fb] text-[#1b3348] hover:border-[#4f90c6]",
    chevronClass: "text-[#3d7eb4]",
  },
  {
    id: "doctor",
    title: "Clinician",
    subtitle: "Monitor linked patients from the care dashboard",
    tileClass: "border-[#9dc4b0] bg-[#e7f1ea] text-[#2a4638] hover:border-[#3a7d62]",
    chevronClass: "text-[#3a7d62]",
  },
  {
    id: "caregiver",
    title: "Caregiver",
    subtitle: "Follow a family member’s recovery",
    tileClass: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32] hover:border-[#7a6548]",
    chevronClass: "text-[#7a6548]",
  },
];

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

  if (entry) {
    return (
      <>
        <button
          type="button"
          onClick={() => setEntry(null)}
          className="mb-4 text-sm font-medium text-brand-light hover:text-brand"
        >
          ← Back to roles
        </button>
        <AuthForm key={entry} mode={mode} defaultRole={entry} />
        <ResetAppButton variant="quiet" />
        <SwitchAuthLink mode={mode} />
      </>
    );
  }

  return (
    <>
      <p className="rm-label">Secure access</p>
      <h2 className="rm-serif mt-1 text-2xl font-semibold text-foreground">
        {mode === "login" ? "Go in" : "Create an account"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        {mode === "login"
          ? "Choose who you are on this device, then sign in."
          : "Choose who you are, then create an account on this device."}
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {entries.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEntry(item.id)}
            className={`flex min-h-[4.5rem] items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${item.tileClass}`}
          >
            <span>
              <p className="text-lg font-bold">{item.title}</p>
              <p className="mt-0.5 text-sm leading-6 opacity-90">{item.subtitle}</p>
            </span>
            <Chevron className={item.chevronClass} />
          </button>
        ))}
        <Link
          href="/kids"
          className="overflow-hidden rounded-2xl border-2 border-[#f0c36a] text-left shadow-[0_10px_24px_rgba(180,100,20,0.16)] transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="relative h-24">
            <Image
              src="/kids/welcome-hero.svg"
              alt=""
              width={640}
              height={360}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4a2c78]/75 via-transparent to-transparent" />
            <p className="rm-kids-type absolute bottom-2 left-4 flex items-center gap-2 text-lg font-bold text-white drop-shadow">
              <KidsIcon name="star" size={20} /> Adventure world
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#ffe08a] via-[#ffd0f0] to-[#b8e0ff] px-5 py-3">
            <span>
              <p className="rm-kids-type flex items-center gap-2 text-lg font-bold text-[#2a1848]">
                <KidsIcon name="gamepad" size={22} /> Kids Quest
              </p>
              <p className="text-sm font-semibold text-[#5a3a18]">Play the storybook adventure</p>
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
          No account?{" "}
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
