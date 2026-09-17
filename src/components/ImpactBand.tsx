"use client";

import { SafePicture } from "@/components/SafePicture";
import { TryDemoButton } from "@/components/TryDemoButton";
import { t, type CopyKey, type Locale } from "@/lib/i18n";

const WHO_HELPS: { img: string; title: CopyKey; text: CopyKey; alt: CopyKey }[] = [
  { img: "/images/impact-sports.png?v=2", title: "helpSportsTitle", text: "helpSportsText", alt: "helpSportsTitle" },
  { img: "/images/impact-stroke.png?v=2", title: "helpStrokeTitle", text: "helpStrokeText", alt: "helpStrokeTitle" },
  { img: "/images/impact-parkinsons.png?v=2", title: "helpParkinsonTitle", text: "helpParkinsonText", alt: "helpParkinsonTitle" },
  { img: "/images/impact-surgery.png?v=2", title: "helpSurgeryTitle", text: "helpSurgeryText", alt: "helpSurgeryTitle" },
  { img: "/images/impact-older.png?v=2", title: "helpOlderTitle", text: "helpOlderText", alt: "helpOlderTitle" },
  { img: "/images/impact-disability.png?v=2", title: "helpDisabilityTitle", text: "helpDisabilityText", alt: "helpDisabilityTitle" },
  { img: "/images/impact-chronic.png?v=2", title: "helpChronicTitle", text: "helpChronicText", alt: "helpChronicTitle" },
  { img: "/images/impact-rural.png?v=2", title: "helpRuralTitle", text: "helpRuralText", alt: "helpRuralTitle" },
  { img: "/images/impact-underserved.png?v=2", title: "helpUnderservedTitle", text: "helpUnderservedText", alt: "helpUnderservedTitle" },
];

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

            <div className="mt-6 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="rm-serif text-[1.35rem] font-semibold leading-snug text-white sm:text-[1.6rem]">
                  {t("impactAnswerTitle", locale)}
                </p>
                <p className="mt-2 text-[15px] leading-6 text-white/82 sm:text-base sm:leading-7">
                  {t("impactAnswerText", locale)}
                </p>
              </div>
              <TryDemoButton className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#1b3348] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:bg-[#e8f3fb] sm:w-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbfe]">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold leading-6 text-[#2f4a60] sm:text-base">{t("whoHelpsKicker", locale)}</p>
            <h3 className="rm-serif mt-1 text-3xl font-semibold leading-tight text-[#1b3348] sm:text-[2.35rem]">
              {t("whoHelpsTitle", locale)}
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-[#1b3348] sm:text-lg sm:leading-8">
              {t("whoHelpsText", locale)}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHO_HELPS.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[1.35rem] bg-white text-center shadow-[0_12px_28px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12 sm:text-left"
              >
                <SafePicture
                  src={item.img}
                  alt={t(item.alt, locale)}
                  className="h-44 w-full object-cover object-center sm:h-48"
                />
                <div className="px-4 py-4 sm:px-5">
                  <h4 className="rm-serif text-xl font-semibold leading-tight text-[#1b3348]">{t(item.title, locale)}</h4>
                  <p className="mt-1 text-sm leading-6 text-[#2f4a60] sm:text-[15px]">{t(item.text, locale)}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-[#2f4a60]">{t("whoHelpsNote", locale)}</p>
        </div>
      </section>
    </div>
  );
}
