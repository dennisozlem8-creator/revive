"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "./AuthProvider";
import { t } from "@/lib/i18n";
import { KidsIcon } from "@/components/KidsIcon";
import { isCareTeam } from "@/lib/users";

type HeaderProps = {
  linkHome?: boolean;
  variant?: "patient" | "kids" | "caregiver";
};

export function Header({ linkHome = false, variant = "patient" }: HeaderProps) {
  const { user, logout } = useAuth();
  const locale = user?.language ?? "en";
  const isCaregiver = variant === "caregiver" || isCareTeam(user?.role);

  const logo = (
    <span className="flex items-center gap-3">
      <Logo
        size={40}
        showText={false}
        compact
        className={isCaregiver ? "[&_span]:text-[var(--caregiver-text)]" : ""}
      />
      <span className={`text-[1.05rem] font-semibold tracking-tight ${isCaregiver ? "text-[var(--caregiver-text)]" : "text-foreground"}`}>
        Revive Motion
      </span>
    </span>
  );

  const isKids = variant === "kids";

  return (
      <header
      className={`relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 ${
        isKids ? "kids-header rounded-b-[1.75rem] py-3" : "py-3"
      }`}
    >
      {linkHome ? (
        <Link
          href={isCareTeam(user?.role) ? "/doctor" : isKids ? "/kids" : "/briefing"}
          className="transition hover:opacity-85"
        >
          {isKids ? (
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-[0_0_0_3px_#ffe14a,0_8px_18px_rgba(20,24,60,0.25)]">
                <KidsIcon name="hero" size={44} />
              </span>
              <div>
                <p className="kids-wordmark text-2xl sm:text-3xl">Kids Quest</p>
                <p className="text-base font-bold text-[#1a1a6a]">The bots count your reps</p>
              </div>
            </div>
          ) : (
            logo
          )}
        </Link>
      ) : (
        isKids ? (
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-[0_0_0_3px_#ffe14a,0_8px_18px_rgba(20,24,60,0.25)]">
              <KidsIcon name="hero" size={44} />
            </span>
            <div>
              <p className="kids-wordmark text-2xl sm:text-3xl">Kids Quest</p>
              <p className="text-base font-bold text-[#1a1a6a]">The bots count your reps</p>
            </div>
          </div>
        ) : (
          logo
        )
      )}
      <div className="flex items-center gap-2 sm:gap-3">
        {!isKids && <LanguageToggle />}
        {isKids && (
          <Link
            href={user ? "/briefing" : "/"}
            className="kids-cta rounded-full px-4 py-2 text-base"
          >
            Grown-ups
          </Link>
        )}
        {variant !== "kids" && (!user || user.role === "patient") && (
          <>
            {user?.role === "patient" && (
              <Link href="/dashboard" className="hidden text-sm font-medium text-brand-light hover:text-brand sm:inline">
                {t("dashboard", locale)}
              </Link>
            )}
            <Link
              href="/kids"
              className="rm-kids-type inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-200 via-fuchsia-200 to-sky-200 px-3 py-1.5 text-sm font-bold text-[#4a2c0a] shadow-sm"
            >
              {t("kidsQuest", locale)}
            </Link>
          </>
        )}
        {user && !isKids && (
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
    </header>
  );
}
