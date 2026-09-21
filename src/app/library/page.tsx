"use client";

import { DashIntro, DashShell } from "@/components/clinic/DashKit";
import { ExerciseLibrary } from "@/components/ExerciseLibrary";
import { useAuth } from "@/components/AuthProvider";
import { clinicLocale, t } from "@/lib/i18n";

export default function LibraryPage() {
  const { user } = useAuth();
  if (!user) return null;

  const locale = clinicLocale(user);

  return (
    <DashShell>
      <DashIntro kicker={t("libraryKicker", locale)} title={t("exerciseLibrary", locale)} text={t("libraryText", locale)} />
      <div className="mt-6">
        <ExerciseLibrary user={user} />
      </div>
    </DashShell>
  );
}
