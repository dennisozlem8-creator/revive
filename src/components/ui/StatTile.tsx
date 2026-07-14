type StatTileProps = {
  value: string | number;
  label: string;
  accent?: "brand" | "correct" | "orange" | "purple" | "teal";
  variant?: "patient" | "caregiver" | "doctor";
};

const accentText = {
  brand: "text-brand-light",
  correct: "text-correct",
  orange: "text-orange",
  purple: "text-purple",
  teal: "text-teal",
};

export function StatTile({
  value,
  label,
  accent = "brand",
  variant = "patient",
}: StatTileProps) {
  const isProvider = variant === "caregiver" || variant === "doctor";

  return (
    <div
      className={
        isProvider
          ? `rm-panel px-3 py-4 text-center sm:px-4 sm:py-5 ${variant === "caregiver" ? "rm-panel--caregiver" : ""}`
          : "rm-card px-3 py-4 text-center sm:px-4 sm:py-5"
      }
    >
      <p className={`text-xl font-semibold sm:text-2xl ${isProvider ? accentText[accent] : "text-foreground"}`}>
        {value}
      </p>
      <p
        className={`mt-1 text-[0.625rem] font-semibold uppercase tracking-wider sm:text-xs ${
          variant === "caregiver"
            ? "text-[var(--caregiver-muted)]"
            : variant === "doctor"
              ? "text-[var(--doctor-muted)]"
              : "rm-label"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
