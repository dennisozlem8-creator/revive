import type { ReactNode } from "react";
import { SafePicture } from "@/components/SafePicture";

export function PhotoFrame({
  src,
  alt,
  className = "",
  children,
  fit = "cover",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
  fit?: "cover" | "contain";
  imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${fit === "contain" ? "bg-white" : "bg-[#d7e8f6]"} ${className}`}>
      <SafePicture
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
      />
      {children}
    </div>
  );
}

/** Unique square Revive Motion photo-goniometer shot, composed to fill overlay cards. */
export function PhotoGoniometerPhoto({
  className = "",
  alt = "Revive Motion photo goniometer: navy polo, smartphone photographing a bent knee with a live 92 degree overlay.",
  imgClassName = "object-cover object-center",
}: {
  className?: string;
  alt?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#d7e8f6] ${className}`}>
      <SafePicture
        src="/images/landing-photo-goniometer.png?v=1"
        alt={alt}
        className={`absolute inset-0 h-full w-full ${imgClassName}`}
      />
    </div>
  );
}

/** Unique square Revive Motion MPU shot, composed to fill overlay cards. */
export function MpuAnglePhoto({
  className = "",
  alt = "Revive Motion MPU-6050 straps on the upper arm and wrist with a live elbow angle of 92 degrees.",
  imgClassName = "object-cover object-center",
}: {
  className?: string;
  alt?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#d7e8f6] ${className}`}>
      <SafePicture
        src="/images/landing-mpu.png?v=6"
        alt={alt}
        className={`absolute inset-0 h-full w-full ${imgClassName}`}
      />
    </div>
  );
}

/** MyoWare arm shot: contain + padding so the elbow, pads, and shirt stay inside the frame. */
export function MyoWarePhoto({
  className = "",
  alt = "MyoWare 2.0 muscle sensor with electrode pads on an upper arm.",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <SafePicture
        src="/images/landing-myoware.png?v=5"
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain p-1.5 sm:p-2.5"
      />
    </div>
  );
}

export function JointMarks({ className = "" }: { className?: string }) {
  return (
    <PhotoFrame src="/images/landing-leg-marks.webp" alt="Side view of a seated leg from hip to ankle." className={className}>
      <Marker left="20%" top="22%" color="#e35d5d" label="HIP" />
      <Marker left="41%" top="30%" color="#3a7d62" label="KNEE" />
      <Marker left="74%" top="84%" color="#4f90c6" label="ANKLE" />
      <div className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1.5 text-sm font-bold text-white shadow">
        92 deg
      </div>
    </PhotoFrame>
  );
}

function Marker({
  left,
  top,
  color,
  label,
}: {
  left: string;
  top: string;
  color: string;
  label: string;
}) {
  return (
    <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
      <span className="block h-4 w-4 rounded-full border-2 border-white shadow" style={{ background: color }} />
      <span className="mt-1 block rounded-full bg-white/95 px-1.5 py-0.5 text-center text-[10px] font-bold tracking-[0.08em] shadow" style={{ color }}>
        {label}
      </span>
    </span>
  );
}

export function RomChart({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid items-center gap-3 border border-[#c5d9ea] bg-white p-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-5 sm:p-4 ${className}`}
    >
      <div>
        <p className="rm-label text-brand-light">Progress</p>
        <p className="rm-serif mt-0.5 text-xl font-semibold leading-tight sm:text-2xl">Motion is rising</p>
        <p className="mt-1 text-sm text-muted">Saved angles stay with the care team.</p>
      </div>
      <svg viewBox="0 0 280 100" className="h-20 w-full sm:h-24" role="img" aria-label="Range of motion chart going up toward the goal">
        <line x1="16" y1="78" x2="264" y2="78" stroke="#d7e8f6" />
        <line x1="16" y1="28" x2="264" y2="28" stroke="#c5d9ea" strokeDasharray="4 5" />
        <text x="264" y="22" textAnchor="end" fill="#3a7d62" fontSize="11" fontWeight="700">
          Goal
        </text>
        <polyline
          points="20,86 70,76 120,64 170,48 220,36 258,24"
          fill="none"
          stroke="#4f90c6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="86" r="4" fill="#4f90c6" />
        <circle cx="70" cy="76" r="4" fill="#4f90c6" />
        <circle cx="120" cy="64" r="4" fill="#4f90c6" />
        <circle cx="170" cy="48" r="4" fill="#4f90c6" />
        <circle cx="220" cy="36" r="4" fill="#4f90c6" />
        <circle cx="258" cy="24" r="5" fill="#3a7d62" />
      </svg>
    </div>
  );
}

export function OverlayCard({
  src,
  alt = "",
  kicker,
  title,
  text,
  media,
  href,
  className = "",
  imgClassName = "object-[center_22%]",
}: {
  src?: string;
  alt?: string;
  kicker?: string;
  title: string;
  text: string;
  media?: ReactNode;
  href?: string;
  className?: string;
  imgClassName?: string;
}) {
  const inner = (
    <>
      {media ?? (src ? <PhotoFrame src={src} alt={alt} className="absolute inset-0 h-full w-full" imgClassName={imgClassName} /> : null)}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b3348]/80 via-[#1b3348]/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        {kicker ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">{kicker}</p>
        ) : null}
        <h3 className="rm-serif mt-0.5 text-xl font-semibold leading-tight sm:text-2xl">{title}</h3>
        <p className="mt-1 max-w-md text-sm leading-5 text-white/90">{text}</p>
      </div>
    </>
  );
  const cls = `relative isolate block min-h-[17rem] overflow-hidden rounded-[1.35rem] sm:min-h-[21rem] ${className}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return <article className={cls}>{inner}</article>;
}

export function PhonePreview({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="flex h-full min-h-[20.5rem] flex-col rounded-[1.85rem] bg-gradient-to-b from-[#d7ebf7] to-[#cfe4f4] p-2 shadow-[0_18px_36px_rgba(27,51,72,0.1)] ring-1 ring-white/70 sm:min-h-[24.5rem] sm:p-2.5">
      <div className="flex items-center justify-center gap-2 pb-2 pt-0.5">
        <span className="h-1 w-7 rounded-full bg-[#1b3348]/20" />
        <p className="text-sm font-semibold tracking-wide text-[#1b3348]">{title}</p>
        <span className="h-1 w-7 rounded-full bg-[#1b3348]/20" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] bg-white">
        {children}
      </div>
    </article>
  );
}
