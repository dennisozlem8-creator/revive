import type { User } from "@/lib/users";
import { calculateStreak } from "@/lib/streak";
import { summarizeCheckIn } from "@/lib/pre-briefing-questions";

export function isProvider(role?: string) {
  return role === "doctor" || role === "caregiver";
}

export function getPatientsForProvider(provider: User, role: "doctor" | "caregiver", allUsers: User[]) {
  const linkField = role === "doctor" ? "doctorEmail" : "caregiverEmail";
  return allUsers.filter(
    (u) => u.role === "patient" && u[linkField] === provider.email
  );
}

export function patientCompliance(patient: User) {
  const streak = calculateStreak(patient);
  if (streak >= 5) return 95;
  if (streak >= 3) return 87;
  if (streak >= 1) return 72;
  return 45;
}

export function patientCheckInSummary(patient: User) {
  if (!patient.checkInAnswers) return "No check-in today";
  return summarizeCheckIn(patient.checkInAnswers);
}

export function patientNeedsEncouragement(patient: User) {
  return calculateStreak(patient) < 2 || (patient.painToday ?? 0) >= 6;
}
