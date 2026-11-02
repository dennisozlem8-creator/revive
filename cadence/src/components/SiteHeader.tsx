"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/check-in", label: "Check-in" },
  { href: "/history", label: "History" },
  { href: "/how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="cd-header">
      <Link href="/" className="cd-brand">
        <span className="cd-mark" aria-hidden="true" />
        Cadence
      </Link>
      <nav className="cd-nav" aria-label="Primary">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
