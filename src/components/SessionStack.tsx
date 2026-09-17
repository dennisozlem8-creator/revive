import { SafePicture } from "@/components/SafePicture";

const slides = [
  {
    src: "/images/landing-older-session.webp?v=1",
    alt: "An older patient doing a guided squat at home.",
    label: "Session",
  },
  {
    src: "/images/landing-younger-phone.webp?v=1",
    alt: "A younger patient following today’s plan on a phone.",
    label: "Check-in",
  },
  {
    src: "/images/landing-younger-session.webp?v=1",
    alt: "A younger patient doing a lunge while watching the phone.",
    label: "Live plan",
  },
  {
    src: "/images/landing-older-phone.webp?v=1",
    alt: "An older patient using Revive Motion on a phone.",
    label: "On this device",
  },
  {
    src: "/images/landing-hero-photo.webp?v=3",
    alt: "A helper photographs a seated patient from the side.",
    label: "Photo first",
  },
] as const;

export function SessionStack() {
  return (
    <div className="flex flex-col gap-3 py-4 lg:py-8" aria-label="Patients using Revive Motion">
      {slides.map((slide) => (
        <figure key={slide.label} className="relative h-72 overflow-hidden rounded-[1.35rem] bg-[#d7e8f6] shadow-[0_18px_40px_rgba(8,20,32,0.28)] sm:h-80 lg:h-[min(34rem,78vh)]">
          <SafePicture
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          />
          <p className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-sm font-semibold text-[#1b3348] shadow-sm">
            {slide.label}
          </p>
        </figure>
      ))}
    </div>
  );
}
