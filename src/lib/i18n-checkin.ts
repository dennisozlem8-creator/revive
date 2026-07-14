import type { Locale } from "./i18n";

const questions: Record<string, { en: string; es: string }> = {
  sleep: { en: "How did you sleep last night?", es: "¿Cómo dormiste anoche?" },
  energy: { en: "Energy level right now?", es: "¿Cuál es tu nivel de energía ahora?" },
  medication: { en: "Did you take prescribed medication today?", es: "¿Tomaste la medicación prescrita hoy?" },
  swelling: { en: "Any swelling since yesterday?", es: "¿Hubo hinchazón desde ayer?" },
  yesterday: { en: "Did you complete yesterday's exercises?", es: "¿Completaste los ejercicios de ayer?" },
  confidence: { en: "Confidence in doing today's session?", es: "¿Qué tan seguro te sientes para la sesión de hoy?" },
  "knee-stiffness": { en: "Morning knee stiffness today?", es: "¿Rigidez en la rodilla esta mañana?" },
  "knee-stairs": { en: "Pain on stairs or squatting?", es: "¿Dolor al subir escaleras o agacharte?" },
  "knee-giving-way": { en: "Any giving-way or buckling?", es: "¿Alguna inestabilidad o cedida de la rodilla?" },
  "ankle-stiffness": { en: "Ankle stiffness when you wake up?", es: "¿Rigidez en el tobillo al despertar?" },
  "ankle-walking": { en: "Pain while walking today?", es: "¿Dolor al caminar hoy?" },
  "ankle-balance": { en: "Balance on uneven ground?", es: "¿Equilibrio en terreno irregular?" },
  "elbow-stiffness": { en: "Elbow stiffness this morning?", es: "¿Rigidez en el codo esta mañana?" },
  "elbow-grip": { en: "Grip strength compared to yesterday?", es: "¿Fuerza de agarre comparada con ayer?" },
  "elbow-lifting": { en: "Pain when lifting or reaching?", es: "¿Dolor al levantar o alcanzar?" },
  "wrist-stiffness": { en: "Wrist stiffness this morning?", es: "¿Rigidez en la muñeca esta mañana?" },
  "wrist-typing": { en: "Discomfort with typing or gripping?", es: "¿Molestia al escribir o agarrar?" },
  "wrist-numbness": { en: "Any numbness or tingling?", es: "¿Entumecimiento u hormigueo?" },
  "other-stiffness": { en: "Stiffness in the affected area today?", es: "¿Rigidez en la zona afectada hoy?" },
  "other-movement": { en: "Pain with everyday movement?", es: "¿Dolor con movimientos cotidianos?" },
  "other-confidence": { en: "Comfort moving the injured area?", es: "¿Comodidad al mover la zona lesionada?" },
};

const options: Record<string, { en: string[]; es: string[] }> = {
  sleep: {
    en: ["Great — 7+ hours", "OK — some rest", "Poor — disrupted"],
    es: ["Bien — 7+ horas", "Regular — algo de descanso", "Mal — interrumpido"],
  },
  medication: {
    en: ["Yes", "No", "Not prescribed"],
    es: ["Sí", "No", "No prescrito"],
  },
  swelling: {
    en: ["None", "Slight", "Noticeable"],
    es: ["Ninguna", "Leve", "Notable"],
  },
  yesterday: {
    en: ["Yes, fully", "Partially", "No / rest day"],
    es: ["Sí, completamente", "Parcialmente", "No / día de descanso"],
  },
  "knee-stiffness": {
    en: ["None", "Mild", "Moderate", "Severe"],
    es: ["Ninguna", "Leve", "Moderada", "Severa"],
  },
  "knee-stairs": {
    en: ["No", "A little", "Yes, limits activity"],
    es: ["No", "Un poco", "Sí, limita actividad"],
  },
  "knee-giving-way": {
    en: ["No", "Once", "More than once"],
    es: ["No", "Una vez", "Más de una vez"],
  },
  "ankle-stiffness": {
    en: ["None", "Mild", "Moderate", "Severe"],
    es: ["Ninguna", "Leve", "Moderada", "Severa"],
  },
  "ankle-walking": {
    en: ["No", "Mild", "Moderate", "Severe"],
    es: ["No", "Leve", "Moderada", "Severa"],
  },
  "ankle-balance": {
    en: ["Steady", "Slightly unsteady", "Very unsteady"],
    es: ["Estable", "Ligeramente inestable", "Muy inestable"],
  },
  "elbow-stiffness": {
    en: ["None", "Mild", "Moderate", "Severe"],
    es: ["Ninguna", "Leve", "Moderada", "Severa"],
  },
  "elbow-grip": {
    en: ["Better", "Same", "Weaker"],
    es: ["Mejor", "Igual", "Más débil"],
  },
  "elbow-lifting": {
    en: ["No", "Light loads only", "Most movements"],
    es: ["No", "Solo cargas ligeras", "La mayoría de movimientos"],
  },
  "wrist-stiffness": {
    en: ["None", "Mild", "Moderate", "Severe"],
    es: ["Ninguna", "Leve", "Moderada", "Severa"],
  },
  "wrist-typing": {
    en: ["No", "After a while", "Immediately"],
    es: ["No", "Después de un rato", "Inmediatamente"],
  },
  "wrist-numbness": {
    en: ["No", "Occasionally", "Often"],
    es: ["No", "Ocasionalmente", "A menudo"],
  },
  "other-stiffness": {
    en: ["None", "Mild", "Moderate", "Severe"],
    es: ["Ninguna", "Leve", "Moderada", "Severa"],
  },
  "other-movement": {
    en: ["No", "A little", "Yes, limits activity"],
    es: ["No", "Un poco", "Sí, limita actividad"],
  },
  "other-confidence": {
    en: ["Confident", "Somewhat", "Very cautious"],
    es: ["Seguro", "Algo seguro", "Muy cauteloso"],
  },
};

export function localizeQuestion(id: string, locale: Locale): string {
  return questions[id]?.[locale] ?? questions[id]?.en ?? id;
}

export function localizeOptions(id: string, locale: Locale, englishOptions?: string[]): string[] {
  if (options[id]) return options[id][locale];
  return englishOptions ?? [];
}

export function optionToEnglish(id: string, localizedValue: string): string {
  const opt = options[id];
  if (!opt) return localizedValue;
  const esIndex = opt.es.indexOf(localizedValue);
  if (esIndex >= 0) return opt.en[esIndex];
  return localizedValue;
}
