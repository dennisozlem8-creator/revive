"use client";

import { TryDemoButton } from "@/components/TryDemoButton";
import { t, type Locale } from "@/lib/i18n";

export function PassportBand({ locale }: { locale: Locale }) {
  const score = 76;
  const r = 46;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const feeds = [
    t("passportFeedsPhoto", locale),
    t("passportFeedsMotion", locale),
    t("passportFeedsMuscle", locale),
  ];
  const parts = [
    { pct: "40%", label: t("passportPartSessions", locale) },
    { pct: "35%", label: t("passportPartRange", locale) },
    { pct: "25%", label: t("passportPartVelocity", locale) },
  ];

  return (
    <section id="passport" className="scroll-mt-20 bg-[#e8f3fb]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid items-center gap-5 rounded-[1.6rem] bg-white p-4 shadow-[0_16px_36px_rgba(27,51,72,0.08)] ring-1 ring-[#4f90c6]/12 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(17rem,22rem)] lg:gap-8 lg:p-7">
          <div>
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#4f90c6]">
              {t("passportKicker", locale)}
            </p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold leading-[1.05] text-[#1b3348] sm:text-[2.4rem]">
              {t("passportTitle", locale)}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#2f4a60] sm:text-base sm:leading-7">
              {t("passportBandText", locale)}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {feeds.map((feed) => (
                <li
                  key={feed}
                  className="inline-flex h-9 items-center rounded-full bg-[#f4f9fc] px-3 text-sm font-semibold text-[#1b3348] ring-1 ring-[#4f90c6]/20"
                >
                  {feed}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <TryDemoButton className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,144,198,0.28)] transition hover:bg-brand-light" />
              <a
                href="#sensors"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#4f90c6] bg-white px-5 text-sm font-semibold text-[#1b3348] transition hover:bg-[#f4f9fc]"
              >
                {t("photoAndSensors", locale)}
              </a>
            </div>
          </div>

          <div className="rounded-[1.25rem] bg-[#f4f9fc] p-4">
            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 120 120"
                className="h-28 w-28 shrink-0"
                role="img"
                aria-label={`${t("passportTitle", locale)} ${score}`}
              >
                <circle cx="60" cy="60" r={r} fill="none" stroke="#e8f3fb" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r={r}
                  fill="none"
                  stroke="#4f90c6"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${c}`}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="58" textAnchor="middle" fill="#1b3348" fontSize="28" fontWeight="700">
                  {t("previewPassportScore", locale)}
                </text>
                <text x="60" y="76" textAnchor="middle" fill="#5d7386" fontSize="11" fontWeight="600">
                  {t("passportOf100", locale)}
                </text>
              </svg>
              <ul className="min-w-0 flex-1 space-y-2.5">
                {parts.map((part) => (
                  <li key={part.label}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1b3348]">{part.label}</span>
                      <span className="text-xs font-bold tabular-nums text-[#3d7eb4]">{part.pct}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                      <span className="block h-full rounded-full bg-[#4f90c6]" style={{ width: part.pct }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-xs font-semibold leading-4 text-[#3d7eb4]">{t("scoreMeaning", locale)}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Mini value={t("passportPreviewVelocity", locale)} label={t("passportVelocity", locale)} />
              <Mini value={t("passportPreviewWeek", locale)} label={t("passportWeek", locale)} />
              <Mini value={t("passportPreviewRange", locale)} label={t("passportRange", locale)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white px-2.5 py-2.5 text-center shadow-[0_1px_0_rgba(27,51,72,0.04)]">
      <p className="rm-serif text-xl font-semibold tabular-nums leading-none text-[#1b3348]">{value}</p>
      <p className="mt-1 text-[0.7rem] font-semibold leading-4 text-[#5d7386]">{label}</p>
    </div>
  );
}
