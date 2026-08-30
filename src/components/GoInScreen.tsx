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
}[] = [
  { id: "patient", title: "Patient", subtitle: "Exercises and recovery at home" },
  { id: "doctor", title: "Doctor", subtitle: "Monitor linked patients" },
  { id: "caregiver", title: "Caregiver", subtitle: "Follow a family member’s progress" },
];

type GoInScreenProps = {
  mode: "login" | "register";
};

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
          ← Back to who is going in
        </button>
        <AuthForm key={entry} mode={mode} defaultRole={entry} />
        <ResetAppButton />
        <p className="mt-6 text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link href="/register" className="font-medium text-brand-light hover:text-brand">
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-light hover:text-brand">
                Sign in
              </Link>
            </>
          )}
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl font-semibold">Who is going in?</h1>
      <p className="mt-2 text-center text-sm text-muted">
        Choose Patient, Doctor, Caregiver, or Kids Quest.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {entries.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEntry(item.id)}
            className="rounded-2xl border border-[var(--border)] bg-surface px-5 py-4 text-left transition hover:border-brand/40"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light">
              {index + 1}
            </p>
            <p className="mt-1 text-lg font-bold">{item.title}</p>
            <p className="mt-0.5 text-sm text-body">{item.subtitle}</p>
          </button>
        ))}
        <Link
          href="/kids"
          className="overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-b from-white via-amber-50 to-sky-50 text-left shadow-[0_12px_28px_rgba(40,24,8,0.1)]"
        >
          <div className="relative h-28">
            <Image
              src="/kids/welcome-hero.svg"
              alt=""
              width={640}
              height={360}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2848]/70 to-transparent" />
            <p className="absolute left-5 top-3 text-[11px] font-bold uppercase tracking-widest text-amber-100">
              4
            </p>
            <div className="absolute bottom-3 left-5 right-5">
              <p className="flex items-center gap-2 text-lg font-bold text-amber-50">
                <KidsIcon name="gamepad" size={22} />
                Kids Quest
              </p>
              <p className="text-sm font-medium text-amber-100/90">Storybook adventure world</p>
            </div>
          </div>
        </Link>
      </div>
      <ResetAppButton />
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/register" className="font-medium text-brand-light hover:text-brand">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-light hover:text-brand">
              Sign in
            </Link>
          </>
        )}
      </p>
    </>
  );
}
