import { SafePicture } from "@/components/SafePicture";
import { t, type Locale } from "@/lib/i18n";

export function SessionStack({ locale = "en" }: { locale?: Locale }) {
  const slides = [
    {
      src: "/images/landing-hero-photo.webp?v=3",
      alt: t("takeSideViewShort", locale),
      n: "01",
      label: t("guidePrepare", locale),
      badge: t("guideBadgePlan", locale),
    },
    {
      src: "/images/landing-older-session.webp?v=1",
      alt: t("doTodaysExercises", locale),
      n: "02",
      label: t("guideSession", locale),
      badge: t("guideBadgeExercise", locale),
    },
    {
      src: "/images/landing-younger-session.webp?v=1",
      alt: t("followThePhone", locale),
      n: "03",
      label: t("guideSaved", locale),
      badge: t("guideBadgeReview", locale),
    },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2 py-3 lg:py-4">
      {slides.map((slide) => (
        <figure key={slide.n} className="overflow-hidden rounded-[1.15rem] bg-[#d7e8f6] shadow-[0_16px_32px_rgba(8,20,32,0.28)]">
          <div className="relative h-32 sm:h-36">
            <SafePicture src={slide.src} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />
            <p className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1b3348]">
              {slide.n} {slide.label}
            </p>
            <p className="absolute right-3 top-3 rounded-full bg-[#4f90c6] px-3 py-1 text-xs font-bold text-white">
              {slide.badge}
            </p>
          </div>
        </figure>
      ))}
      <div className="px-1 pt-2">
        <p className="text-xl font-semibold">{t("guideReportTitle", locale)}</p>
        <p className="mt-1 text-sm leading-5 text-white/75">{t("guideReportText", locale)}</p>
      </div>
    </div>
  );
}
