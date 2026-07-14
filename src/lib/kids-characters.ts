import { getAssessment } from "./assessments";

export type UnlockCondition =
  | { type: "starter" }
  | { type: "quests"; count: number }
  | { type: "streak"; days: number }
  | { type: "zone"; zoneId: string };

export type KidsCharacter = {
  id: string;
  name: string;
  avatar: string;
  trait: string;
  unlockCondition: UnlockCondition;
  unlockHint: string;
};

export const KIDS_CHARACTERS: KidsCharacter[] = [
  {
    id: "hero-hank",
    name: "Hero Hank",
    avatar: "🦸",
    trait: "Brave & bouncy",
    unlockCondition: { type: "starter" },
    unlockHint: "Your starter hero!",
  },
  {
    id: "spark-sam",
    name: "Spark Sam",
    avatar: "⚡",
    trait: "Quick starter",
    unlockCondition: { type: "quests", count: 1 },
    unlockHint: "Complete your first quest",
  },
  {
    id: "blaze-bella",
    name: "Blaze Bella",
    avatar: "🔥",
    trait: "Never gives up",
    unlockCondition: { type: "quests", count: 3 },
    unlockHint: "Complete 3 quests",
  },
  {
    id: "streak-stella",
    name: "Streak Stella",
    avatar: "⭐",
    trait: "Day-after-day hero",
    unlockCondition: { type: "streak", days: 3 },
    unlockHint: "Reach a 3-day streak",
  },
  {
    id: "ankle-archie",
    name: "Ankle Archie",
    avatar: "🦶",
    trait: "Island explorer",
    unlockCondition: { type: "zone", zoneId: "ankle" },
    unlockHint: "Clear all Ankle Island quests",
  },
  {
    id: "knee-kai",
    name: "Knee Kai",
    avatar: "🦵",
    trait: "Kingdom knight",
    unlockCondition: { type: "zone", zoneId: "knee" },
    unlockHint: "Clear all Knee Kingdom quests",
  },
  {
    id: "back-ben",
    name: "Back Ben",
    avatar: "🌊",
    trait: "Bay buddy",
    unlockCondition: { type: "zone", zoneId: "lower-back" },
    unlockHint: "Clear all Back Bay quests",
  },
  {
    id: "wrist-wren",
    name: "Wrist Wren",
    avatar: "✋",
    trait: "Woods wizard",
    unlockCondition: { type: "zone", zoneId: "wrist" },
    unlockHint: "Clear all Wrist Woods quests",
  },
  {
    id: "meadow-mo",
    name: "Meadow Mo",
    avatar: "🌟",
    trait: "Mystery seeker",
    unlockCondition: { type: "zone", zoneId: "other" },
    unlockHint: "Clear all Mystery Meadow quests",
  },
  {
    id: "champion-cleo",
    name: "Champion Cleo",
    avatar: "👑",
    trait: "True adventurer",
    unlockCondition: { type: "quests", count: 5 },
    unlockHint: "Complete 5 quests",
  },
];

export function getCharacterById(id: string): KidsCharacter | undefined {
  return KIDS_CHARACTERS.find((c) => c.id === id);
}

export function isZoneComplete(
  zoneId: string,
  questProgress: Record<string, boolean>
): boolean {
  const assessment = getAssessment(zoneId);
  if (!assessment || assessment.exercises.length === 0) return false;
  return assessment.exercises.every((e) => questProgress[e.id]);
}

function meetsCondition(
  condition: UnlockCondition,
  questsDone: number,
  streak: number,
  questProgress: Record<string, boolean>
): boolean {
  switch (condition.type) {
    case "starter":
      return true;
    case "quests":
      return questsDone >= condition.count;
    case "streak":
      return streak >= condition.days;
    case "zone":
      return isZoneComplete(condition.zoneId, questProgress);
  }
}

export function computeUnlockedIds(
  questProgress: Record<string, boolean>,
  streak: number
): string[] {
  const questsDone = Object.values(questProgress).filter(Boolean).length;
  return KIDS_CHARACTERS.filter((c) =>
    meetsCondition(c.unlockCondition, questsDone, streak, questProgress)
  ).map((c) => c.id);
}
