export function SectionKicker({
  children,
  tone = "light",
}: {
  children: string;
  tone?: "light" | "dark";
}) {
  const palette =
    tone === "dark"
      ? "bg-white/12 text-white ring-white/25"
      : "bg-[#e8f3fb] text-[#1b3348] ring-[#4f90c6]/30";

  return (
    <p
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] shadow-[0_8px_18px_rgba(27,51,72,0.06)] ring-1 sm:px-5 sm:py-2 sm:text-base ${palette}`}
    >
      {children}
    </p>
  );
}
