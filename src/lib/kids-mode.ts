const WELCOME_KEY = "rm-kids-welcome-seen";

export function hasSeenKidsWelcome(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(WELCOME_KEY) === "1";
}

export function markKidsWelcomeSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WELCOME_KEY, "1");
}
