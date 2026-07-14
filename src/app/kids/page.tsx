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

const questZones = [
  { id: "ankle", emoji: "🦶", name: "Ankle Island", image: "/kids/zones/ankle.svg" },
  { id: "knee", emoji: "🦵", name: "Knee Kingdom", image: "/kids/zones/knee.svg" },
  { id: "lower-back", emoji: "🌊", name: "Back Bay", image: "/kids/zones/back.svg" },
  { id: "wrist", emoji: "✋", name: "Wrist Woods", image: "/kids/zones/wrist.svg" },
  { id: "other", emoji: "⭐", name: "Mystery Meadow", image: "/kids/zones/meadow.svg" },
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
  const heroAvatar = selectedCharacter?.avatar ?? "🦸";

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
    <div className="relative min-h-full overflow-hidden rm-glow-kids pb-24 text-foreground">
      <div className="rm-xp-track fixed left-0 right-0 top-0 z-50">
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
          <div className="rounded-full border border-orange/50 bg-[#0a0520]/95 px-6 py-3 text-sm font-bold text-orange shadow-[0_0_24px_rgba(245,158,11,0.3)] backdrop-blur-sm">
            🎮 Kids Quest Mode!
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

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-8 pt-2 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-orange sm:text-3xl">Revive Motion Adventure</h1>
            <p className={`text-sm font-semibold ${level.color}`}>{level.name}</p>
          </div>
          <div className="flex gap-2 text-center">
            <div className="rounded-xl border border-orange/30 bg-surface/40 px-3 py-1.5">
              <p className="text-lg font-bold leading-none text-orange">{xp}</p>
              <p className="rm-label text-[10px]">XP</p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-surface/40 px-3 py-1.5">
              <p className="text-lg font-bold leading-none text-gold">{streak}</p>
              <p className="rm-label text-[10px]">Streak</p>
            </div>
            <div className="rounded-xl border border-correct/30 bg-surface/40 px-3 py-1.5">
              <p className="text-lg font-bold leading-none text-correct">{questsDone}</p>
              <p className="rm-label text-[10px]">Quests</p>
            </div>
          </div>
        </div>

        {showMap && (
          <>
            <section className="mt-3">
              <h2 className="text-xl font-bold text-purple sm:text-2xl">Quest Map</h2>
              <p className="mt-0.5 text-sm text-muted">Pick a zone and unlock new heroes!</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {questZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => {
                      setSelectedArea(zone.id);
                      setSpeech(`Enter ${zone.name}! Pick a quest.`);
                    }}
                    className="rm-card-elevated overflow-hidden border-purple/30 text-left transition hover:border-orange hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                  >
                    <Image
                      src={zone.image}
                      alt=""
                      width={400}
                      height={120}
                      className="h-20 w-full object-cover sm:h-24"
                    />
                    <div className="p-4 sm:p-5">
                      <span className="text-3xl sm:text-4xl">{zone.emoji}</span>
                      <h2 className="mt-1 text-lg font-bold sm:mt-2 sm:text-xl">{zone.name}</h2>
                      <p className="mt-0.5 text-sm text-muted sm:mt-1">Enter the quest zone →</p>
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

        <section className="rm-card mt-3 flex items-center gap-3 border-purple/30 p-3 sm:p-4">
          <span className="text-4xl sm:text-5xl">{heroAvatar}</span>
          <div className="relative flex-1 rounded-xl border-2 border-orange/50 bg-white/95 px-3 py-2 text-[var(--caregiver-text)] shadow-lg sm:px-4 sm:py-3">
            <p className="text-sm font-medium sm:text-base">{speech}</p>
            <div className="absolute -left-2 top-4 h-3 w-3 rotate-45 border-b-2 border-l-2 border-orange/50 bg-white/95 sm:top-5 sm:h-4 sm:w-4" />
          </div>
        </section>

        {!activeExercise && (
          <section className="mt-4">
            <SensorHelp variant="kids" />
          </section>
        )}

        {selectedArea && area && assessment && !activeExercise && (
          <section className="mt-4">
            <button type="button" onClick={() => setSelectedArea(null)} className="text-sm text-brand-light">
              ← Back to quest map
            </button>
            <h2 className="mt-4 text-2xl font-bold">{area.label} Quests</h2>
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
                    className={`rm-card p-5 text-left transition hover:border-orange ${
                      done ? "border-correct/40" : "border-purple/30"
                    }`}
                  >
                    <span className="text-3xl">{done ? "✅" : "🎮"}</span>
                    <h3 className="mt-2 font-bold">{exercise.name}</h3>
                    <p className="mt-1 text-sm text-muted">{done ? "Play again!" : "Start quest"}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeExercise && (
          <section className="mx-auto mt-4 max-w-lg">
            <button type="button" onClick={() => setActiveExerciseId(null)} className="text-sm text-brand-light">
              ← Back to quests
            </button>
            <div className="mt-4">
              <QuestGame
                exercise={activeExercise}
                targetAngle={user?.targetRom ?? 90}
                avatarEmoji={heroAvatar}
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
            className="rm-btn rm-btn-brand px-8 py-3 text-sm font-bold"
          >
            Return to adult mode
          </Link>
          <p className="text-xs text-muted">Your XP, quest progress, and heroes are saved</p>
        </div>
      </main>
    </div>
  );
}
