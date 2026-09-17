"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { QuestGame } from "@/components/QuestGame";
import { CharacterGallery } from "@/components/CharacterGallery";
import { CharacterUnlockCelebration } from "@/components/CharacterUnlockCelebration";
import { KidsWelcomeModal } from "@/components/KidsWelcomeModal";
import { useAuth } from "@/components/AuthProvider";
import { getAssessment } from "@/lib/assessments";
import { getBodyArea } from "@/lib/body-areas";
import { calculateStreak } from "@/lib/streak";
import { getCharacterById } from "@/lib/kids-characters";
import { hasSeenKidsWelcome } from "@/lib/kids-mode";
import { getKidsExerciseImage } from "@/lib/exercise-media";
import {
  EMPTY_QUEST_PROGRESS,
  loadKidsProgress,
  loadKidsQuestLog,
  saveKidsProgress,
  syncKidsProgress,
  type KidsProgressData,
} from "@/lib/kids-progress";
import { KidsAtmosphere } from "@/components/KidsAtmosphere";
import { KidsBottomNav } from "@/components/KidsBottomNav";
import { KidsIcon } from "@/components/KidsIcon";
import { SafePicture } from "@/components/SafePicture";
import type { KidsIconName } from "@/lib/kids-icons";

const questZones: {
  id: string;
  icon: KidsIconName;
  name: string;
  world: string;
  image: string;
}[] = [
  { id: "ankle", icon: "anklebot", name: "Ankle", world: "Island", image: "/kids/zones/ankle.webp?v=2" },
  { id: "knee", icon: "kneebot", name: "Knee", world: "City", image: "/kids/zones/knee.webp?v=2" },
  { id: "lower-back", icon: "backbot", name: "Back", world: "Bay", image: "/kids/zones/back.webp?v=2" },
  { id: "wrist", icon: "wristbot", name: "Wrist", world: "Woods", image: "/kids/zones/wrist.webp?v=2" },
  { id: "other", icon: "meadowbot", name: "Meadow", world: "Mystery", image: "/kids/zones/meadow.webp?v=2" },
];

const howSteps = [
  { n: "1", title: "Pick a world", text: "Tap a picture on the map." },
  { n: "2", title: "Start a stretch", text: "The bots ask. You stretch." },
  { n: "3", title: "Count the stretch", text: "Photo, motion, or muscle. Watch the live number." },
];

const levels = [
  { min: 0, name: "New bot" },
  { min: 100, name: "Stretch star" },
  { min: 300, name: "Super stretch" },
  { min: 600, name: "Bounce champ" },
  { min: 1000, name: "Quest champ" },
];

function getLevel(xp: number) {
  return [...levels].reverse().find((l) => xp >= l.min) ?? levels[0];
}

export default function KidsQuestPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "friend";
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [focus, setFocus] = useState<"map" | "bots">("map");
  const [kidsProgress, setKidsProgress] = useState<KidsProgressData>(() => loadKidsProgress());
  const [guestLog, setGuestLog] = useState(() => loadKidsQuestLog());
  const [celebrateIds, setCelebrateIds] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!hasSeenKidsWelcome()) setShowWelcome(true);
  }, []);

  const xp = user?.xp ?? guestLog.stars;
  const level = getLevel(xp);
  const xpPct = Math.min(100, (xp / 1000) * 100);
  const streak = user ? calculateStreak(user) : 0;
  const questProgress = useMemo(
    () => ({ ...guestLog.questProgress, ...(user?.questProgress ?? EMPTY_QUEST_PROGRESS) }),
    [guestLog, user?.questProgress]
  );
  const questsDone = Object.values(questProgress).filter(Boolean).length;
  const selectedCharacter = getCharacterById(kidsProgress.selectedId);
  const heroAvatar = selectedCharacter?.avatar ?? "hero";

  const checkUnlocks = useCallback(() => {
    const current = loadKidsProgress();
    const { data, newlyUnlocked } = syncKidsProgress(questProgress, streak, current);
    setKidsProgress((prev) =>
      prev.selectedId === data.selectedId &&
      prev.unlockedIds.length === data.unlockedIds.length &&
      prev.unlockedIds.every((id, index) => id === data.unlockedIds[index])
        ? prev
        : data
    );
    if (newlyUnlocked.length > 0) {
      setCelebrateIds((prev) => [...prev, ...newlyUnlocked]);
    }
  }, [questProgress, streak]);

  useEffect(() => {
    checkUnlocks();
  }, [checkUnlocks]);

  const handleSelectCharacter = (id: string) => {
    if (!kidsProgress.unlockedIds.includes(id)) return;
    const next = { ...kidsProgress, selectedId: id };
    setKidsProgress(next);
    saveKidsProgress(next);
  };

  const area = selectedArea ? getBodyArea(selectedArea) : null;
  const assessment = selectedArea ? getAssessment(selectedArea) : null;
  const activeExercise = assessment?.exercises.find((e) => e.id === activeExerciseId);
  const showHome = !selectedArea && !activeExercise;

  const navScreen = activeExercise
    ? "quest"
    : selectedArea
      ? "zone"
      : focus === "bots"
        ? "bots"
        : "map";

  return (
    <div className="relative min-h-full overflow-x-hidden rm-glow-kids pb-36">
      <KidsAtmosphere />
      <div className="rm-xp-track fixed left-0 right-0 top-0 z-50 rounded-none">
        <div className="rm-xp-fill" style={{ width: `${xpPct}%` }} />
      </div>

      {showWelcome && <KidsWelcomeModal onDismiss={() => setShowWelcome(false)} />}

      {celebrateIds.length > 0 && (
        <CharacterUnlockCelebration
          characterIds={celebrateIds}
          onDismiss={() => setCelebrateIds([])}
        />
      )}

      <Header linkHome variant="kids" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-12 pt-4 sm:px-6">
        {showHome && focus === "map" && (
          <>
            <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_32px_rgba(36,48,86,0.08)]">
              <SafePicture
                src="/kids/quest-hq.webp?v=2"
                alt="Quest bots stretching on a grassy hill."
                width={1200}
                height={360}
                className="h-52 w-full object-cover object-[center_70%] sm:h-72"
              />
              <div className="kids-caption flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-[#5b6685]">Stretch with the bots</p>
                  <h1 className="kids-wordmark mt-1 text-[2.15rem] leading-none sm:text-4xl">Kids Quest</h1>
                  <p className="mt-2 max-w-md text-base leading-6 text-[#5b6685]">
                    The bots ask. You stretch. {selectedCharacter?.name ?? "Hank Bot"} counts {firstName}&apos;s reps.
                  </p>
                </div>
                <div className="flex gap-8 text-[#243056]">
                  <div>
                    <p className="text-[1.65rem] font-semibold tabular-nums leading-none">{xp}</p>
                    <p className="mt-1 text-sm text-[#5b6685]">Stars</p>
                  </div>
                  <div>
                    <p className="text-[1.65rem] font-semibold tabular-nums leading-none">{streak}</p>
                    <p className="mt-1 text-sm text-[#5b6685]">Streak</p>
                  </div>
                  <div>
                    <p className="text-[1.65rem] font-semibold tabular-nums leading-none">{questsDone}</p>
                    <p className="mt-1 text-sm text-[#5b6685]">Done</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
              {howSteps.map((step) => (
                <div key={step.n} className="kids-step flex items-start gap-3 px-4 py-3.5">
                  <span className="kids-step-n mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {step.n}
                  </span>
                  <div>
                    <p className="kids-title-ink text-lg leading-tight">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-5 text-[#5b6685]">{step.text}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-8">
              <div>
                <h2 className="kids-title-ink text-2xl sm:text-3xl">Stretch map</h2>
                <p className="mt-1 text-base text-[#5b6685]">{level.name}. Pick a world. Start a stretch.</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {questZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedArea(zone.id)}
                    className="kids-zone text-left"
                  >
                    <div className="relative">
                      <SafePicture
                        src={zone.image}
                        alt=""
                        width={800}
                        height={480}
                        className="h-44 w-full object-cover object-[center_68%] sm:h-52"
                      />
                      <span className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_6px_16px_rgba(36,48,86,0.16)] ring-2 ring-white">
                        <KidsIcon name={zone.icon} size={48} />
                      </span>
                    </div>
                    <div className="kids-caption flex items-end justify-between gap-3 px-4 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-[#5b6685]">{zone.world}</p>
                        <h3 className="kids-title-ink text-[1.65rem] leading-none">{zone.name}</h3>
                      </div>
                      <p className="text-sm font-semibold text-[#4d8ef0]">Open</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {showHome && focus === "bots" && (
          <CharacterGallery
            unlockedIds={kidsProgress.unlockedIds}
            selectedId={kidsProgress.selectedId}
            onSelect={handleSelectCharacter}
          />
        )}

        {selectedArea && area && assessment && !activeExercise && (
          <section>
            <button
              type="button"
              onClick={() => setSelectedArea(null)}
              className="kids-back"
            >
              Map
            </button>
            <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_32px_rgba(36,48,86,0.08)]">
              <SafePicture
                src={questZones.find((z) => z.id === selectedArea)?.image ?? ""}
                alt=""
                width={800}
                height={320}
                className="h-40 w-full object-cover sm:h-52"
              />
              <div className="kids-caption px-5 py-4">
                <p className="text-sm font-semibold text-[#5b6685]">
                  {questZones.find((z) => z.id === selectedArea)?.world} world
                </p>
                <h2 className="kids-title-ink mt-0.5 text-3xl">{area.label}</h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {assessment.exercises.map((exercise) => {
                const done = questProgress[exercise.id];
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => setActiveExerciseId(exercise.id)}
                    className="kids-zone text-left"
                  >
                    <SafePicture
                      src={getKidsExerciseImage(exercise.id, exercise.name)}
                      alt=""
                      width={800}
                      height={360}
                      className="h-36 w-full object-cover"
                    />
                    <div className="kids-caption px-4 py-3.5">
                      <p className="text-sm font-semibold text-[#4d8ef0]">{done ? "Done" : "New"}</p>
                      <h3 className="kids-title-ink mt-0.5 text-xl leading-tight">{exercise.name}</h3>
                      <p className="mt-2 text-base font-semibold text-[#243056]">{done ? "Play again" : "Start"}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeExercise && (
          <section className="mx-auto max-w-xl">
            <button type="button" onClick={() => setActiveExerciseId(null)} className="kids-back">
              Stretches
            </button>
            <div className="mt-4">
              <QuestGame
                exercise={activeExercise}
                areaId={selectedArea ?? "knee"}
                targetAngle={user?.targetRom ?? 90}
                avatarIcon={heroAvatar}
                onQuestComplete={() => {
                  setGuestLog(loadKidsQuestLog());
                  checkUnlocks();
                }}
                onComplete={() => {
                  setActiveExerciseId(null);
                  setGuestLog(loadKidsQuestLog());
                  checkUnlocks();
                }}
              />
            </div>
          </section>
        )}
      </main>
      <KidsBottomNav
        screen={navScreen}
        onMap={() => {
          setFocus("map");
          setSelectedArea(null);
          setActiveExerciseId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onBots={() => {
          setFocus("bots");
          setSelectedArea(null);
          setActiveExerciseId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
