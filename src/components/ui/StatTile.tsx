type StatTileProps = {
  value: string | number;
  label: string;
  accent?: "brand" | "correct" | "orange" | "purple";
};

const accents = {
  brand: "border-brand/30 text-brand-light",
  correct: "border-correct/30 text-correct",
  orange: "border-orange/30 text-orange",
  purple: "border-purple/30 text-purple",
};

export function StatTile({ value, label, accent = "brand" }: StatTileProps) {
  return (
    <div className={`rm-card px-4 py-5 text-center ${accents[accent]} border`}>
      <p className="rm-stat text-foreground">{value}</p>
      <p className="rm-label mt-1">{label}</p>
    </div>
  );
}
