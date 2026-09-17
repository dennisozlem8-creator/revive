"use client";

import { useClinicLocale } from "./useClinicLocale";

export function LanguageToggle() {
  const { locale, setLocale } = useClinicLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "es" : "en")}
      className="rounded-full border border-[var(--border)] bg-surface px-3 py-1.5 text-xs font-bold tracking-wide text-brand-light transition hover:border-brand/50"
      aria-label={locale === "en" ? "Cambiar a español" : "Switch to English"}
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
