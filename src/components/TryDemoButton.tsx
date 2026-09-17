"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useClinicLocale } from "./useClinicLocale";
import { t } from "@/lib/i18n";

export function TryDemoButton({
  role = "patient",
  className,
}: {
  role?: "patient" | "doctor";
  className?: string;
}) {
  const { enterDemo } = useAuth();
  const router = useRouter();
  const { locale } = useClinicLocale();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        enterDemo(role);
        router.replace(role === "doctor" ? "/doctor" : "/briefing");
      }}
    >
      {role === "doctor" ? t("tryClinicianDemo", locale) : t("tryDemo", locale)}
    </button>
  );
}
