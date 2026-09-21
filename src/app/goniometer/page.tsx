"use client";

import Link from "next/link";
import { DashIntro, DashShell } from "@/components/clinic/DashKit";
import { PhotoGoniometer } from "@/components/PhotoGoniometer";
import { useAuth } from "@/components/AuthProvider";
import { PhotoFrame } from "@/components/LandingMedia";
import { ReportActions } from "@/components/ReportActions";
import { clinicLocale, t } from "@/lib/i18n";

export default function GoniometerPage() {
  const { user, loading } = useAuth();
  const locale = clinicLocale(user);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center text-[#2f4a60]">
        {t("loadingCamera", locale)}
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashShell wide={false}>
      <DashIntro
        kicker={t("measure", locale)}
        title={t("wayPhotoTitle", locale)}
        text={t("photoHelp", locale)}
      />
      <PhotoFrame
        src="/images/landing-photo-goniometer.png?v=2"
        alt=""
        className="mt-5 h-36 rounded-[1.35rem] sm:h-44"
      />
      <div className="mt-6">
        <PhotoGoniometer userEmail={user.email} goal={user.targetRom || 100} />
      </div>
      <p className="mt-8 text-center text-sm leading-6 text-[#2f4a60]">
        {t("notADiagnosis", locale)}
      </p>
      <p className="mt-4 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
        <ReportActions locale={locale} />
        <Link href="/charts" className="text-sm font-semibold text-[#1b3348]">
          {t("openProgressCharts", locale)} →
        </Link>
      </p>
    </DashShell>
  );
}
