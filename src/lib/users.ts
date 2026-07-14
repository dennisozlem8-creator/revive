import type { PainEntry } from "./pain-tracker";
import type { DailyPlan } from "./daily-plan";

import type { TreatmentPlan } from "./treatment-plan";

export type InjuryType = "knee" | "ankle" | "elbow" | "wrist" | "other";

export type PTPrescription = {
  exerciseName: string;
  sets: number;
  reps: number;
  holdSeconds: number;
  targetAngle: number;
  notes: string;
  updatedAt: string;
};

export type UserRole = "patient" | "doctor" | "caregiver";

export type ExerciseRecord = {
  areaId: string;
  exerciseIds: string[];
  completedAt: string;
  reps?: number;
  angle?: number;
  pain?: number;
};

export type RomRecord = {
  date: string;
  peakAngle: number;
  reps: number;
  emg: number;
  hr: number;
};

export type User = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  doctorEmail?: string;
  caregiverEmail?: string;
  notificationsEnabled: boolean;
  exerciseHistory: ExerciseRecord[];
  questProgress: Record<string, boolean>;
  xp: number;
  activityDates: string[];
  setupComplete: boolean;
  pin: string;
  injuryType: InjuryType;
  baselineRom: number;
  targetRom: number;
  sessionDays: number;
  sessionTime: "morning" | "afternoon" | "evening";
  language: "en" | "es";
  painToday?: number;
  painHistory?: PainEntry[];
  dailyPlan?: DailyPlan;
  romHistory?: RomRecord[];
  ptPrescription?: PTPrescription;
  lastCheckInDate?: string;
  checkInAnswers?: Record<string, string | number>;
  treatmentPlan?: TreatmentPlan;
};

const USERS_KEY = "revive-motion-users";

const defaultTargetRom: Record<InjuryType, number> = {
  knee: 130,
  ankle: 20,
  elbow: 140,
  wrist: 90,
  other: 90,
};

export function simulateBaselineRom(injury: InjuryType) {
  const target = getDefaultTargetRom(injury);
  return Math.round(target * (0.35 + Math.random() * 0.2));
}

export function getDefaultTargetRom(injury: InjuryType) {
  return defaultTargetRom[injury];
}

export function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as Partial<User>[];
    return raw.map((u) => ({
      name: u.name ?? "",
      email: u.email ?? "",
      password: u.password ?? "",
      role: u.role ?? "patient",
      doctorEmail: u.doctorEmail,
      caregiverEmail: u.caregiverEmail,
      notificationsEnabled: u.notificationsEnabled ?? true,
      exerciseHistory: u.exerciseHistory ?? [],
      questProgress: u.questProgress ?? {},
      xp: u.xp ?? 0,
      activityDates: u.activityDates ?? [],
      setupComplete: u.setupComplete ?? false,
      pin: u.pin ?? "",
      injuryType: u.injuryType ?? "wrist",
      baselineRom: u.baselineRom ?? 0,
      targetRom: u.targetRom ?? 90,
      sessionDays: u.sessionDays ?? 5,
      sessionTime: u.sessionTime ?? "morning",
      language: u.language ?? "en",
      painToday: u.painToday,
      painHistory: u.painHistory ?? [],
      dailyPlan: u.dailyPlan,
      romHistory: u.romHistory ?? [],
      ptPrescription: u.ptPrescription,
      lastCheckInDate: u.lastCheckInDate,
      checkInAnswers: u.checkInAnswers,
      treatmentPlan: u.treatmentPlan,
    }));
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
