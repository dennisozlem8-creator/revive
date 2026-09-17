"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { QuestGame } from "@/components/QuestGame";
import { CharacterGallery } from "@/components/CharacterGallery";
import { CharacterUnlockCelebration } from "@/components/CharacterUnlockCelebration";
import { KidsWelcomeModal } from "@/components/KidsWelcomeModal";
import { KidsModeBanner } from "@/components/KidsModeBanner";
import { useAuth } from "@/components/AuthProvider";
import { getAssessment } from "@/lib/assessments";
import { getBodyArea } from "@/lib/body-areas";
import { calculateStreak } from "@/lib/streak";
import { getCharacterById } from "@/lib/kids-characters";
import { hasSeenKidsWelcome } from "@/lib/kids-mode";
import {
  EMPTY_QUEST_PROGRESS,
  loadKidsProgress,
  saveKidsProgress,
  syncKidsProgress,
  type KidsProgressData,
} from "@/lib/kids-progress";
import { KidsIcon, KidsIconTitle } from "@/components/KidsIcon";
import { KidsAtmosphere } from "@/components/KidsAtmosphere";
import { KidsBottomNav } from "@/components/KidsBottomNav";
import { SafePicture } from "@/components/SafePicture";
import type { KidsIconName } from "@/lib/kids-icons";

const questZones: { id: string; icon: KidsIconName; name: string; image: string }[] = [
  { id: "ankle", icon: "anklebot", name: "Ankle Island", image: "/kids/zones/ankle.webp?v=1" },
  { id: "knee", icon: "kneebot", name: "Knee Bounce City", image: "/kids/zones/knee.webp?v=1" },
  { id: "lower-back", icon: "backbot", name: "Back Stretch Bay", image: "/kids/zones/back.webp?v=1" },
  { id: "wrist", icon: "wristbot", name: "Wrist Wiggle Woods", image: "/kids/zones/wrist.webp?v=1" },
  { id: "other", icon: "meadowbot", name: "Mystery Meadow", image: "/kids/zones/meadow.webp?v=1" },
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
  const firstName = user?.name.split(" ")[0] ?? "Hero";
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [speech, setSpeech] = useState(`Hey ${firstName}! The bots are ready. Stretch, squat, and score.`);
  const [kidsProgress, setKidsProgress] = useState<KidsProgressData>(() => loadKidsProgress());
  const [celebrateIds, setCelebrateIds] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!hasSeenKidsWelcome()) {
      setShowWelcome(true);
    }
  }, []);

  const xp = user?.xp ?? 0;
  const level = getLevel(xp);
  const xpPct = Math.min(100, (xp / 1000) * 100);
  const streak = user ? calculateStreak(user) : 0;
  const questsDone = user ? Object.values(user.questProgress).filter(Boolean).length : 0;
  const questProgress = user?.questProgress ?? EMPTY_QUEST_PROGRESS;

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
      const names = newlyUnlocked
        .map((id) => getCharacterById(id)?.name)
        .filter(Boolean)
        .join(", ");
      setSpeech(`You unlocked ${names}! Meet your new quest bot!`);
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
    const char = getCharacterById(id);
    if (char) setSpeech(`${char.name} will count your reps today!`);
  };

  const area = selectedArea ? getBodyArea(selectedArea) : null;
  const assessment = selectedArea ? getAssessment(selectedArea) : null;
  const activeExercise = assessment?.exercises.find((e) => e.id === activeExerciseId);

  const showMap = !selectedArea && !activeExercise;

  return (
    <div className="relative min-h-full overflow-hidden rm-glow-kids pb-32">
      <KidsAtmosphere />
      <div className="rm-xp-track fixed left-0 right-0 top-0 z-50 rounded-none">
        <div className="rm-xp-fill" style={{ width: `${xpPct}%` }} />
      </div>

      {showWelcome && (
        <KidsWelcomeModal
          onDismiss={() => {
            setShowWelcome(false);
          }}
        />
      )}

      {celebrateIds.length > 0 && (
        <CharacterUnlockCelebration
          characterIds={celebrateIds}
          onDismiss={() => setCelebrateIds([])}
        />
      )}

      <Header linkHome variant="kids" />
      <KidsModeBanner />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-8 pt-3 sm:px-6">
        <section className="overflow-hidden rounded-[1.75rem] border-4 border-white shadow-[0_0_0_4px_#ffe14a,0_22px_44px_rgba(20,20,90,0.18)]">
          <SafePicture
            src="/kids/quest-hq.webp?v=1"
            alt="Colorful quest bots waving from candy Kids Quest HQ."
            width={1200}
            height={360}
            className="h-40 w-full object-cover object-[center_70%] sm:h-48"
          />
          <div className="kids-caption flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-lg font-bold text-[#1a1a6a]">The bots count your reps</p>
              <h1 className="kids-wordmark mt-1 text-4xl sm:text-5xl">Kids Quest</h1>
              <p className="mt-1 flex items-center gap-1 text-lg font-bold text-[#1a1a6a]">
                <KidsIcon name="star" size={22} />
                {level.name}
              </p>
            </div>
            <div className="flex gap-2 text-center">
              <div className="min-w-[4.5rem] rounded-2xl border-2 border-white bg-white px-3 py-2 shadow-[0_0_0_3px_#ff4fa3]">
                <p className="text-2xl font-extrabold leading-none text-[#1a1a6a]">{xp}</p>
                <p className="mt-1 text-base font-bold text-[#1a1a6a]">Stars</p>
              </div>
              <div className="min-w-[4.5rem] rounded-2xl border-2 border-white bg-white px-3 py-2 shadow-[0_0_0_3px_#38bdf8]">
                <p className="text-2xl font-extrabold leading-none text-[#1a1a6a]">{streak}</p>
                <p className="mt-1 text-base font-bold text-[#1a1a6a]">Days</p>
              </div>
              <div className="min-w-[4.5rem] rounded-2xl border-2 border-white bg-white px-3 py-2 shadow-[0_0_0_3px_#a3e635]">
                <p className="text-2xl font-extrabold leading-none text-[#1a1a6a]">{questsDone}</p>
                <p className="mt-1 text-base font-bold text-[#1a1a6a]">Done</p>
              </div>
            </div>
          </div>
        </section>

        {showMap && (
          <>
            <section className="mt-6">
              <h2 className="kids-title-ink text-3xl sm:text-4xl">
                <KidsIconTitle icon="map" size={36}>
                  Stretch map
                </KidsIconTitle>
              </h2>
              <p className="mt-2 text-lg font-bold text-[#1a1a6a]">
                Tap a picture. Stretch with the bots.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {questZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => {
                      setSelectedArea(zone.id);
                      setSpeech(`Enter ${zone.name}! Pick a stretch.`);
                    }}
                    className="kids-zone text-left"
                  >
                    <div className="relative h-36 sm:h-40">
                      <SafePicture
                        src={zone.image}
                        alt=""
                        width={800}
                        height={480}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3" aria-hidden>
                        <KidsIcon name={zone.icon} size={52} />
                      </span>
                    </div>
                    <div className="kids-caption p-4">
                      <h2 className="kids-title-ink text-2xl">{zone.name}</h2>
                      <p className="mt-1 text-lg font-bold text-[#1a1a6a]">Tap to stretch</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div id="bot-crew" className="scroll-mt-24">
            <CharacterGallery
              unlockedIds={kidsProgress.unlockedIds}
              selectedId={kidsProgress.selectedId}
              onSelect={handleSelectCharacter}
            />
            </div>
          </>
        )}

        <section className="kids-glass mt-5 flex items-center gap-3 p-4">
          <KidsIcon name={heroAvatar} size={72} />
          <div className="relative flex-1 rounded-2xl border-2 border-white bg-white px-4 py-3 text-[#1a1a6a]">
            <p className="text-lg font-bold leading-snug sm:text-xl">{speech}</p>
          </div>
        </section>

        {selectedArea && area && assessment && !activeExercise && (
          <section className="mt-4">
            <button type="button" onClick={() => setSelectedArea(null)} className="kids-back">
              <KidsIcon name="map" size={22} />
              Map
            </button>
            <h2 className="kids-title-ink mt-4 text-3xl sm:text-4xl">
              <KidsIconTitle icon="target" size={36}>
                {area.label} stretches
              </KidsIconTitle>
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {assessment.exercises.map((exercise) => {
                const done = user?.questProgress[exercise.id];
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => {
                      setActiveExerciseId(exercise.id);
                      setSpeech(done ? "Let's beat your best!" : "You can do it!");
                    }}
                    className={`rounded-[1.5rem] border-4 border-white p-5 text-left ${
                      done
                        ? "bg-white shadow-[0_0_0_4px_#22c55e]"
                        : "bg-white shadow-[0_0_0_4px_#ffe14a]"
                    }`}
                  >
                    <p className="flex items-center gap-2 text-lg font-extrabold text-[#1a1a6a]">
                      <KidsIcon name={done ? "check" : "gamepad"} size={24} />
                      {done ? "Done" : "New"}
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold text-[#1a1a6a]">{exercise.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-xl font-extrabold text-[#1a1a6a]">
                      {done ? "Play again" : "Start"}
                      <KidsIcon name={done ? "sparkle" : "rocket"} size={22} />
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeExercise && (
          <section className="mx-auto mt-4 max-w-lg">
            <button type="button" onClick={() => setActiveExerciseId(null)} className="kids-back">
              <KidsIcon name="target" size={22} />
              Stretches
            </button>
            <div className="mt-4">
              <QuestGame
                exercise={activeExercise}
                targetAngle={user?.targetRom ?? 90}
                avatarIcon={heroAvatar}
                onQuestComplete={() => checkUnlocks()}
                onComplete={() => {
                  setSpeech("Great form! Keep it up!");
                  setActiveExerciseId(null);
                  checkUnlocks();
                }}
              />
            </div>
          </section>
        )}
      </main>
      <KidsBottomNav
        screen={activeExercise ? "quest" : selectedArea ? "zone" : "map"}
        onMap={() => {
          setSelectedArea(null);
          setActiveExerciseId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onBots={() => {
          setSelectedArea(null);
          setActiveExerciseId(null);
          window.setTimeout(() => {
            document.getElementById("bot-crew")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }}
      />
    </div>
  );
}
