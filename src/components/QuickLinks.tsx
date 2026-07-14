"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { t } from "@/lib/i18n";

type QuickLink = {
  href: string;
  icon: string;
  labelKey:
    | "today"
    | "assess"
    | "library"
    | "charts"
    | "ai"
    | "patients"
    | "ptPortal"
    | "support"
    | "progress"
    | "home";
};

const patientLinks: QuickLink[] = [
  { href: "/briefing", icon: "📋", labelKey: "today" },
  { href: "/", icon: "🦴", labelKey: "assess" },
  { href: "/library", icon: "📚", labelKey: "library" },
  { href: "/charts", icon: "📊", labelKey: "charts" },
  { href: "/recover-ai", icon: "✨", labelKey: "ai" },
];

const doctorLinks: QuickLink[] = [
  { href: "/doctor", icon: "🩺", labelKey: "patients" },
  { href: "/pt-update", icon: "📝", labelKey: "ptPortal" },
  { href: "/charts", icon: "📊", labelKey: "charts" },
  { href: "/recover-ai", icon: "✨", labelKey: "ai" },
];

const caregiverLinks: QuickLink[] = [
  { href: "/caregiver", icon: "🏠", labelKey: "home" },
  { href: "/caregiver/support", icon: "💬", labelKey: "support" },
  { href: "/charts", icon: "📈", labelKey: "progress" },
  { href: "/recover-ai", icon: "✨", labelKey: "ai" },
];

type QuickLinksProps = {
  variant?: "patient" | "doctor" | "caregiver";
};

export function QuickLinks({ variant }: QuickLinksProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const locale = user?.language ?? "en";

  const resolved =
    variant ?? (user?.role === "doctor" ? "doctor" : user?.role === "caregiver" ? "caregiver" : "patient");

  const links =
    resolved === "doctor" ? doctorLinks : resolved === "caregiver" ? caregiverLinks : patientLinks;

  const styleClass =
    resolved === "doctor" ? "rm-quick-link--doctor" : resolved === "caregiver" ? "rm-quick-link--caregiver" : "";

  return (
    <nav aria-label="Quick navigation" className="rm-quick-links -mx-1 mt-5">
      <div className="flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rm-quick-link shrink-0 ${styleClass} ${active ? "rm-quick-link--active" : ""}`}
            >
              <span className="text-sm" aria-hidden>
                {link.icon}
              </span>
              <span>{t(link.labelKey, locale)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
