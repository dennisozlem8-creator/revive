import type { Locale } from "./i18n";

let voiceEnabled = true;

export function setVoiceGuideEnabled(enabled: boolean) {
  voiceEnabled = enabled;
}

export function isVoiceGuideEnabled() {
  return voiceEnabled;
}

export function speakCue(text: string, locale: Locale = "en") {
  if (typeof window === "undefined" || !voiceEnabled) return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale === "es" ? "es-ES" : "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

const cues = {
  en: {
    start: "Starting exercise. Move slowly and breathe.",
    correct: "Correct form. Keep going.",
    almost: "Almost there. Extend a little more.",
    adjust: "Adjust your form. Move within a comfortable range.",
    rep: "Good rep.",
    complete: "Exercise complete. Rest before the next one.",
    rest: "Take a short rest.",
  },
  es: {
    start: "Comenzando el ejercicio. Muévete despacio y respira.",
    correct: "Forma correcta. Sigue así.",
    almost: "Casi lo logras. Extiende un poco más.",
    adjust: "Corrige tu forma. Muévete dentro de un rango cómodo.",
    rep: "Buena repetición.",
    complete: "Ejercicio completo. Descansa antes del siguiente.",
    rest: "Toma un breve descanso.",
  },
} as const;

export type VoiceCueKey = keyof typeof cues.en;

export function getVoiceCue(key: VoiceCueKey, locale: Locale = "en"): string {
  return cues[locale][key] ?? cues.en[key];
}

export function speakVoiceCue(key: VoiceCueKey, locale: Locale = "en") {
  speakCue(getVoiceCue(key, locale), locale);
}
