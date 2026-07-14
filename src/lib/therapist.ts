import type { User } from "./users";
import type { Locale } from "./i18n";
import { computeOutcomeMetrics } from "./progress-analytics";
import { getCurrentPhase, generateTreatmentPlan } from "./treatment-plan";
import { getChatResponse } from "./chat-bot";

const esFaq: { keywords: string[]; answer: string }[] = [
  { keywords: ["dolor", "duele"], answer: "El dolor leve después del ejercicio puede ser normal. Detente si el dolor es agudo o empeora. Registra tu dolor en cada sesión." },
  { keywords: ["racha", "días"], answer: "Tu racha cuenta los días consecutivos que completas ejercicios. Haz al menos una sesión al día para mantenerla." },
  { keywords: ["rom", "movimiento"], answer: "El ROM mide cuánto se mueve una articulación. Usa tu sensor durante la prueba ROM y revisa tus gráficas de progreso." },
  { keywords: ["ejercicio", "plan"], answer: "Sigue el plan de hoy en tu resumen. El entrenador adapta la dificultad según tu dolor y progreso." },
  { keywords: ["hola", "buenos"], answer: "¡Hola! Soy tu asistente de terapia de Revive Motion. ¿En qué puedo ayudarte hoy?" },
];

export function getTherapistResponse(input: string, user?: User | null, locale: Locale = "en"): string {
  const message = input.toLowerCase().trim();
  if (!message) {
    return locale === "es"
      ? "Escribe una pregunta y te ayudaré con tu recuperación."
      : "Type a question and I will help with your recovery.";
  }

  if (locale === "es") {
    for (const entry of esFaq) {
      if (entry.keywords.some((kw) => message.includes(kw))) {
        return personalize(entry.answer, user);
      }
    }
  }

  const base = getChatResponse(input);
  if (base.includes("not sure") || base.includes("no estoy seguro")) {
    return buildContextualResponse(message, user, locale);
  }
  return personalize(base, user);
}

function personalize(text: string, user?: User | null): string {
  if (!user) return text;
  const first = user.name.split(" ")[0];
  return `${first}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

function buildContextualResponse(message: string, user: User | null | undefined, locale: Locale): string {
  if (!user) {
    return locale === "es"
      ? "Pregunta sobre ejercicios, dolor, ROM o tu plan de tratamiento."
      : "Ask about exercises, pain, ROM, or your treatment plan.";
  }

  const metrics = computeOutcomeMetrics(user);
  const plan = user.treatmentPlan ?? generateTreatmentPlan(user);
  const phase = getCurrentPhase(plan);
  const first = user.name.split(" ")[0];

  if (message.includes("progress") || message.includes("progreso") || message.includes("report")) {
    if (locale === "es") {
      return `${first}, llevas ${metrics.sessionsCompleted} sesiones, ${metrics.compliancePercent}% de cumplimiento, y ${metrics.romGain}° de ganancia ROM. Fase actual: ${phase.focus}.`;
    }
    return `${first}, you have ${metrics.sessionsCompleted} sessions, ${metrics.compliancePercent}% compliance, and ${metrics.romGain}° ROM gain. Current phase: ${phase.focus}.`;
  }

  if (message.includes("pain") || message.includes("dolor")) {
    const pain = user.painToday ?? 3;
    if (locale === "es") {
      return pain >= 7
        ? `${first}, tu dolor está elevado (${pain}/10). Descansa hoy y haz solo movilidad suave.`
        : `${first}, tu dolor hoy es ${pain}/10. Sigue el plan adaptado y detente si sube por encima de 6.`;
    }
    return pain >= 7
      ? `${first}, your pain is elevated (${pain}/10). Rest today and stick to gentle mobility only.`
      : `${first}, your pain today is ${pain}/10. Follow your adapted plan and stop if it rises above 6.`;
  }

  if (message.includes("today") || message.includes("hoy") || message.includes("plan")) {
    const rx = user.ptPrescription;
    const name = rx?.exerciseName ?? (locale === "es" ? "tu ejercicio prescrito" : "your prescribed exercise");
    if (locale === "es") {
      return `Enfoque de hoy: ${name}. Meta: ${rx?.sets ?? 3} series × ${rx?.reps ?? 10} repeticiones. Semana ${plan.currentWeek}: ${phase.focus}.`;
    }
    return `Today's focus: ${name}. Target: ${rx?.sets ?? 3} sets × ${rx?.reps ?? 10} reps. Week ${plan.currentWeek}: ${phase.focus}.`;
  }

  return locale === "es"
    ? `${first}, puedo ayudarte con ejercicios, dolor, progreso y tu plan de tratamiento. ¿Qué necesitas?`
    : `${first}, I can help with exercises, pain, progress, and your treatment plan. What do you need?`;
}
