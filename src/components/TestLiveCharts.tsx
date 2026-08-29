type Series = {
  label: string;
  values: number[];
  unit?: string;
  max?: number;
};

function SparkBars({ values, max, color }: { values: number[]; max: number; color: string }) {
  return (
    <div className="flex h-24 items-end gap-0.5">
      {values.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{
            height: `${Math.max(6, Math.min(100, (value / max) * 100))}%`,
            background: color,
            opacity: 0.45 + (i / Math.max(1, values.length)) * 0.55,
          }}
        />
      ))}
    </div>
  );
}

export function TestLiveCharts({
  series,
}: {
  series: Series[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {series.map((item) => {
        const current = item.values[item.values.length - 1] ?? 0;
        const high = Math.max(item.max ?? 1, ...item.values, 1);
        return (
          <section key={item.label} className="rm-card p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="tabular-nums text-brand">
                {current}
                {item.unit ?? ""}
              </span>
            </div>
            <SparkBars values={item.values} max={high} color="var(--brand)" />
          </section>
        );
      })}
    </div>
  );
}

export function PeakBarChart({
  title,
  bars,
}: {
  title: string;
  bars: { label: string; value: number; goal?: number }[];
}) {
  const max = Math.max(1, ...bars.map((b) => Math.max(b.value, b.goal ?? 0)));
  return (
    <section className="rm-card p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-4 space-y-3">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>{bar.label}</span>
              <span className="tabular-nums text-foreground">{bar.value}°</span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.min(100, (bar.value / max) * 100)}%` }}
              />
              {bar.goal != null && (
                <span
                  className="absolute top-0 h-full w-0.5 bg-correct"
                  style={{ left: `${Math.min(100, (bar.goal / max) * 100)}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
