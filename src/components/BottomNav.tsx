"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { t } from "@/lib/i18n";

const patientTabs = [
  { href: "/briefing", key: "today" as const, icon: "📋" },
  { href: "/charts", key: "charts" as const, icon: "📊" },
  { href: "/dashboard", key: "care" as const, icon: "💚" },
  { href: "/recover-ai", key: "ai" as const, icon: "✨" },
];

const doctorTabs = [
  { href: "/doctor", key: "patients" as const, icon: "🩺" },
  { href: "/pt-update", key: "ptPortal" as const, icon: "📝" },
  { href: "/charts", key: "charts" as const, icon: "📊" },
  { href: "/recover-ai", key: "ai" as const, icon: "✨" },
];

const caregiverTabs = [
  { href: "/caregiver", key: "home" as const, icon: "🏠" },
  { href: "/caregiver/support", key: "support" as const, icon: "💬" },
  { href: "/charts", key: "progress" as const, icon: "📈" },
  { href: "/recover-ai", key: "ai" as const, icon: "✨" },
];

type NavVariant = "patient" | "doctor" | "caregiver";

export function BottomNav({ variant }: { variant?: NavVariant }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const locale = user?.language ?? "en";

  const resolved: NavVariant =
    variant ?? (user?.role === "doctor" ? "doctor" : user?.role === "caregiver" ? "caregiver" : "patient");

  const tabs =
    resolved === "doctor" ? doctorTabs : resolved === "caregiver" ? caregiverTabs : patientTabs;

  const isDoctor = resolved === "doctor";
  const isCaregiver = resolved === "caregiver";

  return (
    <nav className="rm-bottom-nav" aria-label="Main navigation">
      <div
        className={`rm-bottom-nav-inner ${
          isDoctor
            ? "rm-bottom-nav-inner--doctor"
            : isCaregiver
              ? "rm-bottom-nav-inner--caregiver"
              : "rm-bottom-nav-inner--patient"
        }`}
      >
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`rm-nav-tab ${
                isDoctor ? "rm-nav-tab--doctor" : isCaregiver ? "rm-nav-tab--caregiver" : "rm-nav-tab--patient"
              } ${active ? "rm-nav-tab--active" : ""}`}
            >
              <span
                className={`rm-nav-icon ${
                  isDoctor ? "rm-nav-icon--doctor" : isCaregiver ? "rm-nav-icon--caregiver" : "rm-nav-icon--patient"
                }`}
                aria-hidden
              >
                {tab.icon}
              </span>
              <span>{t(tab.key, locale)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
