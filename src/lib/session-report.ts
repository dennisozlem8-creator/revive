import { loadMeasurements, type GoniometerMeasurement } from "./goniometer";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import { loadMyoWareRecordings } from "./myoware-log";
import { summarizeCheckIn } from "./pre-briefing-questions";
import type { User } from "./users";

export type SessionReportData = {
  patientName: string;
  email: string;
  date: string;
  exercise: string;
  joint: string;
  photo: GoniometerMeasurement | null;
  motion: GoniometerMeasurement | null;
  musclePeak: number | null;
  muscleDevice: string | null;
  pain: number | null;
  checkIn: string | null;
  goal: number;
};

function latestOf(rows: GoniometerMeasurement[], source: GoniometerMeasurement["source"]) {
  return rows
    .filter((row) => row.source === source)
    .sort((a, b) => a.date.localeCompare(b.date))
    .at(-1) ?? null;
}

export function buildSessionReport(user: User): SessionReportData {
  const clips = loadMeasurements(user.email);
  const muscle = loadMyoWareRecordings(user.email).at(-1) ?? null;
  const photo = latestOf(clips, "photo") ?? latestOf(clips, "video");
  const motion = latestOf(clips, "motion");
  return {
    patientName: user.name,
    email: user.email,
    date: new Date().toISOString(),
    exercise: user.ptPrescription?.exerciseName ?? photo?.exercise ?? motion?.exercise ?? "—",
    joint: photo?.joint ?? motion?.joint ?? "—",
    photo,
    motion,
    musclePeak: muscle?.maxEmg ?? latestOf(clips, "muscle")?.angle ?? null,
    muscleDevice: muscle?.deviceName ?? null,
    pain: user.painToday ?? null,
    checkIn: user.checkInAnswers ? summarizeCheckIn(user.checkInAnswers) : null,
    goal: user.targetRom || 100,
  };
}

export function formatReportText(report: SessionReportData, locale: Locale) {
  const none = t("noReading", locale);
  const lines = [
    `Revive Motion — ${t("sessionReport", locale)}`,
    `${t("patient", locale)}: ${report.patientName}`,
    `${t("reportDate", locale)}: ${new Date(report.date).toLocaleString(locale === "es" ? "es" : "en")}`,
    `${t("todaysExercise", locale)}: ${report.exercise}`,
    `${t("joint", locale)}: ${report.joint}`,
    `${t("stillPhoto", locale)}: ${report.photo ? `${report.photo.angle}°` : none}`,
    `${t("liveMotion", locale)}: ${report.motion ? `${report.motion.angle}°` : none}`,
    `${t("musclePeak", locale)}: ${report.musclePeak != null ? String(report.musclePeak) : none}`,
    `${t("pain", locale)}: ${report.pain != null ? `${report.pain} / 10` : none}`,
    `${t("notADiagnosis", locale)}`,
  ];
  return lines.join("\n");
}
