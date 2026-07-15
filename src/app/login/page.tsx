"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";
import { KidsModeLink } from "@/components/KidsModeLink";
import { ResetAppButton } from "@/components/ResetAppButton";
import { CaregiverPortalHint } from "@/components/CaregiverPortalHint";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getStoredLocale, t } from "@/lib/i18n";

export default function LoginPage() {
  const [locale, setLocale] = useState<"en" | "es">("en");

  useEffect(() => {
    setLocale(getStoredLocale());
    const onLocale = () => setLocale(getStoredLocale());
    window.addEventListener("revive-locale-change", onLocale);
    return () => window.removeEventListener("revive-locale-change", onLocale);
  }, []);

  return (
    <div className="rm-auth-page text-foreground">
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-[420px] flex-col justify-center px-5 py-12 sm:px-6">
        <div className="absolute right-5 top-5">
          <LanguageToggle guest />
        </div>

        <header className="animate-fade-up mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-brand/10">
            <Logo size={44} showText={false} />
          </div>
          <h1 className="rm-login-title">Revive Motion</h1>
          <p className="rm-login-subtitle">{t("physicalTherapyAssistant", locale)}</p>
        </header>

        <div className="animate-fade-up rm-auth-shell p-6 sm:p-7" style={{ animationDelay: "0.05s" }}>
          <AuthForm mode="login" hideHeader locale={locale} />
        </div>

        <p className="mt-6 text-center text-base text-muted">
          {t("newHere", locale)}{" "}
          <Link
            href="/register"
            className="font-medium text-brand underline-offset-4 hover:text-brand-light hover:underline"
          >
            {t("createAccount", locale)}
          </Link>
        </p>

        <div className="rm-auth-divider my-7">{t("providerAccess", locale)}</div>

        <CaregiverPortalHint variant="compact" />

        <div className="mt-6">
          <KidsModeLink variant="portal" className="opacity-95" />
        </div>

        <ResetAppButton className="mt-6" subtle />
      </main>
    </div>
  );
}
