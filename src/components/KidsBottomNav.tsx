"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

type KidsBottomNavProps = {
  screen: "map" | "zone" | "quest" | "bots";
  onMap: () => void;
  onBots: () => void;
};

function NavIconMap() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M8 4.5 3.5 6.2v13.1L8 17.6l8 2.9 4.5-1.7V5.7L16 7.4 8 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 4.5v13.1M16 7.4v13.1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function NavIconBots() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="13" r="6.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="12.4" r="1.1" fill="currentColor" />
      <circle cx="14" cy="12.4" r="1.1" fill="currentColor" />
      <path d="M9.4 15.2c.7.8 1.6 1.2 2.6 1.2s1.9-.4 2.6-1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 6.8V4.4M9.2 4.4h5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function NavIconGrownUps() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.8 19.2c.8-3.2 3.2-5 6.2-5s5.4 1.8 6.2 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function KidsBottomNav({ screen, onMap, onBots }: KidsBottomNavProps) {
  const { user } = useAuth();
  const grownUpsHref = user ? "/briefing" : "/";

  const item =
    "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[13px] font-semibold tracking-tight";

  return (
    <nav
      className="kids-nav pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4"
      aria-label="Kids Quest"
    >
      <div className="kids-nav-pill pointer-events-auto mx-auto flex max-w-md gap-1 rounded-full p-1.5">
        <button
          type="button"
          onClick={onMap}
          className={`${item} ${screen === "map" || screen === "zone" || screen === "quest" ? "bg-[#f5c84a] text-[#243056]" : "text-[#5b6685]"}`}
        >
          <NavIconMap />
          Map
        </button>
        <button
          type="button"
          onClick={onBots}
          className={`${item} ${screen === "bots" ? "bg-[#f5c84a] text-[#243056]" : "text-[#5b6685]"}`}
        >
          <NavIconBots />
          Bots
        </button>
        <Link href={grownUpsHref} className={`${item} text-[#5b6685]`}>
          <NavIconGrownUps />
          Grown-ups
        </Link>
      </div>
    </nav>
  );
}
