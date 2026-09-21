"use client";

import { SafePicture } from "@/components/SafePicture";
import { WhoHelpsSlider } from "@/components/WhoHelpsSlider";
import { t, type Locale } from "@/lib/i18n";

const IMPACT_SOURCES = [
  { label: "CDC", href: "https://www.cdc.gov/mmwr/volumes/72/wr/mm7241a1.htm" },
  {
    label: "Census",
    href: "https://www.census.gov/programs-surveys/geography/guidance/geo-areas/urban-rural/2020-ua-facts.html",
  },
  { label: "APTA", href: "https://www.apta.org/news/2025/03/04/workforce-forecast-2022-2037" },
  { label: "Parkinson’s Foundation", href: "https://www.parkinson.org/understanding-parkinsons/statistics" },
  {
    label: "American College of Rheumatology",
    href: "https://rheumatology.org/patients/joint-replacement-surgery",
  },
  { label: "systematic reviews", href: "https://doi.org/10.3109/09638288.2016.1153160" },
] as const;

export function ImpactBand({ locale }: { locale: Locale }) {
  const barriers = [
    { name: t("impactBarrier1", locale), value: t("impactStat1", locale), label: t("impactStat1Label", locale) },
    { name: t("impactBarrier2", locale), value: t("impactStat2", locale), label: t("impactStat2Label", locale) },
    { name: t("impactBarrier3", locale), value: t("impactStat3", locale), label: t("impactStat3Label", locale) },
    { name: t("impactBarrier4", locale), value: t("impactStat4", locale), label: t("impactStat4Label", locale) },
  ];

  return (
    <div id="impact" className="scroll-mt-20">
      <section>
        <div className="relative isolate overflow-hidden bg-[#10283b]">
          <div className="absolute inset-0 grid grid-cols-3 opacity-75">
            <SafePicture src="/images/impact-sports.png?v=3" alt="" className="h-full w-full object-cover" />
            <SafePicture src="/images/impact-disability.png?v=3" alt="" className="h-full w-full object-cover" />
            <SafePicture src="/images/impact-older.png?v=3" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2436] via-[#0d2436]/94 to-[#0d2436]/78" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061420]/95 via-[#0d2436]/30 to-[#0d2436]/30" />

          <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
            <p className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-[#f7fbfe] px-4 py-2 text-[0.68rem] font-extrabold uppercase leading-none tracking-[0.16em] text-[#1b3348] sm:px-5 sm:py-2.5 sm:text-xs">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#4f90c6]" />
              {t("impactKicker", locale)}
            </p>

            <div className="mt-5 grid items-end gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:gap-8">
              <div>
                <h2 className="rm-serif max-w-4xl whitespace-pre-line text-[2rem] font-semibold leading-[1.03] tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] sm:text-[3.1rem] lg:text-[3.6rem]">
                  {t("impactTitle", locale)}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                  {t("impactLead", locale)}
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-white/25 bg-white/10 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.17em] text-[#acd4ef]">
                  {t("impactScale", locale)}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="rm-serif text-[2.35rem] font-semibold leading-none text-white sm:text-[3rem]">
                      {t("impactScale1", locale)}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-4 text-white/80 sm:text-sm sm:leading-5">
                      {t("impactScale1Label", locale)}
                    </p>
                  </div>
                  <div>
                    <p className="rm-serif text-[2.35rem] font-semibold leading-none text-white sm:text-[3rem]">
                      {t("impactScale2", locale)}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-4 text-white/80 sm:text-sm sm:leading-5">
                      {t("impactScale2Label", locale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-[#acd4ef] sm:text-xs">
              <span>{t("impactBarriers", locale)}</span>
              <span aria-hidden className="h-px min-w-8 flex-1 bg-white/25" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {barriers.map((barrier) => (
                <article
                  key={barrier.name}
                  className="rounded-2xl border border-white/20 bg-[#071826]/60 p-3.5 shadow-[0_14px_32px_rgba(0,0,0,0.12)] sm:p-4"
                >
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#87bee2] sm:text-[0.7rem]">
                    {barrier.name}
                  </p>
                  <p className="rm-serif mt-2 text-[1.75rem] font-semibold leading-none text-white sm:text-[2.15rem]">
                    {barrier.value}
                  </p>
                  <p className="mt-2 text-[0.7rem] font-semibold leading-[1.35] text-white/80 sm:text-xs">
                    {barrier.label}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-5 grid items-center gap-5 rounded-[1.35rem] bg-[#f7fbfe] p-5 text-[#1b3348] shadow-[0_20px_48px_rgba(0,0,0,0.25)] sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.17em] text-[#6da8cf]">
                  {t("impactBridge", locale)}
                </p>
                <h3 className="rm-serif mt-1 text-[1.45rem] font-semibold leading-tight sm:text-[1.9rem]">
                  {t("impactAnswerTitle", locale)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#3a5870] sm:text-[15px]">
                  {t("impactAnswerText", locale)}
                </p>
              </div>

              <div className="grid grid-cols-[1fr_auto_1.15fr_auto_1fr] items-center gap-1.5 sm:gap-2">
                <div className="whitespace-pre-line rounded-xl border border-[#bad6e8] bg-[#e8f3fb] px-2 py-3 text-center text-[0.65rem] font-extrabold leading-tight sm:text-xs">
                  {t("impactInputs", locale)}
                </div>
                <span aria-hidden className="font-extrabold text-[#4f90c6]">→</span>
                <div className="whitespace-pre-line rounded-xl bg-[#1b3348] px-2 py-3 text-center text-[0.65rem] font-extrabold leading-tight text-white sm:text-xs">
                  {t("passportTitle", locale)}
                </div>
                <span aria-hidden className="font-extrabold text-[#4f90c6]">→</span>
                <div className="whitespace-pre-line rounded-xl border border-[#bad6e8] bg-[#e8f3fb] px-2 py-3 text-center text-[0.65rem] font-extrabold leading-tight sm:text-xs">
                  {t("impactPatientClinic", locale)}
                </div>
                <p className="col-span-5 mt-1 text-center text-[0.58rem] font-extrabold uppercase tracking-[0.11em] text-[#397faf] sm:text-[0.68rem] sm:tracking-[0.14em]">
                  {t("impactMotto", locale)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-[0.65rem] leading-4 text-white/70 sm:flex-row sm:items-start sm:justify-between sm:text-[0.7rem]">
              <p className="max-w-5xl">
                {t("impactSourceLead", locale)}:{" "}
                {IMPACT_SOURCES.map((source, i) => (
                  <span key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white/85 underline-offset-2 hover:underline"
                    >
                      {source.label}
                    </a>
                    {i < IMPACT_SOURCES.length - 1 ? ", " : ". "}
                  </span>
                ))}
                {t("impactSourceNote", locale)}
              </p>
              <p className="shrink-0 font-extrabold uppercase tracking-[0.1em] text-white">
                {t("impactLanguagePill", locale)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhoHelpsSlider locale={locale} />
    </div>
  );
}
