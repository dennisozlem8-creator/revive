"use client";

import { SafePicture } from "@/components/SafePicture";
import { TryDemoButton } from "@/components/TryDemoButton";
import { t, type Locale } from "@/lib/i18n";

export function ImpactBand({ locale }: { locale: Locale }) {
  const stats = [
    { value: t("impactStat1", locale), label: t("impactStat1Label", locale) },
    { value: t("impactStat2", locale), label: t("impactStat2Label", locale) },
    { value: t("impactStat3", locale), label: t("impactStat3Label", locale) },
  ];

  return (
    <section id="impact" className="scroll-mt-20">
      <div className="relative isolate overflow-hidden">
        <SafePicture
          src="/images/landing-older-session.webp?v=1"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b3348] via-[#1b3348]/78 to-[#1b3348]/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#132536]/90 via-transparent to-[#1b3348]/20" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
          <h2 className="rm-serif max-w-3xl whitespace-pre-line text-balance text-[1.9rem] font-semibold leading-[1.02] tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] sm:text-[3.45rem] sm:leading-[0.94] lg:text-[4.25rem]">
            {t("impactTitle", locale)}
          </h2>

          <div className="mt-7 grid grid-cols-1 divide-y divide-white/20 border-y border-white/20 sm:mt-9 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <article key={stat.value} className="py-4 sm:px-7 sm:py-5 first:sm:pl-0 last:sm:pr-0">
                <p className="rm-serif text-[2.8rem] font-semibold leading-none tracking-tight text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:text-[3.6rem] lg:text-[4.1rem]">
                  {stat.value}
                </p>
                <p className="mt-2 max-w-[12rem] text-sm font-semibold leading-5 text-white/80 sm:text-[15px]">
                  {stat.label}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="rm-serif text-[1.45rem] font-semibold leading-tight text-white sm:text-[1.7rem]">
              {t("impactAnswerTitle", locale)}
            </p>
            <TryDemoButton className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#1b3348] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:bg-[#e8f3fb]" />
          </div>
        </div>
      </div>
    </section>
  );
}
