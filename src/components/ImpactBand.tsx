"use client";

import { SafePicture } from "@/components/SafePicture";
import { TryDemoButton } from "@/components/TryDemoButton";
import { t, type Locale } from "@/lib/i18n";

export function ImpactBand({
  locale,
  cta,
}: {
  locale: Locale;
  cta: string;
}) {
  const stats = [
    { value: t("impactStat1", locale), label: t("impactStat1Label", locale), source: t("impactStat1Source", locale) },
    { value: t("impactStat2", locale), label: t("impactStat2Label", locale), source: t("impactStat2Source", locale) },
    { value: t("impactStat3", locale), label: t("impactStat3Label", locale), source: t("impactStat3Source", locale) },
  ];
  const fixes = [
    { n: "01", title: t("impactFix1Title", locale), text: t("impactFix1Text", locale) },
    { n: "02", title: t("impactFix2Title", locale), text: t("impactFix2Text", locale) },
    { n: "03", title: t("impactFix3Title", locale), text: t("impactFix3Text", locale) },
  ];

  return (
    <section id="impact" className="scroll-mt-20">
      <div className="relative isolate min-h-[22rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[32rem]">
        <SafePicture
          src="/images/landing-older-session.webp?v=1"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b3348] via-[#1b3348]/88 to-[#1b3348]/45" />
        <div className="relative mx-auto flex min-h-[22rem] w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-12 sm:min-h-[26rem] sm:px-6 sm:pb-20 lg:min-h-[32rem] lg:pb-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9dc4b0]">{t("impactKicker", locale)}</p>
          <h2 className="rm-serif mt-3 max-w-3xl text-[2rem] font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.35rem]">
            {t("impactTitle", locale)}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{t("impactText", locale)}</p>
        </div>
      </div>

      <div className="bg-[#e8f3fb]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="relative z-10 -mt-10 grid gap-3 sm:-mt-12 sm:grid-cols-3 lg:-mt-14">
            {stats.map((stat) => (
              <article
                key={stat.value}
                className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_40px_rgba(27,51,72,0.12)] ring-1 ring-[#4f90c6]/15 sm:p-6"
              >
                <p className="rm-serif text-5xl font-semibold leading-none tracking-tight text-[#1b3348] sm:text-[3.35rem]">
                  {stat.value}
                </p>
                <p className="mt-3 text-base font-semibold leading-6 text-[#1b3348]">{stat.label}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4f90c6]">{stat.source}</p>
              </article>
            ))}
          </div>

          <div className="py-10 lg:py-12">
            <p className="text-sm font-semibold leading-6 text-[#2f4a60]">{t("impactAnswerKicker", locale)}</p>
            <h3 className="rm-serif mt-1 max-w-3xl text-3xl font-semibold leading-tight text-[#1b3348] sm:text-[2.35rem]">
              {t("impactAnswerTitle", locale)}
            </h3>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#1b3348] sm:text-lg sm:leading-8">
              {t("impactAnswerText", locale)}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {fixes.map((fix) => (
                <article
                  key={fix.n}
                  className="rounded-[1.35rem] bg-white p-5 shadow-[0_12px_28px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12"
                >
                  <p className="text-sm font-bold tabular-nums text-[#4f90c6]">{fix.n}</p>
                  <h4 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">{fix.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#2f4a60] sm:text-base">{fix.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <TryDemoButton className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,144,198,0.28)] transition hover:bg-brand-light" />
              <a
                href="#go-in"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#4f90c6] bg-white px-7 text-sm font-semibold text-[#1b3348] transition hover:bg-[#f7fbfe]"
              >
                {cta}
              </a>
            </div>
            <p className="mt-8 text-sm font-semibold text-[#1b3348]">{t("impactDisclaimer", locale)}</p>
            <p className="mt-1 max-w-4xl text-xs leading-5 text-[#2f4a60]">{t("impactSources", locale)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
