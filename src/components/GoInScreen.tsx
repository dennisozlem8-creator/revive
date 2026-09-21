"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { ResetAppButton } from "./ResetAppButton";
import { useClinicLocale } from "./useClinicLocale";
import { t } from "@/lib/i18n";
import type { UserRole } from "@/lib/users";

type GoInRole = UserRole;

type GoInScreenProps = {
  mode: "login" | "register";
};

export function GoInScreen({ mode }: GoInScreenProps) {
  const [entry, setEntry] = useState<GoInRole | null>(null);
  const { locale } = useClinicLocale();
  const signingIn = mode === "login";

  const entries: {
    id: GoInRole;
    title: string;
    action: string;
    subtitle: string;
    tileClass: string;
    chevronClass: string;
  }[] = [
    {
      id: "patient",
      title: t("patientRole", locale),
      action: t("signInPatient", locale),
      subtitle: t("patientSubtitle", locale),
      tileClass: "border-[#9ec6e0] bg-[#e8f3fb] text-[#1b3348] hover:border-[#4f90c6]",
      chevronClass: "text-[#3d7eb4]",
    },
    {
      id: "doctor",
      title: t("clinicianRole", locale),
      action: t("signInClinician", locale),
      subtitle: t("clinicianSubtitle", locale),
      tileClass: "border-[#9dc4b0] bg-[#e7f1ea] text-[#2a4638] hover:border-[#3a7d62]",
      chevronClass: "text-[#3a7d62]",
    },
    {
      id: "caregiver",
      title: t("caregiverRole", locale),
      action: t("signInCaregiver", locale),
      subtitle: t("caregiverSubtitle", locale),
      tileClass: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32] hover:border-[#7a6548]",
      chevronClass: "text-[#7a6548]",
    },
  ];

  const registerActions: Record<GoInRole, string> = {
    patient: t("createPatient", locale),
    doctor: t("createClinician", locale),
    caregiver: t("createCaregiver", locale),
  };

  if (entry) {
    return (
      <>
        <p className="rm-label text-brand-light">{t("step2of2", locale)}</p>
        <button
          type="button"
          onClick={() => setEntry(null)}
          className="mt-0.5 mb-3 text-sm font-medium text-brand-light hover:text-brand"
        >
          {t("chooseDifferentRole", locale)}
        </button>
        <AuthForm key={entry} mode={mode} defaultRole={entry} />
        <ResetAppButton variant="quiet" />
        <SwitchAuthLink mode={mode} />
      </>
    );
  }

  return (
    <>
      <p className="rm-label text-brand-light">{t("step1of2", locale)}</p>
      <h2 className="rm-serif mt-0.5 text-xl font-semibold text-foreground sm:text-2xl">
        {signingIn ? t("signIn", locale) : t("createAccount", locale)}
      </h2>
      <p className="mt-1 text-sm leading-5 text-muted">
        {signingIn ? t("chooseRole", locale) : t("createAccountWho", locale)}
      </p>
      <div className="mt-3 flex flex-col gap-1.5">
        {entries.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEntry(item.id)}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:px-4 ${item.tileClass}`}
          >
            <span>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">{item.title}</p>
              <p className="text-[0.95rem] font-bold leading-snug sm:text-base">
                {signingIn ? item.action : registerActions[item.id]}
              </p>
              <p className="text-xs leading-4 opacity-90 sm:text-sm sm:leading-5">{item.subtitle}</p>
            </span>
            <span className={`shrink-0 text-sm font-semibold ${item.chevronClass}`}>{t("next", locale)}</span>
          </button>
        ))}
      </div>
      <ResetAppButton variant="quiet" />
      <SwitchAuthLink mode={mode} />
    </>
  );
}

function SwitchAuthLink({ mode }: { mode: "login" | "register" }) {
  const { locale } = useClinicLocale();
  return (
    <p className="mt-3 text-center text-sm text-muted">
      {mode === "login" ? (
        <>
          {t("noAccountYet", locale)}{" "}
          <Link href="/register" className="font-semibold text-brand-light hover:text-brand">
            {t("createOne", locale)}
          </Link>
        </>
      ) : (
        <>
          {t("alreadyHaveAccount", locale)}{" "}
          <Link href="/login" className="font-semibold text-brand-light hover:text-brand">
            {t("signIn", locale)}
          </Link>
        </>
      )}
    </p>
  );
}
