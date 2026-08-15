"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { addNotification } from "@/lib/notifications";
import { t } from "@/lib/i18n";

export default function PainCheckPage() {
  const { user, updateUser } = useAuth();

  if (!user) return null;

  const locale = user.language ?? "en";

  function selectPain(level: number) {
    if (!user) return;
    updateUser({ painToday: level });

    if (level >= 7) {
      if (user.doctorEmail) {
        addNotification({
          toEmail: user.doctorEmail,
          role: "doctor",
          title: "High pain alert",
          message: `${user.name} reported pain level ${level}/10. Session blocked.`,
        });
      }
      return;
    }

    window.location.href = "/session";
  }

  return (
    <div className="min-h-full rm-glow-patient pb-24 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 pt-4 text-center">
        <h1 className="rm-title text-3xl text-white">{t("beforeWeStart", locale)}</h1>
        <p className="mt-3 text-lg text-body">{t("painQuestion", locale)}</p>
        <p className="mt-1 text-sm text-muted">{t("painScale", locale)}</p>

        <div className="mt-10 grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => selectPain(n)}
              className={`rm-card flex min-h-[4.5rem] items-center justify-center text-xl font-bold transition hover:scale-105 ${
                n <= 3
                  ? "border-correct/50 hover:bg-correct/15 text-correct"
                  : n <= 6
                    ? "border-almost/50 hover:bg-almost/15 text-almost"
                    : "border-alert/50 hover:bg-alert/15 text-alert"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {user.painToday !== undefined && user.painToday >= 7 && (
          <section className="rm-card mt-10 border-alert/50 bg-alert/10 p-6 text-left">
            <h2 className="text-lg font-bold text-alert">{t("highPain", locale)}</h2>
            <p className="mt-2 rm-body">{t("restToday", locale)}</p>
          </section>
        )}

        {user.painToday !== undefined && user.painToday < 7 && (
          <p className="mt-8 text-base font-semibold text-correct">
            {user.painToday}/10 — {t("okToExercise", locale)}
          </p>
        )}
      </main>
    </div>
  );
}
