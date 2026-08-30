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
}[] = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Exercises and recovery at home",
    tileClass: "border-[#b7d4e8] bg-[#e8f3fb] text-[#1b3348]",
  },
  {
    id: "doctor",
    title: "Doctor",
    subtitle: "Monitor linked patients",
    tileClass: "border-[#b7cfc0] bg-[#e7f1ea] text-[#2a4638]",
  },
  {
    id: "caregiver",
    title: "Caregiver",
    subtitle: "Follow a family member’s progress",
    tileClass: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32]",
  },
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
          ← Back
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
      <div className="mt-2 flex flex-col gap-3">
        {entries.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEntry(item.id)}
            className={`rounded-2xl border px-5 py-4 text-left transition hover:brightness-[0.98] ${item.tileClass}`}
          >
            <p className="text-lg font-bold">{item.title}</p>
            <p className="mt-0.5 text-sm opacity-80">{item.subtitle}</p>
          </button>
        ))}
        <Link
          href="/kids"
          className="overflow-hidden rounded-2xl border border-[#c5bdd8] bg-[#ece7f4] text-left"
        >
          <div className="relative h-28">
            <Image
              src="/kids/welcome-hero.svg"
              alt=""
              width={640}
              height={360}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d3558]/75 to-transparent" />
            <div className="absolute bottom-3 left-5 right-5">
              <p className="flex items-center gap-2 text-lg font-bold text-[#f4f0ea]">
                <KidsIcon name="gamepad" size={22} />
                Kids Quest
              </p>
              <p className="text-sm font-medium text-[#ece6d8]">Storybook adventure world</p>
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
