"use client";

import Link from "next/link";
import { DashCard, DashIntro, DashPhotoLink, DashShell } from "@/components/clinic/DashKit";
import { PreBriefingFlow } from "@/components/PreBriefingFlow";
import { useAuth } from "@/components/AuthProvider";
import { clinicLocale, t } from "@/lib/i18n";

export default function CheckInPage() {
  const { user } = useAuth();
  const locale = clinicLocale(user);

  return (
    <DashShell nav={false} wide={false}>
      <DashIntro
        kicker={t("checkIn", locale)}
        title={t("checkInTitle", locale)}
        text={t("checkInText", locale)}
      />
      <DashCard className="mt-6 p-5 sm:p-6">
        <PreBriefingFlow />
      </DashCard>
      <div className="mt-6">
        <DashPhotoLink
          href="/goniometer"
          src="/images/landing-photo-goniometer.png?v=2"
          kicker={t("afterCheckIn", locale)}
          title={t("photoGoniometer", locale)}
          text={t("photoClipHelp", locale)}
        />
      </div>
      <p className="mt-4 text-center">
        <Link href="/briefing" className="text-sm font-semibold text-[#1b3348]">
          {t("backToBriefing", locale)} →
        </Link>
      </p>
    </DashShell>
  );
}
