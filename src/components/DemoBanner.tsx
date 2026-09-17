"use client";

import Link from "next/link";
import { isDemoEmail } from "@/lib/demo-account";
import { DEMO_CLINIC_EMAIL, DEMO_PASSWORD, DEMO_PATIENT_EMAIL } from "@/lib/demo-account";
import { tf, t, type Locale } from "@/lib/i18n";
import { useAuth } from "./AuthProvider";

export function DemoBanner({ locale }: { locale: Locale }) {
  const { user } = useAuth();
  if (!user || !isDemoEmail(user.email)) return null;

  const clinician = user.email === DEMO_CLINIC_EMAIL;

  return (
    <div className="mb-5 rounded-[1.2rem] bg-[#e8f3fb] px-4 py-3 text-sm leading-6 text-[#1b3348] ring-1 ring-[#4f90c6]/20">
      <p className="font-semibold">{t("demoKicker", locale)}</p>
      <p className="mt-1">{clinician ? t("demoClinicianBanner", locale) : t("demoBanner", locale)}</p>
      <p className="mt-2 text-xs text-[#2f4a60]">
        {tf("demoCredentials", locale, { email: DEMO_PATIENT_EMAIL, password: DEMO_PASSWORD })}
      </p>
      <Link href="/report" className="mt-3 inline-flex text-sm font-semibold text-[#1b3348]">
        {t("openReport", locale)} →
      </Link>
    </div>
  );
}
