import type { ReactNode } from "react";
import { SafePicture } from "@/components/SafePicture";

export function PhotoFrame({
  src,
  alt,
  className = "",
  children,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
  fit?: "cover" | "contain";
}) {
  return (
    <div className={`relative overflow-hidden ${fit === "contain" ? "bg-white" : "bg-[#d7e8f6]"} ${className}`}>
      <SafePicture
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      />
      {children}
    </div>
  );
}

/** Unique Revive Motion MPU shot: padded so the live angle is never cropped. */
export function MpuAnglePhoto({
  className = "",
  alt = "Revive Motion MPU-6050 straps on the upper arm and wrist with a live elbow angle of 92 degrees.",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#e8f3fb] ${className}`}>
      <SafePicture
        src="/images/landing-mpu.png?v=4"
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain p-1.5 sm:p-2.5"
      />
      <div className="pointer-events-none absolute inset-2 rounded-lg ring-2 ring-[#4f90c6]/55 sm:inset-3 sm:rounded-xl" />
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

export function PhonePreview({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12">
      <div className="bg-[#e8f3fb] px-2 py-1 text-center text-[10px] font-semibold tracking-[0.16em] text-brand-light sm:px-3 sm:py-1.5">
        {title.toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col bg-[#f7fbfe] p-1.5 sm:p-2">{children}</div>
    </article>
  );
}
