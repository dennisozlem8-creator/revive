import { SafePicture } from "@/components/SafePicture";
import { t, type Locale } from "@/lib/i18n";

export function SessionStack({ locale = "en" }: { locale?: Locale }) {
  const slides = [
    {
      src: "/images/landing-hero-photo.webp?v=3",
      alt: t("takeSideViewShort", locale),
      n: "01",
      label: t("photoFirst", locale),
      line: t("takeSideViewShort", locale),
    },
    {
      src: "/images/landing-older-session.webp?v=1",
      alt: t("doTodaysExercises", locale),
      n: "02",
      label: t("sessionSlide", locale),
      line: t("doTodaysExercises", locale),
    },
    {
      src: "/images/landing-younger-session.webp?v=1",
      alt: t("followThePhone", locale),
      n: "03",
      label: t("livePlan", locale),
      line: t("followThePhone", locale),
    },
  ] as const;

  return (
    <div
      className="relative isolate flex flex-col gap-6 py-4 sm:gap-8 lg:py-8"
      aria-label={`${t("photoFirst", locale)}, ${t("sessionSlide", locale)}, ${t("livePlan", locale)}`}
    >
      {slides.map((slide, index) => (
        <figure
          key={slide.n}
          className="sticky top-20 overflow-hidden rounded-[1.35rem] bg-[#d7e8f6] shadow-[0_18px_40px_rgba(8,20,32,0.28)] lg:top-24"
          style={{ zIndex: index + 1 }}
        >
          <div className="relative h-[min(28rem,70svh)] sm:h-80 lg:h-[min(34rem,78vh)]">
            <SafePicture
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
            />
            <p className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-sm font-semibold text-[#1b3348] shadow-sm">
              {slide.n} {slide.label}
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b3348]/80 to-transparent px-4 pb-4 pt-12 sm:px-5 sm:pb-5">
              <p className="text-base font-semibold leading-6 text-white sm:text-lg">{slide.line}</p>
            </div>
          </div>
        </figure>
      ))}
      <div className="h-[30vh] shrink-0" aria-hidden />
    </div>
  );
}
