export function SectionKicker({
  children,
  tone = "light",
}: {
  children: string;
  tone?: "light" | "dark";
}) {
  const palette =
    tone === "dark"
      ? "bg-white text-[#1b3348] shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
      : "bg-[#1b3348] text-white shadow-[0_12px_28px_rgba(27,51,72,0.22)]";
  const dot = tone === "dark" ? "bg-[#4f90c6]" : "bg-[#7eb3d9]";

  return (
    <p
      className={`inline-flex w-fit max-w-full self-start items-center gap-2.5 rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase leading-none tracking-[0.2em] sm:px-5 sm:py-2.5 sm:text-[0.8rem] ${palette}`}
    >
      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="min-w-0">{children}</span>
    </p>
  );
}
