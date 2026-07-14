"use client";

import { feedbackClass, type FeedbackState } from "@/lib/feedback";
import { t, type Locale } from "@/lib/i18n";

type FeedbackBoxProps = {
  state: FeedbackState;
  angle: number;
  target: number;
  locale?: Locale;
};

const labelKeys = {
  correct: "correctForm",
  almost: "almostThere",
  alert: "adjustForm",
  idle: "ready",
} as const;

export function FeedbackBox({ state, angle, target, locale = "en" }: FeedbackBoxProps) {
  return (
    <div className={feedbackClass(state)}>
      <p className="relative z-10 text-sm font-bold uppercase tracking-widest">
        {t(labelKeys[state], locale)}
      </p>
      <p className="relative z-10 rm-display mt-3">{angle}°</p>
      <p className="relative z-10 rm-body mt-2 text-base">
        {t("target", locale)}: {target}°
      </p>
    </div>
  );
}
