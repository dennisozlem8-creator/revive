"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { ResetAppButton } from "./ResetAppButton";
import type { UserRole } from "@/lib/users";

type GoInRole = UserRole;

const entries: {
  id: GoInRole;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Home sessions, measurement, and today’s plan",
  },
  {
    id: "doctor",
    title: "Clinician",
    subtitle: "Monitor linked patients from the care dashboard",
  },
  {
    id: "caregiver",
    title: "Caregiver",
    subtitle: "Follow a family member’s recovery",
  },
];

type GoInScreenProps = {
  mode: "login" | "register";
};

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-light" fill="none" stroke="currentColor" strokeWidth="1.8">
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
      <div className="mt-6 flex flex-col gap-2">
        {entries.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEntry(item.id)}
            className="flex min-h-[4.25rem] items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[#f7fbfe] px-5 py-4 text-left transition hover:border-brand/45 hover:bg-white hover:shadow-sm"
          >
            <span>
              <p className="text-base font-semibold text-foreground">{item.title}</p>
              <p className="mt-0.5 text-sm leading-6 text-muted">{item.subtitle}</p>
            </span>
            <Chevron />
          </button>
        ))}
        <Link
          href="/kids"
          className="flex min-h-[4.25rem] items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-left transition hover:border-brand/45 hover:shadow-sm"
        >
          <span>
            <p className="text-base font-semibold text-foreground">Kids Quest</p>
            <p className="mt-0.5 text-sm leading-6 text-muted">Storybook world for younger patients</p>
          </span>
          <Chevron />
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
