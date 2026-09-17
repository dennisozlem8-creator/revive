"use client";

import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

export function ReportActions({ locale, className = "" }: { locale: Locale; className?: string }) {
  return (
    <Link
      href="/report"
      className={`inline-flex h-11 items-center justify-center rounded-full border border-[#4f90c6]/30 bg-white px-5 text-sm font-semibold text-[#1b3348] transition hover:bg-[#e8f3fb] ${className}`}
    >
      {t("openReport", locale)}
    </Link>
  );
}
