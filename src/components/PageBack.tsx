"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type PageBackProps = {
  href?: string;
  label?: string;
  variant?: "patient" | "doctor" | "caregiver";
};

export function PageBack({ href, label = "Back", variant = "patient" }: PageBackProps) {
  const router = useRouter();
  const isDoctor = variant === "doctor";
  const isCaregiver = variant === "caregiver";

  const className = `mb-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
    isDoctor
      ? "text-[var(--doctor-muted)] hover:bg-white hover:text-teal"
      : isCaregiver
        ? "text-[var(--caregiver-muted)] hover:bg-white hover:text-orange"
        : "text-muted hover:bg-surface hover:text-brand-light"
  }`;
  if (href) {
    return (
      <Link href={href} className={className}>
        <span aria-hidden>←</span>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={className}>
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}
