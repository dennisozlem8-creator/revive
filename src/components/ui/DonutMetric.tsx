type DonutMetricProps = {
  label: string;
  value: number;
  display: string;
  color?: string;
};

export function DonutMetric({
  label,
  value,
  display,
  color = "var(--brand)",
}: DonutMetricProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="rm-card flex flex-col items-center px-4 py-5">
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.08) 0)`,
        }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-sm font-bold">
          {display}
        </div>
      </div>
      <p className="rm-label mt-3">{label}</p>
    </div>
  );
}
