import type { DeviceReading } from "@/lib/device-sensor";

type DeviceLineChartProps = {
  readings: DeviceReading[];
  activeMovementId?: string;
  height?: number;
};

export function DeviceLineChart({
  readings,
  activeMovementId,
  height = 180,
}: DeviceLineChartProps) {
  const filtered = activeMovementId
    ? readings.filter((r) => r.movementId === activeMovementId)
    : readings.slice(-60);

  if (filtered.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-background text-sm text-muted"
        style={{ height }}
      >
        Waiting for sensor data...
      </div>
    );
  }

  const width = 600;
  const padding = 24;
  const maxAngle = Math.max(60, ...filtered.map((r) => r.angle));
  const maxTime = Math.max(1, filtered[filtered.length - 1].time);

  const points = filtered
    .map((r) => {
      const x =
        padding +
        (r.time - filtered[0].time) / (maxTime - filtered[0].time || 1) *
          (width - padding * 2);
      const y =
        height - padding - (r.angle / maxAngle) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-[var(--border)] bg-background p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>Live sensor — angle (°)</span>
        <span className="text-brand">{filtered[filtered.length - 1].angle}°</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = height - padding - tick * (height - padding * 2);
          return (
            <line
              key={tick}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgba(148,163,184,0.15)"
              strokeWidth="1"
            />
          );
        })}
        <polyline
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}
