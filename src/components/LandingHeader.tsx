"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useClinicLocale } from "./useClinicLocale";
import { t } from "@/lib/i18n";

type LandingHeaderProps = {
  mode: "login" | "register";
};

export function LandingHeader({ mode }: LandingHeaderProps) {
  const [open, setOpen] = useState(false);
  const { locale } = useClinicLocale();
  const cta = mode === "login" ? t("createAccount", locale) : t("signIn", locale);
  const ctaHref = mode === "login" ? "/register" : "/login";
  const nav = [
    { href: "#impact", label: t("impactNav", locale) },
    { href: "#passport", label: t("passportNav", locale) },
    { href: "#how-it-works", label: t("howItWorks", locale) },
    { href: "#sensors", label: t("sensorsNav", locale) },
    { href: "#features", label: t("appNav", locale) },
    { href: "#library", label: t("libraryNav", locale) },
    { href: "/kids", label: t("kidsQuest", locale) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 transition hover:opacity-85 sm:gap-3"
          aria-label="Revive Motion"
          onClick={() => setOpen(false)}
        >
          <Logo size={36} showText={false} compact />
          <span className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-[1.05rem]">Revive Motion</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/kids"
                  ? "rm-kids-type rounded-full bg-[#f5c84a] px-3 py-1 text-sm font-bold text-[#243056] shadow-sm"
                  : "text-sm font-medium text-muted transition hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          {mode === "login" && (
            <Link href="/login" className="hidden text-sm font-semibold text-[#1b3348] sm:inline">
              {t("signIn", locale)}
            </Link>
          )}
          <Link
            href={ctaHref}
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-brand px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(79,144,198,0.3)] transition hover:bg-brand-light sm:h-11 sm:px-5"
          >
            {cta}
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-foreground sm:h-10 sm:w-10 lg:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? t("closeMenu", locale) : t("openMenu", locale)}</span>
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
          className="border-t border-[var(--border)] bg-white px-3 py-3 sm:px-6 lg:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  item.href === "/kids"
                    ? "rm-kids-type inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#f5c84a] px-4 text-sm font-bold text-[#243056] shadow-sm"
                    : "inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4f90c6]/40 bg-white px-4 text-sm font-semibold text-[#1b3348]"
                }
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
