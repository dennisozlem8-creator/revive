import { computeUnlockedIds } from "./kids-characters";

export const KIDS_PROGRESS_KEY = "revive-motion-kids-progress";

export type KidsProgressData = {
  unlockedIds: string[];
  selectedId: string;
};

const DEFAULT: KidsProgressData = {
  unlockedIds: ["hero-hank"],
  selectedId: "hero-hank",
};

export const EMPTY_QUEST_PROGRESS: Record<string, boolean> = {};

const QUEST_LOG_KEY = "revive-motion-kids-quests";

export type KidsQuestLog = {
  questProgress: Record<string, boolean>;
  stars: number;
};

export function loadKidsQuestLog(): KidsQuestLog {
  if (typeof window === "undefined") return { questProgress: {}, stars: 0 };
  try {
    const raw = JSON.parse(localStorage.getItem(QUEST_LOG_KEY) ?? "{}") as Partial<KidsQuestLog>;
    return {
      questProgress: raw.questProgress ?? {},
      stars: typeof raw.stars === "number" ? raw.stars : 0,
    };
  } catch {
    return { questProgress: {}, stars: 0 };
  }
}

export function completeKidsQuestLocal(questId: string, xp = 50): KidsQuestLog {
  const log = loadKidsQuestLog();
  if (!log.questProgress[questId]) log.stars += xp;
  log.questProgress[questId] = true;
  localStorage.setItem(QUEST_LOG_KEY, JSON.stringify(log));
  return log;
}

export function loadKidsProgress(): KidsProgressData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = JSON.parse(localStorage.getItem(KIDS_PROGRESS_KEY) ?? "{}") as Partial<KidsProgressData>;
    return {
      unlockedIds: raw.unlockedIds?.length ? raw.unlockedIds : DEFAULT.unlockedIds,
      selectedId: raw.selectedId ?? DEFAULT.selectedId,
    };
  } catch {
    return DEFAULT;
  }
}

export function saveKidsProgress(data: KidsProgressData) {
  localStorage.setItem(KIDS_PROGRESS_KEY, JSON.stringify(data));
}

export function syncKidsProgress(
  questProgress: Record<string, boolean>,
  streak: number,
  current: KidsProgressData
): { data: KidsProgressData; newlyUnlocked: string[] } {
  const earned = computeUnlockedIds(questProgress, streak);
  const merged = [...new Set([...current.unlockedIds, ...earned])];
  const newlyUnlocked = merged.filter((id) => !current.unlockedIds.includes(id));
  const selectedId = merged.includes(current.selectedId)
    ? current.selectedId
    : merged[0] ?? DEFAULT.selectedId;

  const data: KidsProgressData = { unlockedIds: merged, selectedId };
  if (newlyUnlocked.length > 0 || merged.length !== current.unlockedIds.length) {
    saveKidsProgress(data);
  }
  return { data, newlyUnlocked };
}
