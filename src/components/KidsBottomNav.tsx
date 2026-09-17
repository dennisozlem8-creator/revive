"use client";

import Link from "next/link";
import { KidsIcon } from "./KidsIcon";
import { useAuth } from "./AuthProvider";

type KidsBottomNavProps = {
  screen: "map" | "zone" | "quest";
  onMap: () => void;
  onBots: () => void;
};

export function KidsBottomNav({ screen, onMap, onBots }: KidsBottomNavProps) {
  const { user } = useAuth();
  const grownUpsHref = user ? "/briefing" : "/";

  return (
    <nav
      className="kids-nav fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Kids Quest"
    >
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onMap}
          className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border-4 border-white px-2 py-2 text-lg font-extrabold leading-tight ${
            screen === "map"
              ? "bg-[#ffe14a] text-[#1a1a6a] shadow-[0_0_0_3px_#ff4fa3]"
              : "bg-white text-[#1a1a6a] shadow-[0_0_0_3px_#38bdf8]"
          }`}
        >
          <KidsIcon name="map" size={28} />
          Map
        </button>
        <button
          type="button"
          onClick={onBots}
          className="flex min-h-16 flex-col items-center justify-center rounded-2xl border-4 border-white bg-white px-2 py-2 text-lg font-extrabold leading-tight text-[#1a1a6a] shadow-[0_0_0_3px_#38bdf8]"
        >
          <KidsIcon name="hero" size={28} />
          Bots
        </button>
        <Link
          href={grownUpsHref}
          className="flex min-h-16 flex-col items-center justify-center rounded-2xl border-4 border-white bg-white px-2 py-2 text-center text-lg font-extrabold leading-tight text-[#1a1a6a] shadow-[0_0_0_3px_#38bdf8]"
        >
          <KidsIcon name="star" size={28} />
          Grown-ups
        </Link>
      </div>
    </nav>
  );
}
