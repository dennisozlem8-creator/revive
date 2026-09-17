import { getAssessment } from "./assessments";
import type { KidsIconName } from "./kids-icons";

export type UnlockCondition =
  | { type: "starter" }
  | { type: "quests"; count: number }
  | { type: "streak"; days: number }
  | { type: "zone"; zoneId: string };

export type KidsCharacter = {
  id: string;
  name: string;
  avatar: KidsIconName;
  trait: string;
  unlockCondition: UnlockCondition;
  unlockHint: string;
};

export const KIDS_CHARACTERS: KidsCharacter[] = [
  {
    id: "hero-hank",
    name: "Hank Bot",
    avatar: "hero",
    trait: "Bounce bot",
    unlockCondition: { type: "starter" },
    unlockHint: "Your starter quest bot",
  },
  {
    id: "spark-sam",
    name: "Sam Bot",
    avatar: "sparkbot",
    trait: "Quick stretch",
    unlockCondition: { type: "quests", count: 1 },
    unlockHint: "Finish your first stretch quest",
  },
  {
    id: "blaze-bella",
    name: "Bella Bot",
    avatar: "blazebot",
    trait: "Never skips reps",
    unlockCondition: { type: "quests", count: 3 },
    unlockHint: "Complete 3 stretch quests",
  },
  {
    id: "streak-stella",
    name: "Stella Bot",
    avatar: "streakbot",
    trait: "Day-after-day reps",
    unlockCondition: { type: "streak", days: 3 },
    unlockHint: "Reach a 3-day streak",
  },
  {
    id: "ankle-archie",
    name: "Archie Bot",
    avatar: "anklebot",
    trait: "Ankle circles",
    unlockCondition: { type: "zone", zoneId: "ankle" },
    unlockHint: "Clear all Ankle Island quests",
  },
  {
    id: "knee-kai",
    name: "Kai Bot",
    avatar: "kneebot",
    trait: "Squat buddy",
    unlockCondition: { type: "zone", zoneId: "knee" },
    unlockHint: "Clear all Knee Bounce City quests",
  },
  {
    id: "back-ben",
    name: "Ben Bot",
    avatar: "backbot",
    trait: "Reach-up bot",
    unlockCondition: { type: "zone", zoneId: "lower-back" },
    unlockHint: "Clear all Back Stretch Bay quests",
  },
  {
    id: "wrist-wren",
    name: "Wren Bot",
    avatar: "wristbot",
    trait: "Wrist wiggles",
    unlockCondition: { type: "zone", zoneId: "wrist" },
    unlockHint: "Clear all Wrist Wiggle Woods quests",
  },
  {
    id: "meadow-mo",
    name: "Mo Bot",
    avatar: "meadowbot",
    trait: "Mystery stretch",
    unlockCondition: { type: "zone", zoneId: "other" },
    unlockHint: "Clear all Mystery Meadow quests",
  },
  {
    id: "champion-cleo",
    name: "Cleo Bot",
    avatar: "champbot",
    trait: "Rep champion",
    unlockCondition: { type: "quests", count: 5 },
    unlockHint: "Complete 5 stretch quests",
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
