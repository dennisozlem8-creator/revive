import type { User } from "./users";
import { todayDateString } from "./streak";
import { patientCompliance, romGain } from "./progress-analytics";

export type TreatmentPhase = {
  week: number;
  focus: string;
  goals: string[];
  exercises: string[];
  intensity: "gentle" | "moderate" | "progressive";
};

export type TreatmentPlan = {
  injuryType: string;
  startDate: string;
  currentWeek: number;
  totalWeeks: number;
  phases: TreatmentPhase[];
  updatedAt: string;
  prescribedBy?: string;
};

const phaseTemplates: Record<string, TreatmentPhase[]> = {
  knee: [
    { week: 1, focus: "Reduce swelling, restore flexion", goals: ["Pain below 5/10", "Heel slide to 90°"], exercises: ["Heel slides", "Quad sets", "Ankle pumps"], intensity: "gentle" },
    { week: 2, focus: "Build ROM and stability", goals: ["Full extension", "10 reps heel slides"], exercises: ["Heel slides", "Mini squats", "Calf raises"], intensity: "moderate" },
    { week: 3, focus: "Strength and function", goals: ["Stairs without pain", "Target ROM 80%"], exercises: ["Step-ups", "Wall sits", "Balance drills"], intensity: "moderate" },
    { week: 4, focus: "Return to activity", goals: ["Meet target ROM", "5-day streak"], exercises: ["Lunges", "Single-leg balance", "Functional squats"], intensity: "progressive" },
  ],
  ankle: [
    { week: 1, focus: "Mobility and swelling control", goals: ["Pain below 5/10", "Alphabet ROM"], exercises: ["Ankle circles", "Towel stretch", "Calf stretch"], intensity: "gentle" },
    { week: 2, focus: "Strength in safe range", goals: ["Walk 15 min", "Balance 30 sec"], exercises: ["Resisted flexion", "Heel raises", "Balance board"], intensity: "moderate" },
    { week: 3, focus: "Proprioception", goals: ["Uneven surface walking", "Single-leg stand"], exercises: ["Single-leg balance", "Lateral steps", "Calf raises"], intensity: "moderate" },
    { week: 4, focus: "Sport-ready basics", goals: ["Jog readiness", "Full ROM"], exercises: ["Jump rope prep", "Lateral hops", "Dynamic stretches"], intensity: "progressive" },
  ],
  wrist: [
    { week: 1, focus: "Gentle mobility", goals: ["Pain below 5/10", "Daily wrist circles"], exercises: ["Wrist circles", "Flexor stretch", "Tendon glides"], intensity: "gentle" },
    { week: 2, focus: "Grip and endurance", goals: ["10 min typing tolerance", "Grip strength"], exercises: ["Grip squeeze", "Wrist extensions", "Pronation/supination"], intensity: "moderate" },
    { week: 3, focus: "Functional loading", goals: ["Lift light objects", "Full ROM"], exercises: ["Wrist curls", "Radial/ulnar deviation", "Functional reach"], intensity: "moderate" },
    { week: 4, focus: "Return to work tasks", goals: ["Full workday tolerance", "No night pain"], exercises: ["Typing drills", "Resistance band work", "Strengthening"], intensity: "progressive" },
  ],
  elbow: [
    { week: 1, focus: "Pain control and ROM", goals: ["Pain below 5/10", "Full extension"], exercises: ["Elbow flexion", "Wrist extensor stretch", "Isometrics"], intensity: "gentle" },
    { week: 2, focus: "Eccentric loading", goals: ["Grip without pain", "Daily tasks"], exercises: ["Wrist extensor eccentrics", "Grip work", "Forearm stretch"], intensity: "moderate" },
    { week: 3, focus: "Strength return", goals: ["Lift 5 lb objects", "Sport prep"], exercises: ["Resistance band flex/extend", "Pronation work", "Functional lifts"], intensity: "moderate" },
    { week: 4, focus: "Activity return", goals: ["Full strength", "No flare-ups"], exercises: ["Progressive loading", "Sport-specific drills", "Endurance work"], intensity: "progressive" },
  ],
  other: [
    { week: 1, focus: "Pain management and mobility", goals: ["Pain below 5/10", "Daily movement"], exercises: ["Gentle ROM", "Breathing", "Light stretching"], intensity: "gentle" },
    { week: 2, focus: "Build consistency", goals: ["3 sessions/week", "Improved ROM"], exercises: ["ROM exercises", "Core stability", "Walking"], intensity: "moderate" },
    { week: 3, focus: "Strength building", goals: ["Meet 50% ROM goal", "5-day streak"], exercises: ["Resistance work", "Balance", "Functional movement"], intensity: "moderate" },
    { week: 4, focus: "Independence", goals: ["Meet target ROM", "Self-manage pain"], exercises: ["Progressive exercises", "Home program", "Endurance"], intensity: "progressive" },
  ],
};

export function generateTreatmentPlan(user: User, prescribedBy?: string): TreatmentPlan {
  const phases = phaseTemplates[user.injuryType] ?? phaseTemplates.other;
  const start = user.lastCheckInDate ?? todayDateString();
  const weeksSince = Math.floor(
    (Date.now() - new Date(start).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  const currentWeek = Math.min(4, Math.max(1, weeksSince + 1));

  return {
    injuryType: user.injuryType,
    startDate: start,
    currentWeek,
    totalWeeks: 4,
    phases,
    updatedAt: new Date().toISOString(),
    prescribedBy: prescribedBy ?? user.doctorEmail,
  };
}

export function getCurrentPhase(plan: TreatmentPlan): TreatmentPhase {
  return plan.phases.find((p) => p.week === plan.currentWeek) ?? plan.phases[0];
}

export function treatmentPlanProgress(user: User, plan: TreatmentPlan): string[] {
  const compliance = patientCompliance(user);
  const gain = romGain(user);
  const notes: string[] = [];
  if (compliance >= 80) notes.push("Excellent adherence to your plan.");
  else if (compliance >= 50) notes.push("Good progress — try to complete more sessions this week.");
  else notes.push("Low adherence — shorter daily sessions may help build consistency.");
  if (gain > 10) notes.push(`ROM improved ${gain}° since baseline.`);
  return notes;
}
