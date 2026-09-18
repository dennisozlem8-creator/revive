import { DashCard } from "@/components/clinic/DashKit";
import { t, type Locale } from "@/lib/i18n";
import type { RecoveryPassport } from "@/lib/recovery-passport";

export function RecoveryPassportCard({
  passport,
  locale,
}: {
  passport: RecoveryPassport;
  locale: Locale;
}) {
  const score = passport.score;
  const pct = score ?? 0;
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const velocity =
    passport.velocityDegPerWeek == null
      ? "—"
      : `${passport.velocityDegPerWeek > 0 ? "+" : ""}${passport.velocityDegPerWeek}°`;

  return (
    <DashCard className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[#2f4a60]">{t("passportKicker", locale)}</p>
      <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">{t("passportTitle", locale)}</h2>
      <p className="mt-2 max-w-2xl text-base leading-7 text-[#1b3348]">{t("passportText", locale)}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0" role="img" aria-label={`${t("passportTitle", locale)} ${score ?? "—"}`}>
            <circle cx="50" cy="50" r={r} fill="none" stroke="#e8f3fb" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#4f90c6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="46" textAnchor="middle" fill="#1b3348" fontSize="22" fontWeight="700">
              {score ?? "—"}
            </text>
            <text x="50" y="64" textAnchor="middle" fill="#2f4a60" fontSize="9" fontWeight="600">
              {t("passportOf100", locale)}
            </text>
          </svg>
          <p className="max-w-[16rem] text-sm leading-6 text-[#2f4a60]">
            {score == null ? t("passportEmpty", locale) : t("passportHowBuilt", locale)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Mini
            value={velocity}
            label={t("passportVelocity", locale)}
            hint={t("passportVelocityHint", locale)}
          />
          <Mini
            value={`${passport.weeklyCount}/${passport.expectedWeekly}`}
            label={t("passportWeek", locale)}
            hint={t("passportWeekHint", locale)}
          />
          <Mini
            value={passport.rangeTowardGoal == null ? "—" : `${passport.rangeTowardGoal}%`}
            label={t("passportRange", locale)}
            hint={t("passportRangeHint", locale)}
          />
        </div>
      </div>
    </DashCard>
  );
}

function Mini({ value, label, hint }: { value: string; label: string; hint: string }) {
  return (
    <div className="rounded-[1.15rem] bg-[#f7fbfe] px-3 py-3">
      <p className="rm-serif text-2xl font-semibold tabular-nums leading-none text-[#1b3348]">{value}</p>
      <p className="mt-2 text-sm font-semibold text-[#1b3348]">{label}</p>
      <p className="mt-0.5 text-xs leading-5 text-[#2f4a60]">{hint}</p>
    </div>
  );
}
