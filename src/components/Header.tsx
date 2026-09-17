"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "./AuthProvider";
import { clinicLocale, t } from "@/lib/i18n";
import { KidsIcon } from "@/components/KidsIcon";
import { isCareTeam } from "@/lib/users";

type HeaderProps = {
  linkHome?: boolean;
  variant?: "patient" | "kids" | "caregiver";
};

export function Header({ linkHome = false, variant = "patient" }: HeaderProps) {
  const { user, logout } = useAuth();
  const locale = clinicLocale(user);
  const isCaregiver = variant === "caregiver" || isCareTeam(user?.role);

  const logo = (
    <span className="flex min-w-0 items-center gap-2 sm:gap-3">
      <Logo
        size={36}
        showText={false}
        compact
        className={isCaregiver ? "[&_span]:text-[var(--caregiver-text)]" : ""}
      />
      <span className={`whitespace-nowrap text-sm font-semibold tracking-tight sm:text-[1.05rem] ${isCaregiver ? "text-[var(--caregiver-text)]" : "text-foreground"}`}>
        Revive Motion
      </span>
    </span>
  );

  if (variant === "kids") {
    const kidsBrand = (
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 overflow-hidden rounded-full bg-[#eef5fa] ring-1 ring-[#243056]/10">
          <KidsIcon name="hero" size={44} />
        </span>
        <div>
          <p className="kids-wordmark text-xl leading-none sm:text-2xl">Kids Quest</p>
          <p className="mt-0.5 text-sm text-[#5b6685]">Stretch with the bots</p>
        </div>
      </div>
    );

    return (
      <header className="kids-header relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
          {linkHome ? (
            <Link href="/kids" className="transition hover:opacity-85">
              {kidsBrand}
            </Link>
          ) : (
            kidsBrand
          )}
          <Link
            href={user ? "/briefing" : "/"}
            className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-[#5b6685] hover:bg-white"
          >
            Grown-ups
          </Link>
        </div>
      </header>
    );
  }

  return (
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl print:hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        {linkHome ? (
          <Link
            href={isCareTeam(user?.role) ? "/doctor" : "/briefing"}
            className="min-w-0 transition hover:opacity-85"
          >
            {logo}
          </Link>
        ) : (
          logo
        )}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <LanguageToggle />
          {(!user || user.role === "patient") && (
            <>
              {user?.role === "patient" && (
                <Link href="/dashboard" className="hidden text-sm font-medium text-brand-light hover:text-brand sm:inline">
                  {t("dashboard", locale)}
                </Link>
              )}
              <Link
                href="/kids"
                className="rm-kids-type inline-flex items-center rounded-full bg-[#f5c84a] px-2.5 py-1.5 text-xs font-bold text-[#243056] shadow-sm sm:px-3 sm:text-sm"
              >
                {t("kidsQuest", locale)}
              </Link>
            </>
          )}
          {user && (
            <>
              <span className={`hidden text-sm sm:inline ${isCaregiver ? "text-[var(--caregiver-muted)]" : "text-muted"}`}>
                {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isCaregiver
                    ? "border-[#cbd5e1] text-[var(--caregiver-muted)] hover:bg-white"
                    : "border-[var(--border)] text-muted hover:text-foreground"
                }`}
              >
                {t("signOut", locale)}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
