const CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bwant to die\b/i,
  /\bwanna die\b/i,
  /\bend my life\b/i,
  /\btake my own life\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bdon'?t want to (?:be alive|live)\b/i,
  /\bdo not want to live\b/i,
  /\bbetter off dead\b/i,
  /\bno reason to live\b/i,
  /\bhurt myself\b/i,
  /\bself[-\s]?harm\b/i,
];

export function findCrisis(transcript: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(transcript));
}
