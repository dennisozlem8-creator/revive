"use client";

import { useClinicLocale } from "./useClinicLocale";
import { t } from "@/lib/i18n";

export function LanguageToggle({ labeled = false }: { labeled?: boolean }) {
  const { locale, setLocale } = useClinicLocale();
  const next = locale === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className="rounded-full border border-[var(--border)] bg-surface px-3 py-1.5 text-xs font-bold tracking-wide text-brand-light transition hover:border-brand/50"
      aria-label={locale === "en" ? t("switchToSpanish", locale) : t("switchToEnglish", locale)}
    >
      {locale === "en" ? (labeled ? "ES · Español" : "ES") : labeled ? "EN · English" : "EN"}
    </button>
  );
}
