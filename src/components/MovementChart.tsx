import type { MovementSample } from "@/lib/pose-goniometer";

export function MovementChart({
  samples,
  goal,
}: {
  samples: MovementSample[];
  goal: number;
}) {
  if (samples.length === 0) {
    return <p className="rm-body">No movement samples yet.</p>;
  }

  const width = 640;
  const height = 220;
  const pad = { top: 18, right: 16, bottom: 36, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxY = Math.max(goal + 10, ...samples.map((sample) => sample.angle), 120);
  const minTime = samples[0].time;
  const maxTime = Math.max(samples[samples.length - 1].time, minTime + 0.1);

  const xFor = (time: number) =>
    pad.left + ((time - minTime) / (maxTime - minTime)) * innerW;
  const yFor = (angle: number) => pad.top + innerH - (angle / maxY) * innerH;
  const path = samples
    .map((sample, i) => `${i === 0 ? "M" : "L"} ${xFor(sample.time).toFixed(1)} ${yFor(sample.angle).toFixed(1)}`)
    .join(" ");
  const goalY = yFor(goal);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-52 w-full"
      role="img"
      aria-label="Knee angle during this video"
    >
      <line
        x1={pad.left}
        x2={width - pad.right}
        y1={goalY}
        y2={goalY}
        stroke="var(--correct)"
        strokeDasharray="6 6"
        strokeWidth="1.5"
      />
      <text x={width - pad.right} y={goalY - 6} textAnchor="end" fill="var(--correct)" fontSize="11">
        Goal {goal}°
      </text>
      <path d={path} fill="none" stroke="var(--brand-light)" strokeWidth="2.5" />
      {samples.filter((_, i) => i % 4 === 0 || i === samples.length - 1).map((sample) => (
        <circle
          key={`${sample.time}-${sample.angle}`}
          cx={xFor(sample.time)}
          cy={yFor(sample.angle)}
          r="3.5"
          fill="var(--brand)"
        />
      ))}
      <text x={4} y={pad.top + 4} fill="var(--muted)" fontSize="10">
        {Math.round(maxY)}°
      </text>
      <text x={pad.left} y={height - 8} fill="var(--muted)" fontSize="10">
        0s
      </text>
      <text x={width - pad.right} y={height - 8} textAnchor="end" fill="var(--muted)" fontSize="10">
        {maxTime.toFixed(1)}s
      </text>
    </svg>
  );
}
