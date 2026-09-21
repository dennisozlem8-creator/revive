"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SafePicture } from "@/components/SafePicture";
import { SectionKicker } from "@/components/SectionKicker";
import { t, tf, type CopyKey, type Locale } from "@/lib/i18n";

const WHO_HELPS: { img: string; title: CopyKey; stat: CopyKey; statText: CopyKey; text: CopyKey }[] = [
  {
    img: "/images/impact-sports.png?v=3",
    title: "helpSportsTitle",
    stat: "helpSportsStat",
    statText: "helpSportsStatText",
    text: "helpSportsText",
  },
  {
    img: "/images/impact-stroke.png?v=3",
    title: "helpStrokeTitle",
    stat: "helpStrokeStat",
    statText: "helpStrokeStatText",
    text: "helpStrokeText",
  },
  {
    img: "/images/impact-parkinsons.png?v=3",
    title: "helpParkinsonTitle",
    stat: "helpParkinsonStat",
    statText: "helpParkinsonStatText",
    text: "helpParkinsonText",
  },
  {
    img: "/images/impact-surgery.png?v=3",
    title: "helpSurgeryTitle",
    stat: "helpSurgeryStat",
    statText: "helpSurgeryStatText",
    text: "helpSurgeryText",
  },
  {
    img: "/images/impact-older.png?v=3",
    title: "helpOlderTitle",
    stat: "helpOlderStat",
    statText: "helpOlderStatText",
    text: "helpOlderText",
  },
  {
    img: "/images/impact-disability.png?v=3",
    title: "helpDisabilityTitle",
    stat: "helpDisabilityStat",
    statText: "helpDisabilityStatText",
    text: "helpDisabilityText",
  },
  {
    img: "/images/impact-chronic.png?v=3",
    title: "helpChronicTitle",
    stat: "helpChronicStat",
    statText: "helpChronicStatText",
    text: "helpChronicText",
  },
  {
    img: "/images/impact-rural.png?v=3",
    title: "helpRuralTitle",
    stat: "helpRuralStat",
    statText: "helpRuralStatText",
    text: "helpRuralText",
  },
  {
    img: "/images/impact-underserved.png?v=3",
    title: "helpUnderservedTitle",
    stat: "helpUnderservedStat",
    statText: "helpUnderservedStatText",
    text: "helpUnderservedText",
  },
];

const IMPACT_SOURCES = [
  { label: "CDC sports injuries", href: "https://blogs.cdc.gov/nchs/2016/11/18/3325/" },
  { label: "CDC stroke", href: "https://www.cdc.gov/stroke/data-research/facts-stats/index.html" },
  { label: "Parkinson’s Foundation", href: "https://www.parkinson.org/understanding-parkinsons/statistics" },
  { label: "American College of Rheumatology", href: "https://rheumatology.org/patients/joint-replacement-surgery" },
  { label: "CDC falls", href: "https://www.cdc.gov/falls/data-research/index.html" },
  { label: "CDC disability", href: "https://www.cdc.gov/places/measure-definitions/disability.html" },
  { label: "CDC arthritis", href: "https://www.cdc.gov/mmwr/volumes/72/wr/mm7241a1.htm" },
  {
    label: "U.S. Census rural population",
    href: "https://www.census.gov/programs-surveys/geography/guidance/geo-areas/urban-rural/2020-ua-facts.html",
  },
  { label: "U.S. Census language data", href: "https://data.census.gov/table/ACSST1Y2023.S1601" },
] as const;

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {dir === "prev" ? (
        <path d="M14.5 6.5 9 12l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9.5 6.5 15 12l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function WhoHelpsSlider({ locale }: { locale: Locale }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = WHO_HELPS.length;

  const goTo = useCallback(
    (next: number) => {
      const clamped = (next + total) % total;
      const root = scroller.current;
      const slide = root?.querySelector<HTMLElement>(`[data-slide="${clamped}"]`);
      const first = root?.querySelector<HTMLElement>("[data-slide]");
      if (!root || !slide || !first) return;
      root.scrollTo({ left: slide.offsetLeft - first.offsetLeft, behavior: "smooth" });
      setIndex(clamped);
    },
    [total]
  );

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;

    const slides = [...root.querySelectorAll<HTMLElement>("[data-slide]")];
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.slide);
        if (!Number.isNaN(next)) setIndex(next);
      },
      { root, threshold: 0.55 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#f7fbfe]" aria-labelledby="who-helps-title">
      <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#b9d9ee]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-[#c7e1d1]/35 blur-3xl" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:gap-10">
          <div className="max-w-2xl">
            <SectionKicker>{t("whoHelpsKicker", locale)}</SectionKicker>
            <h3
              id="who-helps-title"
              className="rm-serif mt-4 whitespace-pre-line text-[1.85rem] font-semibold leading-[1.08] tracking-tight text-[#1b3348] sm:text-[2.65rem] lg:text-[3.15rem]"
            >
              {t("whoHelpsTitle", locale)}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#38556d] sm:text-base sm:leading-7">
              {t("whoHelpsText", locale)}
            </p>
          </div>

          <aside className="rounded-[1.35rem] border border-[#4f90c6]/15 bg-white p-5 shadow-[0_18px_42px_rgba(27,51,72,0.10)] sm:p-6">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-[#4f90c6]">
              {t("whoHelpsSummaryKicker", locale)}
            </p>
            <p className="rm-serif mt-2 text-xl font-semibold leading-tight text-[#1b3348] sm:text-2xl">
              {t("whoHelpsSummaryTitle", locale)}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#e8f3fb] px-2 py-3 text-center">
                <p className="rm-serif text-2xl font-semibold leading-none text-[#1b3348]">9</p>
                <p className="mt-1 text-[0.6rem] font-extrabold leading-tight text-[#48657c] sm:text-[0.68rem]">
                  {t("whoHelpsGroups", locale)}
                </p>
              </div>
              <div className="rounded-xl bg-[#e8f3fb] px-2 py-3 text-center">
                <p className="rm-serif text-2xl font-semibold leading-none text-[#1b3348]">1</p>
                <p className="mt-1 text-[0.6rem] font-extrabold leading-tight text-[#48657c] sm:text-[0.68rem]">
                  {t("whoHelpsSharedPassport", locale)}
                </p>
              </div>
              <div className="rounded-xl bg-[#e8f3fb] px-2 py-3 text-center">
                <p className="rm-serif text-xl font-semibold leading-none text-[#1b3348] sm:text-2xl">EN + ES</p>
                <p className="mt-1 text-[0.6rem] font-extrabold leading-tight text-[#48657c] sm:text-[0.68rem]">
                  {t("whoHelpsFullExperience", locale)}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-[#4f90c6] sm:text-xs">
            {t("whoHelpsExplore", locale)}
          </p>
          <p className="shrink-0 text-xs font-semibold tabular-nums text-[#2f4a60] sm:text-sm">
            {tf("whoHelpsOf", locale, { n: String(index + 1).padStart(2, "0"), total: String(total).padStart(2, "0") })}
          </p>
        </div>

        <div className="relative mt-3">
        <div
          ref={scroller}
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:gap-4 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
          aria-roledescription="carousel"
          aria-label={t("whoHelpsTitle", locale)}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goTo(index - 1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              goTo(index + 1);
            }
          }}
        >
          {WHO_HELPS.map((item, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <figure
                key={item.title}
                data-slide={i}
                aria-hidden={i !== index}
                className="relative w-[86%] shrink-0 snap-start overflow-hidden rounded-[1.35rem] bg-[#d7e8f6] shadow-[0_18px_40px_rgba(8,20,32,0.18)] sm:w-[70%] lg:w-[62%]"
              >
                <div className="relative h-[21rem] sm:h-80 lg:h-[26.5rem]">
                  <SafePicture
                    src={item.img}
                    alt={t(item.title, locale)}
                    className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
                  />
                  <p className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-sm font-semibold tabular-nums text-[#1b3348] shadow-sm">
                    {n}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b3348]/95 via-[#1b3348]/78 to-transparent px-4 pb-4 pt-20 sm:px-6 sm:pb-5 sm:pt-24">
                    <div className="mb-2 text-white sm:flex sm:items-end sm:gap-2.5">
                      <strong className="rm-display block shrink-0 text-2xl font-semibold leading-none sm:text-[2rem]">
                        {t(item.stat, locale)}
                      </strong>
                      <span className="mt-1 block max-w-[24rem] text-[0.72rem] font-semibold leading-[1.3] text-white/90 sm:mt-0 sm:text-xs">
                        {t(item.statText, locale)}
                      </span>
                    </div>
                    <h4 className="rm-serif text-xl font-semibold leading-tight text-white sm:text-2xl">{t(item.title, locale)}</h4>
                    <p className="mt-1 text-sm font-semibold leading-6 text-white/90 sm:text-base">{t(item.text, locale)}</p>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 sm:flex lg:px-2">
            <button
              type="button"
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#1b3348] shadow-[0_12px_28px_rgba(8,20,32,0.18)] ring-1 ring-[#4f90c6]/15 transition hover:bg-white"
              aria-label={t("whoHelpsPrev", locale)}
              onClick={() => goTo(index - 1)}
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#1b3348] shadow-[0_12px_28px_rgba(8,20,32,0.18)] ring-1 ring-[#4f90c6]/15 transition hover:bg-white"
              aria-label={t("whoHelpsNext", locale)}
              onClick={() => goTo(index + 1)}
            >
              <Chevron dir="next" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1b3348] shadow-[0_10px_24px_rgba(27,51,72,0.08)] ring-1 ring-[#4f90c6]/15"
            aria-label={t("whoHelpsPrev", locale)}
            onClick={() => goTo(index - 1)}
          >
            <Chevron dir="prev" />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {WHO_HELPS.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={`${String(i + 1).padStart(2, "0")} ${t(item.title, locale)}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition ${i === index ? "w-6 bg-[#4f90c6]" : "w-2.5 bg-[#4f90c6]/30"}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1b3348] shadow-[0_10px_24px_rgba(27,51,72,0.08)] ring-1 ring-[#4f90c6]/15"
            aria-label={t("whoHelpsNext", locale)}
            onClick={() => goTo(index + 1)}
          >
            <Chevron dir="next" />
          </button>
        </div>

        <div className="mt-5 hidden gap-2 sm:flex sm:flex-wrap">
          {WHO_HELPS.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                i === index
                  ? "bg-[#4f90c6] text-white shadow-sm"
                  : "bg-white text-[#2f4a60] ring-1 ring-[#4f90c6]/12 hover:text-[#1b3348]"
              }`}
            >
              {t(item.title, locale)}
            </button>
          ))}
        </div>
        <p className="mt-4 max-w-5xl text-xs leading-5 text-[#4d6478]">
          {t("whoHelpsSources", locale)}:{" "}
          {IMPACT_SOURCES.map((source, i) => (
            <span key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#2575b7] underline-offset-2 hover:underline"
              >
                {source.label}
              </a>
              {i < IMPACT_SOURCES.length - 1 ? ", " : "."}
            </span>
          ))}
          {" "}
          {t("whoHelpsSourceNote", locale)}
        </p>
      </div>
    </section>
  );
}
