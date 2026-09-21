import type { ReactNode } from "react";

type FigureProps = {
  id: string;
  title?: string;
  className?: string;
};

const ink = "#1b3348";
const shirt = "#4f90c6";
const skin = "#f3d2be";
const move = "#3a7d62";

function Bone({ x1, y1, x2, y2, w = 10 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={w} strokeLinecap="round" />;
}

function Head({ x, y, r = 15 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={skin} stroke={ink} strokeWidth="3" />;
}

function Dot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="4.5" fill={ink} />;
}

function Floor({ y = 168 }: { y?: number }) {
  return <line x1="28" y1={y} x2="292" y2={y} stroke="#c5dced" strokeWidth="4" strokeLinecap="round" />;
}

function Move({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 11;
  const left = [x2 - size * Math.cos(angle - 0.45), y2 - size * Math.sin(angle - 0.45)];
  const right = [x2 - size * Math.cos(angle + 0.45), y2 - size * Math.sin(angle + 0.45)];
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={move} strokeWidth="4" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${left[0]},${left[1]} ${right[0]},${right[1]}`} fill={move} />
    </g>
  );
}

function Shirt({ x, y, w, h, rotate = 0 }: { x: number; y: number; w: number; h: number; rotate?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="10" fill={shirt} transform={rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined} />;
}

const scenes: Record<string, ReactNode> = {
  "heel-slides": (
    <g>
      <Floor />
      <Head x={78} y={118} />
      <Shirt x={92} y={112} w={62} h={22} />
      <Bone x1={154} y1={128} x2={196} y2={96} />
      <Bone x1={196} y1={96} x2={236} y2={156} />
      <Dot x={196} y={96} />
      <Bone x1={154} y1={138} x2={250} y2={158} w={8} />
      <Move x1={248} y1={78} x2={188} y2={78} />
    </g>
  ),
  "quad-sets": (
    <g>
      <Floor />
      <Head x={72} y={116} />
      <Shirt x={86} y={108} w={70} h={22} />
      <Bone x1={156} y1={126} x2={248} y2={150} w={12} />
      <line x1={168} y1={118} x2={214} y2={132} stroke={shirt} strokeWidth="8" strokeLinecap="round" />
      <Move x1={196} y1={78} x2={196} y2={112} />
    </g>
  ),
  "straight-leg-raise": (
    <g>
      <Floor />
      <Head x={70} y={124} />
      <Shirt x={84} y={116} w={64} h={22} />
      <Bone x1={148} y1={136} x2={230} y2={72} />
      <Dot x={148} y={136} />
      <Bone x1={148} y1={146} x2={236} y2={160} w={8} />
      <Move x1={214} y1={108} x2={214} y2={64} />
    </g>
  ),
  "mini-squats": (
    <g>
      <Floor />
      <rect x="214" y="78" width="18" height="90" rx="4" fill="#d5e6f4" />
      <Head x={128} y={58} />
      <Shirt x={112} y={74} w={32} h={40} />
      <Bone x1={128} y1={114} x2={108} y2={142} />
      <Bone x1={108} y1={142} x2={122} y2={168} />
      <Bone x1={144} y1={114} x2={164} y2={142} />
      <Bone x1={164} y1={142} x2={176} y2={168} />
      <Bone x1={140} y1={88} x2={214} y2={96} w={8} />
      <Move x1={78} y1={150} x2={78} y2={118} />
    </g>
  ),
  "calf-stretch": (
    <g>
      <Floor />
      <rect x="36" y="48" width="16" height="120" rx="4" fill="#d5e6f4" />
      <Head x={118} y={62} />
      <Shirt x={104} y={78} w={28} h={42} rotate={-18} />
      <Bone x1={108} y1={92} x2={58} y2={86} w={8} />
      <Bone x1={124} y1={118} x2={96} y2={168} />
      <Bone x1={136} y1={116} x2={188} y2={168} />
      <Move x1={176} y1={132} x2={206} y2={132} />
    </g>
  ),
  "ankle-pumps": (
    <g>
      <Floor y={176} />
      <rect x="54" y="78" width="54" height="14" rx="6" fill="#d5e6f4" />
      <rect x="48" y="92" width="12" height="84" rx="4" fill="#d5e6f4" />
      <Head x={92} y={62} />
      <Shirt x={78} y={78} w={30} h={36} />
      <Bone x1={108} y1={108} x2={176} y2={128} />
      <Bone x1={176} y1={128} x2={214} y2={156} />
      <Bone x1={214} y1={156} x2={246} y2={142} />
      <path d="M214 112c24 8 36 28 28 48" fill="none" stroke={move} strokeWidth="4" strokeLinecap="round" />
      <Move x1={232} y1={150} x2={248} y2={138} />
    </g>
  ),
  "heel-raises": (
    <g>
      <Floor />
      <Head x={150} y={46} />
      <Shirt x={134} y={62} w={32} h={46} />
      <Bone x1={146} y1={108} x2={132} y2={150} />
      <Bone x1={132} y1={150} x2={150} y2={158} />
      <Bone x1={166} y1={108} x2={180} y2={150} />
      <Bone x1={180} y1={150} x2={198} y2={158} />
      <Move x1={214} y1={150} x2={214} y2={108} />
    </g>
  ),
  "resistance-eversion": (
    <g>
      <rect x="48" y="86" width="58" height="14" rx="6" fill="#d5e6f4" />
      <rect x="42" y="100" width="12" height="76" rx="4" fill="#d5e6f4" />
      <Head x={88} y={64} />
      <Shirt x={74} y={80} w={30} h={38} />
      <Bone x1={104} y1={112} x2={188} y2={132} />
      <ellipse cx="214" cy="142" rx="28" ry="12" fill="none" stroke={shirt} strokeWidth="6" />
      <Bone x1={188} y1={132} x2={214} y2={142} />
      <Move x1={230} y1={118} x2={268} y2={104} />
      <Floor y={176} />
    </g>
  ),
  "pelvic-tilt": (
    <g>
      <Floor />
      <Head x={74} y={112} />
      <Shirt x={88} y={104} w={58} h={22} />
      <Bone x1={146} y1={122} x2={188} y2={96} />
      <Bone x1={188} y1={96} x2={176} y2={156} />
      <Bone x1={156} y1={128} x2={198} y2={104} w={8} />
      <Bone x1={198} y1={104} x2={210} y2={160} w={8} />
      <path d="M120 96c18 16 28 16 40 0" fill="none" stroke={move} strokeWidth="4" strokeLinecap="round" />
      <Move x1={150} y1={108} x2={150} y2={128} />
    </g>
  ),
  "cat-cow": (
    <g>
      <Floor />
      <Head x={78} y={108} />
      <path d="M96 112c28 28 70 28 104-2" fill="none" stroke={shirt} strokeWidth="22" strokeLinecap="round" />
      <Bone x1={96} y1={124} x2={96} y2={168} w={8} />
      <Bone x1={188} y1={118} x2={188} y2={168} w={8} />
      <Bone x1={214} y1={112} x2={248} y2={128} w={8} />
      <Move x1={150} y1={72} x2={150} y2={96} />
    </g>
  ),
  "bird-dog": (
    <g>
      <Floor />
      <Head x={86} y={96} />
      <Shirt x={100} y={100} w={78} h={20} />
      <Bone x1={108} y1={120} x2={108} y2={168} w={8} />
      <Bone x1={168} y1={120} x2={168} y2={168} w={8} />
      <Bone x1={100} y1={108} x2={58} y2={86} w={8} />
      <Bone x1={176} y1={110} x2={236} y2={86} w={8} />
    </g>
  ),
  "side-bend-stretch": (
    <g>
      <Floor />
      <Head x={168} y={48} />
      <Shirt x={148} y={64} w={30} h={48} rotate={16} />
      <Bone x1={156} y1={112} x2={140} y2={168} />
      <Bone x1={176} y1={114} x2={188} y2={168} />
      <Bone x1={170} y1={78} x2={214} y2={52} w={8} />
      <Move x1={196} y1={40} x2={228} y2={28} />
    </g>
  ),
  "wrist-circles": (
    <g>
      <Head x={96} y={78} />
      <Shirt x={80} y={94} w={34} h={52} />
      <Bone x1={114} y1={112} x2={188} y2={124} />
      <circle cx="214" cy="124" r="18" fill={skin} stroke={ink} strokeWidth="3" />
      <path d="M214 96a28 28 0 1 1-8 40" fill="none" stroke={move} strokeWidth="4" strokeLinecap="round" />
      <Move x1={196} y1={132} x2={184} y2={144} />
      <Floor />
    </g>
  ),
  "prayer-stretch": (
    <g>
      <Head x={150} y={52} />
      <Shirt x={132} y={68} w={36} h={50} />
      <Bone x1={136} y1={92} x2={150} y2={124} w={8} />
      <Bone x1={164} y1={92} x2={150} y2={124} w={8} />
      <rect x="136" y="118" width="28" height="40" rx="10" fill={skin} stroke={ink} strokeWidth="3" />
      <Move x1={196} y1={128} x2={196} y2={162} />
      <Floor />
    </g>
  ),
  "flexor-stretch": (
    <g>
      <Head x={78} y={78} />
      <Shirt x={62} y={94} w={34} h={50} />
      <Bone x1={96} y1={112} x2={196} y2={112} />
      <Bone x1={196} y1={112} x2={236} y2={92} w={8} />
      <Bone x1={168} y1={128} x2={214} y2={96} w={7} />
      <Move x1={228} y1={78} x2={248} y2={64} />
      <Floor />
    </g>
  ),
  "putty-squeeze": (
    <g>
      <Head x={108} y={64} />
      <Shirt x={92} y={80} w={34} h={50} />
      <Bone x1={126} y1={104} x2={176} y2={124} />
      <circle cx="206" cy="128" r="22" fill={shirt} />
      <path d="M188 118c8 16 28 18 36 4" fill="none" stroke={skin} strokeWidth="8" strokeLinecap="round" />
      <Move x1={206} y1={86} x2={206} y2={104} />
      <Floor />
    </g>
  ),
  "shoulder-rolls": (
    <g>
      <Head x={150} y={52} />
      <Shirt x={132} y={70} w={36} h={48} />
      <Bone x1={136} y1={118} x2={124} y2={168} />
      <Bone x1={164} y1={118} x2={176} y2={168} />
      <path d="M118 86c8-22 36-26 44-6" fill="none" stroke={move} strokeWidth="4" strokeLinecap="round" />
      <Move x1={156} y1={74} x2={168} y2={84} />
      <Floor />
    </g>
  ),
  "hip-flexor-stretch": (
    <g>
      <Floor />
      <Head x={132} y={48} />
      <Shirt x={116} y={64} w={32} h={42} />
      <Bone x1={132} y1={106} x2={108} y2={142} />
      <Bone x1={108} y1={142} x2={128} y2={168} />
      <Bone x1={148} y1={106} x2={196} y2={150} />
      <Bone x1={196} y1={150} x2={168} y2={168} />
      <Move x1={168} y1={84} x2={196} y2={72} />
    </g>
  ),
  "neck-rotation": (
    <g>
      <Head x={156} y={62} />
      <path d="M148 58h10" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <Shirt x={136} y={80} w={36} h={52} />
      <Bone x1={146} y1={132} x2={136} y2={168} />
      <Bone x1={162} y1={132} x2={174} y2={168} />
      <path d="M132 52c-16 8-20 28-8 40" fill="none" stroke={move} strokeWidth="4" strokeLinecap="round" />
      <Move x1={118} y1={84} x2={108} y2={96} />
      <Floor />
    </g>
  ),
  "bodyweight-squat": (
    <g>
      <Floor />
      <rect x="176" y="132" width="62" height="12" rx="4" fill="#d5e6f4" />
      <rect x="186" y="144" width="8" height="24" fill="#d5e6f4" />
      <rect x="220" y="144" width="8" height="24" fill="#d5e6f4" />
      <Head x={124} y={58} />
      <Shirt x={108} y={74} w={32} h={36} />
      <Bone x1={120} y1={110} x2={100} y2={142} />
      <Bone x1={100} y1={142} x2={118} y2={168} />
      <Bone x1={140} y1={110} x2={162} y2={140} />
      <Bone x1={162} y1={140} x2={178} y2={168} />
      <Bone x1={108} y1={90} x2={78} y2={108} w={8} />
    </g>
  ),
};

export function ExerciseFigure({ id, title, className = "" }: FigureProps) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label={title ?? "Exercise illustration"}>
      <rect width="320" height="200" fill="#e8f3fb" />
      {scenes[id] ?? scenes["shoulder-rolls"]}
    </svg>
  );
}
