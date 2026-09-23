"use client";

import { useClinicLocale } from "./useClinicLocale";
import { t } from "@/lib/i18n";

export function LanguageToggle({
  labeled = false,
  tone = "default",
}: {
  labeled?: boolean;
  tone?: "default" | "onInk";
}) {
  const { locale, setLocale } = useClinicLocale();
  const next = locale === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className={
        tone === "onInk"
          ? "rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-[#f7f3ea] transition hover:bg-white/20"
          : "rounded-full border border-[var(--border)] bg-surface px-3 py-1.5 text-xs font-bold tracking-wide text-brand-light transition hover:border-brand/50"
      }
      aria-label={locale === "en" ? t("switchToSpanish", locale) : t("switchToEnglish", locale)}
    >
      {locale === "en" ? (labeled ? "ES · Español" : "ES") : labeled ? "EN · English" : "EN"}
    </button>
  );
}
