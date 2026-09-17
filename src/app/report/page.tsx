"use client";

import { DashCard, DashIntro, DashShell, DashStat } from "@/components/clinic/DashKit";
import { DemoBanner } from "@/components/DemoBanner";
import { useAuth } from "@/components/AuthProvider";
import { buildSessionReport, formatReportText } from "@/lib/session-report";
import { clinicLocale, t } from "@/lib/i18n";

function ValueCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <DashStat label={label} value={value} hint={hint} />
  );
}

export default function SessionReportPage() {
  const { user } = useAuth();
  if (!user) return null;
  const locale = clinicLocale(user);
  const report = buildSessionReport(user);
  const dateLabel = new Date(report.date).toLocaleString(locale === "es" ? "es" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  function printReport() {
    window.print();
  }

  function downloadReport() {
    const blob = new Blob([formatReportText(report, locale)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `revive-motion-session-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashShell nav={false} wide={false}>
      <div className="print:hidden">
        <DemoBanner locale={locale} />
      </div>
      <DashIntro
        kicker={t("reportKicker", locale)}
        title={t("sessionReport", locale)}
        text={t("sessionReportText", locale)}
      />

      <div className="print:hidden mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={printReport} className="rm-btn rm-btn-brand h-11 min-h-0 rounded-full px-6">
          {t("printReport", locale)}
        </button>
        <button
          type="button"
          onClick={downloadReport}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#4f90c6]/30 bg-white px-6 text-sm font-semibold text-[#1b3348]"
        >
          {t("downloadReport", locale)}
        </button>
      </div>

      <DashCard className="mt-6 p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#2f4a60]">{t("patient", locale)}</p>
        <h2 className="rm-serif mt-1 text-3xl font-semibold text-[#1b3348]">{report.patientName}</h2>
        <p className="mt-2 text-base text-[#2f4a60]">
          {t("reportDate", locale)}: {dateLabel}
        </p>
        <p className="mt-1 text-base text-[#2f4a60]">
          {t("todaysExercise", locale)}: {report.exercise} · {t("joint", locale)}: {report.joint}
        </p>
      </DashCard>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ValueCard
          label={t("stillPhoto", locale)}
          value={report.photo ? `${report.photo.angle}°` : t("noReading", locale)}
          hint={report.photo?.note}
        />
        <ValueCard
          label={t("liveMotion", locale)}
          value={report.motion ? `${report.motion.angle}°` : t("noReading", locale)}
          hint={report.motion?.note}
        />
        <ValueCard
          label={t("musclePeak", locale)}
          value={report.musclePeak != null ? String(report.musclePeak) : t("noReading", locale)}
          hint={report.muscleDevice ?? undefined}
        />
        <ValueCard
          label={t("pain", locale)}
          value={report.pain != null ? `${report.pain} / 10` : t("noReading", locale)}
          hint={report.checkIn ?? undefined}
        />
      </div>

      <p className="mt-6 text-center text-sm leading-6 text-[#2f4a60]">{t("notADiagnosis", locale)}</p>
    </DashShell>
  );
}
