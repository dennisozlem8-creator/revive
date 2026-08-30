"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { QuestGame } from "@/components/QuestGame";
import { SensorHelp } from "@/components/SensorHelp";
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
  loadKidsProgress,
  saveKidsProgress,
  syncKidsProgress,
  type KidsProgressData,
} from "@/lib/kids-progress";
import { KidsIcon, KidsIconTitle } from "@/components/KidsIcon";
import { KidsAtmosphere } from "@/components/KidsAtmosphere";
import type { KidsIconName } from "@/lib/kids-icons";

const questZones: { id: string; icon: KidsIconName; name: string; image: string }[] = [
  { id: "ankle", icon: "foot", name: "Ankle Island", image: "/kids/zones/ankle.svg" },
  { id: "knee", icon: "knee", name: "Knee Kingdom", image: "/kids/zones/knee.svg" },
  { id: "lower-back", icon: "wave", name: "Back Bay", image: "/kids/zones/back.svg" },
  { id: "wrist", icon: "hand", name: "Wrist Woods", image: "/kids/zones/wrist.svg" },
  { id: "other", icon: "star", name: "Mystery Meadow", image: "/kids/zones/meadow.svg" },
];

const levels = [
  { min: 0, name: "Benched", color: "text-muted" },
  { min: 100, name: "On the Bench", color: "text-body" },
  { min: 300, name: "Back in Practice", color: "text-brand-light" },
  { min: 600, name: "Starting Lineup", color: "text-orange" },
  { min: 1000, name: "MVP", color: "text-gold" },
];

function getLevel(xp: number) {
  return [...levels].reverse().find((l) => xp >= l.min) ?? levels[0];
}

export default function KidsQuestPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "Hero";
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [speech, setSpeech] = useState(`Hey ${firstName}! Ready for your quest?`);
  const [kidsProgress, setKidsProgress] = useState<KidsProgressData>(() => loadKidsProgress());
  const [celebrateIds, setCelebrateIds] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!hasSeenKidsWelcome()) {
      setShowWelcome(true);
    } else {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const xp = user?.xp ?? 0;
  const level = getLevel(xp);
  const xpPct = Math.min(100, (xp / 1000) * 100);
  const streak = user ? calculateStreak(user) : 0;
  const questsDone = user ? Object.values(user.questProgress).filter(Boolean).length : 0;
  const questProgress = user?.questProgress ?? {};

  const selectedCharacter = getCharacterById(kidsProgress.selectedId);
  const heroAvatar = selectedCharacter?.avatar ?? "hero";

  const checkUnlocks = useCallback(() => {
    const current = loadKidsProgress();
    const { data, newlyUnlocked } = syncKidsProgress(questProgress, streak, current);
    setKidsProgress(data);
    if (newlyUnlocked.length > 0) {
      setCelebrateIds((prev) => [...prev, ...newlyUnlocked]);
      const names = newlyUnlocked
        .map((id) => getCharacterById(id)?.name)
        .filter(Boolean)
        .join(", ");
      setSpeech(`You unlocked ${names}! Check your hero collection!`);
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
    if (char) setSpeech(`${char.name} is ready for adventure!`);
  };

  const area = selectedArea ? getBodyArea(selectedArea) : null;
  const assessment = selectedArea ? getAssessment(selectedArea) : null;
  const activeExercise = assessment?.exercises.find((e) => e.id === activeExerciseId);

  const showMap = !selectedArea && !activeExercise;

  return (
    <div className="relative min-h-full overflow-hidden rm-glow-kids pb-24">
      <KidsAtmosphere />
      <div className="rm-xp-track fixed left-0 right-0 top-0 z-50 rounded-none">
        <div className="rm-xp-fill" style={{ width: `${xpPct}%` }} />
      </div>

      {showWelcome && (
        <KidsWelcomeModal
          onDismiss={() => {
            setShowWelcome(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);
          }}
        />
      )}

      {showToast && !showWelcome && (
        <div className="fixed left-0 right-0 top-2 z-[60] flex justify-center px-4 animate-kids-toast">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/90 px-5 py-2 text-sm font-bold text-amber-950 shadow-[0_10px_28px_rgba(40,24,8,0.18)] backdrop-blur">
            <KidsIcon name="star" size={22} />
            Kids Quest World
            <KidsIcon name="sparkle" size={22} />
          </div>
        </div>
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
        <section className="relative overflow-hidden rounded-[1.75rem] border border-amber-200/50 shadow-[0_22px_44px_rgba(40,24,8,0.18)]">
          <Image
            src="/kids/quest-map.svg"
            alt=""
            width={1200}
            height={360}
            className="h-44 w-full object-cover sm:h-52"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2848]/70 via-[#1a2848]/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">Revive Motion</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-amber-50 drop-shadow-md sm:text-4xl">
                Kids Quest
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-amber-100">
                <KidsIcon name="star" size={18} />
                {level.name}
              </p>
            </div>
            <div className="flex gap-2 text-center">
              <div className="rounded-2xl border border-white/40 bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur">
                <p className="flex items-center justify-center gap-1 text-lg font-bold leading-none text-amber-800">
                  <KidsIcon name="sparkle" size={18} />
                  {xp}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-amber-900/70">XP</p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur">
                <p className="flex items-center justify-center gap-1 text-lg font-bold leading-none text-indigo-800">
                  <KidsIcon name="fire" size={18} />
                  {streak}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-900/70">Streak</p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur">
                <p className="flex items-center justify-center gap-1 text-lg font-bold leading-none text-emerald-800">
                  <KidsIcon name="target" size={18} />
                  {questsDone}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-900/70">Quests</p>
              </div>
            </div>
          </div>
        </section>

        {showMap && (
          <>
            <section className="mt-6">
              <h2 className="kids-title-ink text-2xl sm:text-3xl">
                <KidsIconTitle icon="map" size={34}>
                  Quest map
                </KidsIconTitle>
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-900/75">
                Choose a kingdom and start your quest.
                <KidsIcon name="rocket" size={20} />
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {questZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => {
                      setSelectedArea(zone.id);
                      setSpeech(`Enter ${zone.name}! Pick a quest.`);
                    }}
                    className="kids-zone text-left"
                  >
                    <div className="relative h-40 sm:h-48">
                      <Image
                        src={zone.image}
                        alt=""
                        width={800}
                        height={480}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1840]/85 via-[#1a1840]/20 to-transparent" />
                      <span className="absolute left-3 top-3 drop-shadow-lg" aria-hidden>
                        <KidsIcon name={zone.icon} size={48} />
                      </span>
                      <div className="absolute bottom-0 p-4">
                        <h2 className="text-xl font-bold tracking-tight text-amber-50 drop-shadow">
                          {zone.name}
                        </h2>
                        <p className="mt-0.5 text-sm font-medium text-amber-100/90">Enter the quest zone</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <CharacterGallery
              unlockedIds={kidsProgress.unlockedIds}
              selectedId={kidsProgress.selectedId}
              onSelect={handleSelectCharacter}
            />
          </>
        )}

        <section className="kids-glass mt-5 flex items-center gap-3 p-3 sm:p-4">
          <KidsIcon name={heroAvatar} size={64} />
          <div className="relative flex-1 rounded-2xl border border-amber-200/80 bg-white/80 px-3 py-2 text-indigo-950 sm:px-4 sm:py-3">
            <p className="text-sm font-semibold sm:text-base">{speech}</p>
            <div className="absolute -left-2 top-4 h-3 w-3 rotate-45 border-b border-l border-amber-200/80 bg-white/80 sm:top-5 sm:h-4 sm:w-4" />
          </div>
        </section>

        {!activeExercise && (
          <section className="mt-4">
            <SensorHelp variant="kids" />
          </section>
        )}

        {selectedArea && area && assessment && !activeExercise && (
          <section className="mt-4">
            <button type="button" onClick={() => setSelectedArea(null)} className="text-sm font-bold text-amber-900">
              <span className="inline-flex items-center gap-1">
                ← Back to quest map
                <KidsIcon name="map" size={18} />
              </span>
            </button>
            <h2 className="kids-title-ink mt-4 text-2xl sm:text-3xl">
              <KidsIconTitle icon="target" size={32}>
                {area.label} Quests
              </KidsIconTitle>
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                    className={`rounded-[1.5rem] border p-5 text-left shadow-[0_14px_28px_rgba(40,24,8,0.1)] transition hover:-translate-y-0.5 ${
                      done
                        ? "border-emerald-300/80 bg-gradient-to-br from-emerald-50 to-white"
                        : "border-amber-200/80 bg-gradient-to-br from-white to-amber-50/80"
                    }`}
                  >
                    <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">
                      <KidsIcon name={done ? "check" : "gamepad"} size={18} />
                      {done ? "Complete" : "Quest"}
                    </p>
                    <h3 className="mt-2 font-bold text-indigo-950">{exercise.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-amber-800">
                      {done ? "Play again" : "Start quest"}
                      <KidsIcon name={done ? "sparkle" : "rocket"} size={18} />
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeExercise && (
          <section className="mx-auto mt-4 max-w-lg">
            <button type="button" onClick={() => setActiveExerciseId(null)} className="text-sm font-bold text-amber-900">
              <span className="inline-flex items-center gap-1">
                ← Back to quests
                <KidsIcon name="target" size={18} />
              </span>
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

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/briefing"
            className="rounded-full border border-amber-300/80 bg-white/85 px-8 py-3 text-sm font-bold text-indigo-900 shadow-[0_8px_20px_rgba(40,24,8,0.1)]"
          >
            Return to adult mode
          </Link>
          <p className="flex items-center justify-center gap-1 text-xs font-semibold text-amber-900/80">
            Your XP, stars, and heroes are saved.
            <KidsIcon name="star" size={16} />
          </p>
        </div>
      </main>
    </div>
  );
}
