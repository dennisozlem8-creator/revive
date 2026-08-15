import type { RomTest } from "@/lib/assessments";
import { getRomPercent } from "@/lib/assessments";

type RomChartProps = {
  tests: RomTest[];
  values: Record<string, number>;
  areaId: string;
};

export function RomChart({ tests, values, areaId }: RomChartProps) {
  return (
    <div className="space-y-5">
      {tests.map((test) => {
        const value = values[test.id] ?? 0;
        const percent = getRomPercent(test, value, areaId);
        const isKneeExtension = test.id === "extension" && areaId === "knee";
        const status =
          isKneeExtension
            ? value <= test.normalMax
              ? "Normal"
              : "Limited"
            : value >= test.normalMin
              ? "Normal"
              : "Limited";

        return (
          <div key={test.id}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{test.name}</span>
              <span className="text-muted">
                {value}° ·{" "}
                <span
                  className={
                    status === "Normal" ? "text-emerald-400" : "text-amber-400"
                  }
                >
                  {status}
                </span>
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-background">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
              {!isKneeExtension && (
                <div
                  className="absolute inset-y-0 w-0.5 bg-emerald-400/70"
                  style={{
                    left: `${Math.min(100, (test.normalMin / test.normalMax) * 100)}%`,
                  }}
                  title="Normal range start"
                />
              )}
            </div>
            <p className="mt-1 text-xs text-muted">
              Normal:{" "}
              {isKneeExtension
                ? `0–${test.normalMax}°`
                : `${test.normalMin}–${test.normalMax}°`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
