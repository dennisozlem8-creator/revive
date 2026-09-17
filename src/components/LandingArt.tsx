import type { ReactNode } from "react";

type ArtProps = {
  className?: string;
  title: string;
};

function Frame({ className, title, children, viewBox }: ArtProps & { children: ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function PeoplePhotoArt({ className }: { className?: string }) {
  return (
    <Frame className={className} title="Helper photographing a seated patient" viewBox="0 0 800 340">
      <rect width="800" height="340" rx="28" fill="#e8f3fb" />
      <rect x="0" y="250" width="800" height="90" fill="#d7e8f6" />
      <ellipse cx="400" cy="318" rx="310" ry="16" fill="#c5d9ea" />
      <rect x="36" y="28" width="728" height="54" rx="16" fill="#ffffff" />
      <text x="56" y="52" fill="#1b3348" fontSize="20" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        How the photo works
      </text>
      <text x="56" y="72" fill="#3d7eb4" fontSize="13" fontFamily="ui-sans-serif,system-ui">
        A helper takes a side-view photo. You tap hip, knee, and ankle.
      </text>

      <circle cx="168" cy="138" r="22" fill="#e8c4a8" />
      <path d="M154 132c5-12 24-14 30 0" stroke="#c48a62" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="146" y="158" width="46" height="72" rx="16" fill="#3a7d62" />
      <path d="M154 228c-8 18-2 34 16 36" stroke="#2a3d52" strokeWidth="11" strokeLinecap="round" />
      <path d="M186 228c10 16 8 32-8 36" stroke="#2a3d52" strokeWidth="11" strokeLinecap="round" />
      <rect x="192" y="164" width="32" height="46" rx="8" fill="#1b3348" />
      <circle cx="208" cy="182" r="8" fill="#7ec8f0" />
      <rect x="196" y="154" width="24" height="12" rx="3" fill="#1b3348" />
      <text x="122" y="278" fill="#3d7eb4" fontSize="12" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        Helper + camera
      </text>

      <rect x="428" y="186" width="196" height="16" rx="4" fill="#8aa4bc" />
      <rect x="446" y="202" width="16" height="86" rx="3" fill="#6b849c" />
      <rect x="590" y="202" width="16" height="86" rx="3" fill="#6b849c" />
      <circle cx="536" cy="108" r="26" fill="#f0c8a8" />
      <path d="M522 102c6-14 28-16 36 0" stroke="#c48a62" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="510" y="132" width="54" height="78" rx="18" fill="#4f90c6" />
      <path d="M564 176c36 10 58 36 66 72" stroke="#2a3d52" strokeWidth="14" strokeLinecap="round" />
      <path d="M630 248c22 4 34-14 48-46" stroke="#2a3d52" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="686" cy="198" rx="22" ry="10" fill="#2a3d52" />
      <circle cx="564" cy="176" r="8" fill="#e35d5d" />
      <circle cx="630" cy="248" r="8" fill="#3a7d62" />
      <circle cx="678" cy="202" r="8" fill="#4f90c6" />
      <path d="M564 176L630 248L678 202" stroke="#1b3348" strokeWidth="3.5" />
      <text x="546" y="164" fill="#e35d5d" fontSize="12" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        HIP
      </text>
      <text x="640" y="272" fill="#3a7d62" fontSize="12" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        KNEE
      </text>
      <text x="688" y="188" fill="#4f90c6" fontSize="12" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        ANKLE
      </text>
      <rect x="698" y="214" width="72" height="28" rx="14" fill="#4f90c6" />
      <text x="734" y="233" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        92 deg
      </text>
    </Frame>
  );
}

export function PhotoFlowArt({ className }: { className?: string }) {
  return (
    <Frame className={className} title="Photo, three points, angle, save, chart, then today" viewBox="0 0 720 140">
      <rect width="720" height="140" rx="20" fill="#f7fbfe" />
      <g fontFamily="ui-sans-serif,system-ui" fontWeight="700" fontSize="12" textAnchor="middle">
        <circle cx="70" cy="52" r="28" fill="#e8f3fb" stroke="#4f90c6" />
        <path d="M60 50h8l3-4h8l3 4h8v16H60z" stroke="#4f90c6" fill="none" strokeWidth="1.8" />
        <circle cx="74" cy="58" r="3.5" stroke="#4f90c6" fill="none" />
        <text x="70" y="100" fill="#1b3348">
          Photo
        </text>
        <path d="M112 52h28" stroke="#4f90c6" strokeWidth="3" />
        <circle cx="184" cy="52" r="28" fill="#e7f1ea" stroke="#3a7d62" />
        <circle cx="172" cy="48" r="4" fill="#e35d5d" />
        <circle cx="184" cy="62" r="4" fill="#3a7d62" />
        <circle cx="198" cy="46" r="4" fill="#4f90c6" />
        <path d="M172 48L184 62L198 46" stroke="#1b3348" strokeWidth="1.6" />
        <text x="184" y="100" fill="#1b3348">
          3 points
        </text>
        <path d="M226 52h28" stroke="#4f90c6" strokeWidth="3" />
        <circle cx="298" cy="52" r="28" fill="#eef0fb" stroke="#5a6f82" />
        <text x="298" y="56" fill="#4a4f8a" fontSize="11">
          92 deg
        </text>
        <text x="298" y="100" fill="#1b3348">
          Angle
        </text>
        <path d="M340 52h28" stroke="#4f90c6" strokeWidth="3" />
        <circle cx="412" cy="52" r="28" fill="#f3eee6" stroke="#c47a32" />
        <rect x="400" y="42" width="24" height="20" rx="3" fill="none" stroke="#c47a32" strokeWidth="1.8" />
        <path d="M404 48h16M404 54h10" stroke="#c47a32" strokeWidth="1.6" />
        <text x="412" y="100" fill="#1b3348">
          Save
        </text>
        <path d="M454 52h28" stroke="#4f90c6" strokeWidth="3" />
        <circle cx="526" cy="52" r="28" fill="#ece7f4" stroke="#6b5ca5" />
        <polyline points="512,64 520,56 528,58 540,44" fill="none" stroke="#6b5ca5" strokeWidth="2.2" />
        <text x="526" y="100" fill="#1b3348">
          Chart
        </text>
        <path d="M568 52h28" stroke="#4f90c6" strokeWidth="3" />
        <circle cx="650" cy="52" r="28" fill="#fff4e0" stroke="#c47a32" />
        <path d="M642 48h16v16h-16z" fill="none" stroke="#c47a32" strokeWidth="1.8" />
        <path d="M646 56h8M646 60h5" stroke="#c47a32" strokeWidth="1.6" />
        <text x="650" y="100" fill="#1b3348">
          Today
        </text>
      </g>
    </Frame>
  );
}

export function AngleChartArt({ className }: { className?: string }) {
  return (
    <Frame className={className} title="Hip, knee, and ankle with a 92 deg estimate and a rising chart" viewBox="0 0 560 220">
      <rect width="560" height="220" rx="20" fill="#f7fbfe" />
      <rect x="28" y="28" width="300" height="164" rx="16" fill="#fff" stroke="#c5d9ea" />
      <rect x="70" y="78" width="120" height="14" rx="4" fill="#9bb8d0" />
      <rect x="70" y="98" width="86" height="70" rx="8" fill="#e8f3fb" />
      <path d="M92 160 Q128 104 164 160" stroke="#4f90c6" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="160" r="6" fill="#e35d5d" />
      <circle cx="128" cy="118" r="6" fill="#3a7d62" />
      <circle cx="164" cy="160" r="6" fill="#4f90c6" />
      <text x="92" y="184" textAnchor="middle" fill="#e35d5d" fontSize="10" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        HIP
      </text>
      <text x="128" y="108" textAnchor="middle" fill="#3a7d62" fontSize="10" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        KNEE
      </text>
      <text x="176" y="184" fill="#4f90c6" fontSize="10" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        ANKLE
      </text>
      <rect x="214" y="112" width="86" height="52" rx="12" fill="#e8f3fb" stroke="#4f90c6" />
      <text x="257" y="134" textAnchor="middle" fill="#3d7eb4" fontSize="10" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        ESTIMATED
      </text>
      <text x="257" y="154" textAnchor="middle" fill="#1b3348" fontSize="18" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        92 deg
      </text>
      <rect x="352" y="28" width="180" height="164" rx="16" fill="#fff" stroke="#c5d9ea" />
      <text x="442" y="56" textAnchor="middle" fill="#3d7eb4" fontSize="11" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        ROM PROGRESS
      </text>
      <path d="M380 160 L400 148 L420 132 L440 118 L500 96" stroke="#4f90c6" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="380" cy="160" r="4" fill="#4f90c6" />
      <circle cx="400" cy="148" r="4" fill="#4f90c6" />
      <circle cx="420" cy="132" r="4" fill="#4f90c6" />
      <circle cx="440" cy="118" r="4" fill="#4f90c6" />
      <circle cx="500" cy="96" r="4" fill="#3a7d62" />
      <line x1="372" y1="88" x2="516" y2="88" stroke="#c5d9ea" strokeDasharray="4 4" />
      <text x="508" y="82" fill="#3a7d62" fontSize="10" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        Goal
      </text>
    </Frame>
  );
}

export function MpuArt({ className }: { className?: string }) {
  return (
    <Frame className={className} title="MPU-6050 motion sensor on the knee" viewBox="0 0 360 180">
      <rect width="360" height="180" rx="16" fill="#eef0fb" />
      <circle cx="180" cy="40" r="16" fill="#f0c8a8" />
      <rect x="164" y="54" width="32" height="44" rx="12" fill="#4a4f8a" />
      <path d="M172 98v46" stroke="#2a3d52" strokeWidth="10" strokeLinecap="round" />
      <path d="M188 98v46" stroke="#2a3d52" strokeWidth="10" strokeLinecap="round" />
      <rect x="158" y="118" width="24" height="16" rx="4" fill="#8a90d0" />
      <rect x="162" y="122" width="16" height="8" rx="1" fill="#fff" />
      <circle cx="170" cy="126" r="2" fill="#4a4f8a" />
      <text x="180" y="172" textAnchor="middle" fill="#4a4f8a" fontSize="13" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        MPU-6050 on the joint
      </text>
    </Frame>
  );
}

export function MyowareArt({ className }: { className?: string }) {
  return (
    <Frame className={className} title="MyoWare muscle sensor on the arm" viewBox="0 0 360 180">
      <rect width="360" height="180" rx="16" fill="#f3eefc" />
      <path d="M90 142c40-84 140-84 180 0" stroke="#c5b3dc" strokeWidth="34" fill="none" strokeLinecap="round" />
      <rect x="148" y="68" width="64" height="40" rx="8" fill="#5a3d8a" />
      <circle cx="160" cy="88" r="6" fill="#f3eefc" />
      <circle cx="180" cy="88" r="6" fill="#f3eefc" />
      <circle cx="200" cy="88" r="6" fill="#e8c56b" />
      <path d="M120 36h20l8-16 12 32 8-16h20" stroke="#5a3d8a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <text x="180" y="172" textAnchor="middle" fill="#5a3d8a" fontSize="13" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        MyoWare 2.0
      </text>
    </Frame>
  );
}

export function AppScreenArt({
  className,
  kind,
}: {
  className?: string;
  kind: "briefing" | "session" | "dashboard" | "checkin";
}) {
  const copy = {
    briefing: { accent: "#4f90c6", label: "Today", value: "Plan" },
    session: { accent: "#3a7d62", label: "Live", value: "ROM" },
    dashboard: { accent: "#4a4f8a", label: "Trend", value: "Up" },
    checkin: { accent: "#c47a32", label: "Pain", value: "2" },
  }[kind];

  return (
    <Frame className={className} title={`${copy.label} screen`} viewBox="0 0 400 160">
      <rect width="400" height="160" fill="#e8f3fb" />
      <rect x="24" y="24" width="352" height="112" rx="16" fill="#ffffff" stroke="#c5d9ea" />
      <rect x="44" y="44" width="140" height="10" rx="5" fill={copy.accent} />
      <rect x="44" y="66" width="210" height="8" rx="4" fill="#c5d9ea" />
      <rect x="44" y="86" width="170" height="8" rx="4" fill="#d7e8f6" />
      <rect x="44" y="108" width="72" height="16" rx="6" fill={copy.accent} />
      <rect x="268" y="48" width="84" height="72" rx="12" fill="#d7ebf7" />
      <text x="310" y="78" textAnchor="middle" fill="#1b3348" fontSize="12" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        {copy.label}
      </text>
      <text x="310" y="100" textAnchor="middle" fill={copy.accent} fontSize="18" fontFamily="ui-sans-serif,system-ui" fontWeight="700">
        {copy.value}
      </text>
    </Frame>
  );
}

export function KidsQuestBannerArt({ className }: { className?: string }) {
  return (
    <Frame className={className} title="Kids Quest adventure world" viewBox="0 0 640 160">
      <defs>
        <linearGradient id="kq-sky" x1="320" y1="0" x2="320" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3a5cb8" />
          <stop offset="0.45" stopColor="#7aa8e8" />
          <stop offset="1" stopColor="#ffb070" />
        </linearGradient>
      </defs>
      <rect width="640" height="160" fill="url(#kq-sky)" />
      <circle cx="320" cy="70" r="36" fill="#ffe7b0" />
      <path d="M0 108c80-24 140 8 220 0 90-8 140-28 220 4 80 28 120 8 200-8v56H0z" fill="#3d8a62" />
      <circle cx="180" cy="118" r="14" fill="#f0b070" />
      <circle cx="460" cy="116" r="14" fill="#c8b0f0" />
    </Frame>
  );
}
