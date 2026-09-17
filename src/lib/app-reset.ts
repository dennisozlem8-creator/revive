const KEYS = [
  "revive-motion-users",
  "revive-motion-session",
  "revive-motion-notifications",
  "revive-motion-last-daily",
  "revive-motion-kids-progress",
  "revive-motion-kids-quests",
  "revive-motion-goniometer",
  "revive-motion-heart",
  "revive-motion-myoware",
];

export function resetAppData() {
  for (const key of KEYS) {
    localStorage.removeItem(key);
  }
}
