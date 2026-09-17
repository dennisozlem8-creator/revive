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

/** Unique Revive Motion MPU shot: full 4:3 frame, padded so the live angle is never cropped. */
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
        className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5"
      />
      <div className="pointer-events-none absolute inset-3 rounded-xl ring-2 ring-[#4f90c6]/55 sm:inset-4" />
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
    <div className={`flex h-full flex-col justify-between border border-[#c5d9ea] bg-white p-6 sm:p-7 ${className}`}>
      <div>
        <p className="rm-label text-brand-light">Progress</p>
        <p className="rm-serif mt-1 text-2xl font-semibold">Motion is rising</p>
      </div>
      <svg viewBox="0 0 280 120" className="mt-4 h-28 w-full" role="img" aria-label="Range of motion chart going up toward the goal">
        <line x1="16" y1="88" x2="264" y2="88" stroke="#d7e8f6" />
        <line x1="16" y1="36" x2="264" y2="36" stroke="#c5d9ea" strokeDasharray="4 5" />
        <text x="264" y="28" textAnchor="end" fill="#3a7d62" fontSize="11" fontWeight="700">
          Goal
        </text>
        <polyline
          points="20,96 70,86 120,74 170,58 220,46 258,34"
          fill="none"
          stroke="#4f90c6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="96" r="4" fill="#4f90c6" />
        <circle cx="70" cy="86" r="4" fill="#4f90c6" />
        <circle cx="120" cy="74" r="4" fill="#4f90c6" />
        <circle cx="170" cy="58" r="4" fill="#4f90c6" />
        <circle cx="220" cy="46" r="4" fill="#4f90c6" />
        <circle cx="258" cy="34" r="5" fill="#3a7d62" />
      </svg>
      <p className="mt-2 text-sm text-muted">Saved angles stay with the care team.</p>
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
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_16px_40px_rgba(27,51,72,0.07)] ring-1 ring-[#4f90c6]/12">
      <div className="bg-[#e8f3fb] px-4 py-2.5 text-center text-[11px] font-semibold tracking-[0.16em] text-brand-light">
        {title.toUpperCase()}
      </div>
      <div className="aspect-[4/5] bg-[#f7fbfe] p-3">{children}</div>
    </article>
  );
}
