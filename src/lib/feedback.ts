export type FeedbackState = "correct" | "almost" | "alert" | "idle";

export function getFeedbackState(angle: number, target: number): FeedbackState {
  if (angle <= 0) return "idle";
  const pct = angle / target;
  if (pct >= 1) return "correct";
  if (pct >= 0.88) return "almost";
  return "alert";
}

export function feedbackClass(state: FeedbackState): string {
  return `rm-feedback rm-feedback--${state}`;
}
