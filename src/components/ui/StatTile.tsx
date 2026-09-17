type StatTileProps = {
  value: string | number;
  label: string;
  accent?: "brand" | "correct" | "orange" | "purple";
};

export function StatTile({ value, label }: StatTileProps) {
  return (
    <article className="rounded-[1.35rem] bg-white p-5 text-center shadow-[0_12px_28px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12">
      <p className="rm-serif text-3xl font-semibold tabular-nums text-[#1b3348]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[#2f4a60]">{label}</p>
    </article>
  );
}
