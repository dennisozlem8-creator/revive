"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadUsers, saveUsers, type User, type UserRole, type PTPrescription } from "@/lib/users";
import { logActivityToday } from "@/lib/streak";
import { addNotification } from "@/lib/notifications";
import { getPatientsForProvider } from "@/lib/provider-helpers";
import { logPainEntry, painSpikeDetected, type PainContext } from "@/lib/pain-tracker";
import { generateDailyPlan } from "@/lib/daily-plan";
import type { RomRecord } from "@/lib/users";

export type { ExerciseRecord, User, UserRole } from "@/lib/users";
export { loadUsers } from "@/lib/users";

type RegisterOptions = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  doctorEmail?: string;
  caregiverEmail?: string;
  notificationsEnabled?: boolean;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => string | null;
  register: (options: RegisterOptions) => string | null;
  logout: () => void;
  saveExerciseHistory: (
    areaId: string,
    exerciseIds: string[],
    metrics?: { angle?: number; reps?: number; pain?: number; emg?: number; hr?: number }
  ) => void;
  getPreviousExerciseIds: (areaId?: string) => string[];
  completeQuest: (questId: string, xp?: number) => void;
  getPatientsForDoctor: () => User[];
  getPatientsForCaregiver: () => User[];
  updateUser: (updates: Partial<User>) => void;
  logPain: (level: number, context: PainContext, note?: string) => void;
  refreshDailyPlan: () => void;
  setPatientPrescription: (patientEmail: string, prescription: PTPrescription) => void;
  sendEncouragementToPatient: (patientEmail: string, message: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "revive-motion-session";

function normalizeUser(raw: Partial<User> & Pick<User, "email" | "password" | "name">): User {
  return {
    name: raw.name,
    email: raw.email,
    password: raw.password,
    role: raw.role ?? "patient",
    doctorEmail: raw.doctorEmail,
    caregiverEmail: raw.caregiverEmail,
    notificationsEnabled: raw.notificationsEnabled ?? true,
    exerciseHistory: raw.exerciseHistory ?? [],
    questProgress: raw.questProgress ?? {},
    xp: raw.xp ?? 0,
    activityDates: raw.activityDates ?? [],
    setupComplete: raw.setupComplete ?? false,
    pin: raw.pin ?? "",
    injuryType: raw.injuryType ?? "wrist",
    baselineRom: raw.baselineRom ?? 0,
    targetRom: raw.targetRom ?? 90,
    sessionDays: raw.sessionDays ?? 5,
    sessionTime: raw.sessionTime ?? "morning",
    language: raw.language ?? "en",
    painToday: raw.painToday,
    painHistory: raw.painHistory ?? [],
    dailyPlan: raw.dailyPlan,
    romHistory: raw.romHistory ?? [],
    ptPrescription: raw.ptPrescription,
    lastCheckInDate: raw.lastCheckInDate,
    checkInAnswers: raw.checkInAnswers,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const found = loadUsers().find((u) => u.email === sessionEmail);
      setUser(found ? normalizeUser(found) : null);
    }
    setLoading(false);
  }, []);

  const persistUser = useCallback((updated: User) => {
    const users = loadUsers();
    const index = users.findIndex((u) => u.email === updated.email);
    if (index === -1) return;
    users[index] = updated;
    saveUsers(users);
    setUser(updated);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const found = loadUsers().find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return "Invalid email or password.";
    const normalized = normalizeUser(found);
    localStorage.setItem(SESSION_KEY, normalized.email);
    setUser(normalized);
    return null;
  }, []);

  const register = useCallback((options: RegisterOptions) => {
    const normalizedEmail = options.email.trim().toLowerCase();
    if (!options.name.trim()) return "Name is required.";
    if (!normalizedEmail.includes("@")) return "Enter a valid email.";
    if (options.password.length < 6) return "Password must be at least 6 characters.";

    const users = loadUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      return "An account with this email already exists.";
    }

    const newUser = normalizeUser({
      name: options.name.trim(),
      email: normalizedEmail,
      password: options.password,
      role: options.role,
      doctorEmail:
        options.role === "patient" && options.doctorEmail?.includes("@")
          ? options.doctorEmail.trim().toLowerCase()
          : undefined,
      caregiverEmail:
        options.role === "patient" && options.caregiverEmail?.includes("@")
          ? options.caregiverEmail.trim().toLowerCase()
          : undefined,
      notificationsEnabled: options.notificationsEnabled ?? true,
      exerciseHistory: [],
      questProgress: {},
      xp: 0,
      activityDates: [],
    });

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, normalizedEmail);
    setUser(newUser);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const saveExerciseHistory = useCallback(
    (
      areaId: string,
      exerciseIds: string[],
      metrics?: { angle?: number; reps?: number; pain?: number; emg?: number; hr?: number }
    ) => {
      if (!user) return;
      const romRecord: RomRecord | undefined =
        metrics?.angle !== undefined
          ? {
              date: new Date().toISOString(),
              peakAngle: metrics.angle,
              reps: metrics.reps ?? 0,
              emg: metrics.emg ?? 0,
              hr: metrics.hr ?? 0,
            }
          : undefined;

      persistUser({
        ...user,
        exerciseHistory: [
          ...user.exerciseHistory,
          {
            areaId,
            exerciseIds,
            completedAt: new Date().toISOString(),
            angle: metrics?.angle,
            reps: metrics?.reps,
            pain: metrics?.pain,
          },
        ],
        romHistory: romRecord ? [...(user.romHistory ?? []), romRecord].slice(-60) : user.romHistory,
        activityDates: logActivityToday(user.activityDates),
      });
    },
    [user, persistUser]
  );

  const getPreviousExerciseIds = useCallback(
    (areaId?: string) => {
      if (!user) return [];
      const records = areaId
        ? user.exerciseHistory.filter((r) => r.areaId === areaId)
        : user.exerciseHistory;
      return records.flatMap((r) => r.exerciseIds);
    },
    [user]
  );

  const completeQuest = useCallback(
    (questId: string, xp = 50) => {
      if (!user) return;
      persistUser({
        ...user,
        questProgress: { ...user.questProgress, [questId]: true },
        xp: user.xp + xp,
        activityDates: logActivityToday(user.activityDates),
      });
    },
    [user, persistUser]
  );

  const getPatientsForDoctor = useCallback(() => {
    if (!user || user.role !== "doctor") return [];
    return getPatientsForProvider(user, "doctor", loadUsers());
  }, [user]);

  const getPatientsForCaregiver = useCallback(() => {
    if (!user || user.role !== "caregiver") return [];
    return getPatientsForProvider(user, "caregiver", loadUsers());
  }, [user]);

  const logPain = useCallback(
    (level: number, context: PainContext, note?: string) => {
      if (!user) return;
      const history = logPainEntry(user.painHistory ?? [], {
        level,
        context,
        note,
        bodyArea: user.injuryType,
      });
      const spike = painSpikeDetected(history, level);
      persistUser({ ...user, painHistory: history, painToday: level });

      if (spike && user.doctorEmail) {
        addNotification({
          toEmail: user.doctorEmail,
          role: "doctor",
          title: "Pain spike detected",
          message: `${user.name} reported ${level}/10 (${context}). 7-day trend exceeded.`,
        });
      }
    },
    [user, persistUser]
  );

  const refreshDailyPlan = useCallback(() => {
    if (!user || user.role !== "patient") return;
    const plan = generateDailyPlan(user);
    persistUser({ ...user, dailyPlan: plan });
  }, [user, persistUser]);

  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (!user) return;
      persistUser({ ...user, ...updates });
    },
    [user, persistUser]
  );

  const setPatientPrescription = useCallback(
    (patientEmail: string, prescription: PTPrescription) => {
      const users = loadUsers();
      const index = users.findIndex((u) => u.email === patientEmail);
      if (index === -1) return;
      users[index].ptPrescription = prescription;
      saveUsers(users);
      if (user?.email === patientEmail) setUser({ ...users[index] });
    },
    [user]
  );

  const sendEncouragementToPatient = useCallback(
    (patientEmail: string, message: string) => {
      if (!user || user.role !== "caregiver") return;
      addNotification({
        toEmail: patientEmail,
        role: "patient",
        title: `Message from ${user.name.split(" ")[0]}`,
        message,
      });
      addNotification({
        toEmail: user.email,
        role: "caregiver",
        title: "Encouragement sent",
        message: `Your note was delivered to your linked patient.`,
      });
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      saveExerciseHistory,
      getPreviousExerciseIds,
      completeQuest,
      getPatientsForDoctor,
      getPatientsForCaregiver,
      updateUser,
      logPain,
      refreshDailyPlan,
      setPatientPrescription,
      sendEncouragementToPatient,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      saveExerciseHistory,
      getPreviousExerciseIds,
      completeQuest,
      getPatientsForDoctor,
      getPatientsForCaregiver,
      updateUser,
      logPain,
      refreshDailyPlan,
      setPatientPrescription,
      sendEncouragementToPatient,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
