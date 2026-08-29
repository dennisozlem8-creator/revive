"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHeroImage } from "@/components/PageHeroImage";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import {
  calculateStreak,
  getActivityDates,
  getLongestStreak,
} from "@/lib/streak";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== "patient") {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <Link href="/" className="text-brand-light hover:text-brand">
          Go home
        </Link>
      </div>
    );
  }

  const streak = calculateStreak(user);
  const longestStreak = getLongestStreak(user);
  const totalActiveDays = getActivityDates(user).length;
  const questsDone = Object.values(user.questProgress).filter(Boolean).length;

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-6 pb-8">
        <h1 className="rm-title text-3xl text-white">Your Dashboard</h1>
        <p className="mt-2 text-body">Track your recovery streak and progress.</p>

        <PageHeroImage
          src="/images/dashboard-hero.svg"
          alt="Recovery progress dashboard"
          className="mt-6"
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/goniometer" className="rm-btn rm-btn-brand inline-flex flex-1">
            Photo Goniometer
          </Link>
          <Link href="/shop" className="rm-btn rm-btn-ghost inline-flex flex-1">
            Shop devices and braces
          </Link>
        </div>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rm-card-elevated border-brand/30 p-6">
            <p className="rm-label">Current streak</p>
            <p className="mt-2 text-5xl font-bold text-brand-light">
              {streak}
              <span className="ml-2 text-lg font-medium text-muted">days</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              {streak > 0 ? "Keep it going today!" : "Complete an exercise to start"}
            </p>
          </div>
          <div className="rm-card p-6">
            <p className="rm-label">Longest streak</p>
            <p className="mt-2 text-4xl font-bold">{longestStreak}</p>
          </div>
          <div className="rm-card p-6">
            <p className="rm-label">Active days</p>
            <p className="mt-2 text-4xl font-bold">{totalActiveDays}</p>
          </div>
          <div className="rm-card border-orange/30 p-6">
            <p className="rm-label">Total XP</p>
            <p className="mt-2 text-4xl font-bold text-orange">{user.xp}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rm-card p-6">
            <h2 className="text-xl font-bold">Recent activity</h2>
            {user.exerciseHistory.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No assessments yet.{" "}
                <Link href="/" className="text-brand-light hover:text-brand">
                  Start one →
                </Link>
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {user.exerciseHistory
                  .slice(-5)
                  .reverse()
                  .map((record, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-sm"
                    >
                      <span className="capitalize">{record.areaId.replace("-", " ")}</span>
                      <span className="text-muted">
                        {" "}
                        · {new Date(record.completedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="rm-card p-6">
            <h2 className="text-xl font-bold">Quest progress</h2>
            <p className="mt-2 text-sm text-muted">
              {questsDone} quest{questsDone !== 1 ? "s" : ""} completed
            </p>
            <Link
              href="/kids"
              className="mt-4 inline-flex rounded-md border border-[var(--border)] bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
            >
              Continue Kids Quest
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
