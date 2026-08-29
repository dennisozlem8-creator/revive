"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { t } from "@/lib/i18n";

const patientTabs = [
  { href: "/briefing", key: "home" as const },
  { href: "/charts", key: "charts" as const },
  { href: "/dashboard", key: "care" as const },
  { href: "/recover-ai", key: "ai" as const },
];

const doctorTabs = [
  { href: "/doctor", key: "home" as const },
  { href: "/charts", key: "charts" as const },
  { href: "/pt-update", key: "care" as const },
  { href: "/recover-ai", key: "ai" as const },
];

export function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const locale = user?.language ?? "en";
  const tabs = user?.role === "doctor" ? doctorTabs : patientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-[4.5rem] items-center justify-center rounded-md px-3 py-2 text-xs font-semibold transition ${
                active
                  ? "bg-brand/15 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>{t(tab.key, locale)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
