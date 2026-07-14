"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "./AuthProvider";
import { t } from "@/lib/i18n";

type HeaderProps = {
  linkHome?: boolean;
  variant?: "patient" | "kids" | "doctor" | "caregiver";
};

function homeHref(role?: string, isKids?: boolean) {
  if (role === "doctor") return "/doctor";
  if (role === "caregiver") return "/caregiver";
  if (isKids) return "/kids";
  return "/briefing";
}

export function Header({ linkHome = false, variant = "patient" }: HeaderProps) {
  const { user, logout } = useAuth();
  const locale = user?.language ?? "en";
  const isKids = variant === "kids";
  const isDoctor = variant === "doctor" || user?.role === "doctor";
  const isCaregiver = variant === "caregiver" || user?.role === "caregiver";

  const logo = (
    <div className="flex items-center gap-3">
      <Logo size={44} />
      <div className="hidden sm:block">
        <p
          className={`text-sm font-bold leading-tight ${
            isDoctor
              ? "text-[var(--doctor-text)]"
              : isCaregiver
                ? "text-[var(--caregiver-text)]"
                : "text-foreground"
          }`}
        >
          Revive Motion
        </p>
        <p
          className={`text-xs ${
            isDoctor
              ? "text-[var(--doctor-muted)]"
              : isCaregiver
                ? "text-[var(--caregiver-muted)]"
                : "text-muted"
          }`}
        >
          Physical Therapy
        </p>
      </div>
    </div>
  );

  return (
    <header
      className={`rm-header-bar ${
        isKids
          ? "border-b border-purple/20"
          : isDoctor
            ? "rm-header-bar--doctor"
            : isCaregiver
              ? "rm-header-bar--caregiver"
              : "rm-header-bar--patient"
      }`}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        {linkHome ? (
          <Link href={homeHref(user?.role, isKids)} className="transition hover:opacity-85">
            {isKids ? (
              <div className="flex items-center gap-3">
                <Logo size={44} />
                <div className="hidden sm:block">
                  <p className="text-sm font-bold leading-tight text-orange">Revive Motion</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple">Kids Quest</p>
                </div>
              </div>
            ) : (
              logo
            )}
          </Link>
        ) : (
          logo
        )}
        <div className="flex items-center gap-2 sm:gap-3">
          {isKids && (
            <span className="hidden rounded-full border border-orange/50 bg-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange sm:inline-flex animate-kids-badge-pulse">
              Quest mode
            </span>
          )}
          <LanguageToggle />
          {user?.role === "patient" && variant === "kids" && (
            <Link
              href="/briefing"
              className="rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-bold text-brand-light transition hover:bg-brand/20"
            >
              ← Adult mode
            </Link>
          )}
          {variant !== "kids" && user?.role === "patient" && (
            <Link
              href="/kids"
              className="inline-flex items-center gap-1.5 rounded-full border border-orange/50 bg-gradient-to-r from-orange/20 to-purple/20 px-3 py-2 text-xs font-bold text-orange sm:px-4 sm:text-sm"
            >
              <span aria-hidden>🎮</span>
              <span className="hidden sm:inline">{t("kidsQuest", locale)}</span>
            </Link>
          )}
          {user && (
            <>
              <span
                className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:inline ${
                  isDoctor
                    ? "bg-teal/10 text-teal"
                    : isCaregiver
                      ? "bg-orange/10 text-orange"
                      : "bg-brand/10 text-brand-light"
                }`}
              >
                {isDoctor ? "Doctor" : isCaregiver ? "Caregiver" : "Patient"}
              </span>
              <span
                className={`hidden text-sm md:inline ${
                  isDoctor
                    ? "text-[var(--doctor-muted)]"
                    : isCaregiver
                      ? "text-[var(--caregiver-muted)]"
                      : "text-muted"
                }`}
              >
                {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isDoctor
                    ? "border-[#bae6fd] text-[var(--doctor-muted)] hover:bg-white"
                    : isCaregiver
                      ? "border-[#fcd9bd] text-[var(--caregiver-muted)] hover:bg-white"
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
