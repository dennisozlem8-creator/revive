"use client";

import { useAuth } from "./AuthProvider";
import { setStoredLocale, type Locale } from "@/lib/i18n";

type LanguageToggleProps = {
  guest?: boolean;
};

export function LanguageToggle({ guest }: LanguageToggleProps) {
  const { user, updateUser } = useAuth();
  const locale: Locale = user?.language ?? (typeof window !== "undefined" ? (localStorage.getItem("revive-motion-locale") === "es" ? "es" : "en") : "en");

  if (!user && !guest) return null;

  function toggle() {
    const next: Locale = locale === "en" ? "es" : "en";
    setStoredLocale(next);
    if (user) updateUser({ language: next });
    if (guest && !user) {
      window.dispatchEvent(new Event("revive-locale-change"));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-[var(--border)] bg-surface px-3 py-1.5 text-sm font-bold tracking-wide text-brand-light transition hover:border-brand/50"
      aria-label="Toggle language"
    >
      {locale === "en" ? "🇺🇸 EN" : "🇪🇸 ES"}
    </button>
  );
}
