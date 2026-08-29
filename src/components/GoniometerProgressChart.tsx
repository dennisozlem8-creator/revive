import type { GoniometerMeasurement } from "@/lib/goniometer";

type GoniometerProgressChartProps = {
  measurements: GoniometerMeasurement[];
  goal: number;
};

export function GoniometerProgressChart({
  measurements,
  goal,
}: GoniometerProgressChartProps) {
  if (measurements.length === 0) {
    return (
      <p className="rm-body">
        Save a video or photo measurement to see your knee-angle progress over time.
      </p>
    );
  }

  const width = 640;
  const height = 220;
  const pad = { top: 18, right: 16, bottom: 36, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxY = Math.max(goal + 10, ...measurements.map((m) => m.angle), 120);
  const minY = 0;

  const xFor = (i: number) =>
    pad.left + (measurements.length === 1 ? innerW / 2 : (i / (measurements.length - 1)) * innerW);
  const yFor = (angle: number) =>
    pad.top + innerH - ((angle - minY) / (maxY - minY)) * innerH;

  const path = measurements
    .map((m, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(m.angle).toFixed(1)}`)
    .join(" ");
  const goalY = yFor(goal);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-52 w-full"
        role="img"
        aria-label="Knee angle progress over sessions"
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
        <text
          x={width - pad.right}
          y={goalY - 6}
          textAnchor="end"
          fill="var(--correct)"
          fontSize="11"
        >
          Goal {goal}°
        </text>
        <path d={path} fill="none" stroke="var(--brand-light)" strokeWidth="2.5" />
        {measurements.map((m, i) => (
          <g key={m.id}>
            <circle cx={xFor(i)} cy={yFor(m.angle)} r="5" fill="var(--brand)" />
            <text
              x={xFor(i)}
              y={height - 8}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="10"
            >
              {new Date(m.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </text>
          </g>
        ))}
        <text x={4} y={pad.top + 4} fill="var(--muted)" fontSize="10">
          {Math.round(maxY)}°
        </text>
        <text x={4} y={height - pad.bottom} fill="var(--muted)" fontSize="10">
          0°
        </text>
      </svg>
    </div>
  );
}
