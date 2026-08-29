"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "./AuthProvider";
import { t } from "@/lib/i18n";

type HeaderProps = {
  linkHome?: boolean;
  variant?: "patient" | "kids" | "caregiver";
};

export function Header({ linkHome = false, variant = "patient" }: HeaderProps) {
  const { user, logout } = useAuth();
  const locale = user?.language ?? "en";
  const isCaregiver = variant === "caregiver" || user?.role === "doctor";

  const logo = (
    <div className="flex items-center gap-3">
      <Logo size={48} />
      <div className="hidden sm:block">
        <p className={`text-sm font-bold leading-tight ${isCaregiver ? "text-[var(--caregiver-text)]" : "text-foreground"}`}>
          Revive Motion
        </p>
        <p className={`text-xs ${isCaregiver ? "text-[var(--caregiver-muted)]" : "text-muted"}`}>
          Physical Therapy
        </p>
      </div>
    </div>
  );

  const isKids = variant === "kids";

  return (
    <header
      className={`relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 ${
        isKids ? "rounded-b-3xl border-b-4 border-orange-300 bg-gradient-to-r from-orange-400 via-fuchsia-400 to-sky-400 py-3" : "py-6"
      }`}
    >
      {linkHome ? (
        <Link
          href={user?.role === "doctor" ? "/doctor" : isKids ? "/kids" : "/briefing"}
          className="transition hover:opacity-85"
        >
          {isKids ? (
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow">🎮</span>
              <div className="hidden sm:block">
                <p className="text-sm font-black leading-tight text-white drop-shadow">Kids Quest</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">Adventure mode</p>
              </div>
            </div>
          ) : (
            logo
          )}
        </Link>
      ) : (
        isKids ? (
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow">🎮</span>
            <div className="hidden sm:block">
                <p className="text-sm font-black leading-tight text-white drop-shadow">Kids Quest</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">Adventure mode</p>
            </div>
          </div>
        ) : (
          logo
        )
      )}
      <div className="flex items-center gap-2 sm:gap-3">
        {isKids && (
          <span className="hidden rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700 shadow sm:inline-flex">
            ⭐ Kids
          </span>
        )}
        <LanguageToggle />
        {user?.role === "patient" && variant === "kids" && (
          <Link
            href="/briefing"
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-black text-violet-800 shadow transition hover:bg-white"
          >
            ← Adult mode
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
              className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-400 to-fuchsia-500 px-3 py-1.5 text-sm font-black text-white shadow"
            >
              🎮 {t("kidsQuest", locale)}
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
                isKids
                  ? "border-white/70 bg-white/80 font-black text-rose-800 hover:bg-white"
                  : isCaregiver
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
