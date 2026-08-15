const KEYS = [
  "revive-motion-users",
  "revive-motion-session",
  "revive-motion-notifications",
  "revive-motion-last-daily",
  "revive-motion-kids-progress",
];

export function resetAppData() {
  for (const key of KEYS) {
    localStorage.removeItem(key);
  }
}
