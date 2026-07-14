"use client";

import { useAuth } from "./AuthProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  const locale = user.language ?? "en";

  function toggle() {
    const next: Locale = locale === "en" ? "es" : "en";
    updateUser({ language: next });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-[var(--border)] bg-surface px-3 py-1.5 text-xs font-bold tracking-wide text-brand-light transition hover:border-brand/50"
      aria-label="Toggle language"
    >
      {locale === "en" ? "🇺🇸 EN" : "🇪🇸 ES"}
    </button>
  );
}
