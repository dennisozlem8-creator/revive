"use client";

import { SafePicture } from "@/components/SafePicture";
import { TryDemoButton } from "@/components/TryDemoButton";
import { WhoHelpsSlider } from "@/components/WhoHelpsSlider";
import { t, type Locale } from "@/lib/i18n";

export function ImpactBand({ locale }: { locale: Locale }) {
  const stats = [
    { value: t("impactStat1", locale), label: t("impactStat1Label", locale) },
    { value: t("impactStat2", locale), label: t("impactStat2Label", locale) },
    { value: t("impactStat3", locale), label: t("impactStat3Label", locale) },
  ];

  return (
    <div id="impact" className="scroll-mt-20">
      <section>
        <div className="relative isolate overflow-hidden">
          <SafePicture
            src="/images/landing-older-session.webp?v=1"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b3348] via-[#1b3348]/78 to-[#1b3348]/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#132536]/90 via-transparent to-[#1b3348]/20" />

          <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
            <h2 className="rm-serif max-w-4xl whitespace-pre-line text-[1.85rem] font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] sm:text-[3.15rem] sm:leading-[1.02] lg:text-[3.85rem]">
              {t("impactTitle", locale)}
            </h2>

            <div className="mt-7 grid grid-cols-1 divide-y divide-white/20 border-y border-white/20 sm:mt-9 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((stat) => (
                <article key={stat.value} className="py-4 sm:px-7 sm:py-5 first:sm:pl-0 last:sm:pr-0">
                  <p className="rm-serif text-[2.8rem] font-semibold leading-none tracking-tight text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:text-[3.6rem] lg:text-[4.1rem]">
                    {stat.value}
                  </p>
                  <p className="mt-2 max-w-[20rem] text-sm font-semibold leading-5 text-white/80 sm:text-[15px] sm:leading-6">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 sm:mt-7">
              <TryDemoButton className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#1b3348] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:bg-[#e8f3fb] sm:w-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 text-center sm:px-6 lg:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f90c6]">{t("keyMessageKicker", locale)}</p>
          <blockquote className="rm-serif mt-3 text-[1.4rem] font-semibold leading-snug text-[#1b3348] sm:text-[1.85rem] sm:leading-[1.2]">
            {t("keyMessageQuote", locale)}
          </blockquote>
          <span className="mx-auto mt-4 block h-0.5 w-16 rounded-full bg-[#4f90c6]" aria-hidden />
          <p className="mt-4 text-[15px] leading-6 text-[#2f4a60] sm:text-base sm:leading-7">{t("impactAnswerText", locale)}</p>
        </div>
      </section>

      <WhoHelpsSlider locale={locale} />
    </div>
  );
}
