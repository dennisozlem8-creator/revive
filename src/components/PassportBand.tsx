"use client";

import { SectionKicker } from "@/components/SectionKicker";
import { TryDemoButton } from "@/components/TryDemoButton";
import { t, type Locale } from "@/lib/i18n";

export function PassportBand({ locale }: { locale: Locale }) {
  const score = 76;
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const feeds = [
    t("passportFeedsPhoto", locale),
    t("passportFeedsMotion", locale),
    t("passportFeedsMuscle", locale),
  ];

  return (
    <section id="passport" className="scroll-mt-20 bg-[#e8f3fb]">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-14">
        <div>
          <SectionKicker>{t("passportSignatureKicker", locale)}</SectionKicker>
          <h2 className="rm-serif mt-4 text-3xl font-semibold leading-[1.08] text-[#1b3348] sm:text-[2.6rem]">
            {t("passportTitle", locale)}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#1b3348] sm:text-lg sm:leading-8">
            {t("passportBandText", locale)}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {feeds.map((feed) => (
              <li
                key={feed}
                className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#1b3348] ring-1 ring-[#4f90c6]/25"
              >
                {feed}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <TryDemoButton className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,144,198,0.28)] transition hover:bg-brand-light sm:h-11 sm:px-7" />
            <a
              href="#sensors"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#4f90c6] bg-white px-5 text-sm font-semibold text-[#1b3348] transition hover:bg-white/80 sm:h-11 sm:px-7"
            >
              {t("photoAndSensors", locale)}
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_40px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/15 sm:p-7">
          <p className="text-sm font-semibold text-[#2f4a60]">{t("passportKicker", locale)}</p>
          <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <svg
              viewBox="0 0 120 120"
              className="h-36 w-36 shrink-0"
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
              <text x="60" y="56" textAnchor="middle" fill="#1b3348" fontSize="28" fontWeight="700">
                {t("previewPassportScore", locale)}
              </text>
              <text x="60" y="74" textAnchor="middle" fill="#2f4a60" fontSize="10" fontWeight="600">
                {t("passportOf100", locale)}
              </text>
            </svg>
            <p className="text-sm leading-6 text-[#2f4a60] sm:text-base">{t("passportHowBuilt", locale)}</p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Mini value={t("passportPreviewVelocity", locale)} label={t("passportVelocity", locale)} />
            <Mini value={t("passportPreviewWeek", locale)} label={t("passportWeek", locale)} />
            <Mini value={t("passportPreviewRange", locale)} label={t("passportRange", locale)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.15rem] bg-[#f7fbfe] px-3 py-3">
      <p className="rm-serif text-xl font-semibold tabular-nums leading-none text-[#1b3348] sm:text-2xl">{value}</p>
      <p className="mt-2 text-xs font-semibold text-[#1b3348] sm:text-sm">{label}</p>
    </div>
  );
}
