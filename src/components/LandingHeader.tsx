"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-patients", label: "For patients" },
  { href: "#for-clinicians", label: "For clinicians" },
  { href: "/kids", label: "Kids Quest" },
];

type LandingHeaderProps = {
  mode: "login" | "register";
};

export function LandingHeader({ mode }: LandingHeaderProps) {
  const [open, setOpen] = useState(false);
  const cta = mode === "login" ? "Go in" : "Create account";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Link href="/" className="shrink-0 transition hover:opacity-85" onClick={() => setOpen(false)}>
          <Logo size={40} showText={false} compact />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#go-in"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light"
          >
            {cta}
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="landing-mobile-nav"
          className="border-t border-[var(--border)] bg-white px-5 py-3 lg:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto flex max-w-6xl flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--border)] py-3 text-base font-medium text-foreground last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
