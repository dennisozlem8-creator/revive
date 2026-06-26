const bodyAreas = [
  {
    id: "ankle",
    label: "Ankle",
    description: "Strengthen and restore ankle mobility.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 20V12l2-4h4l2 4v8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 8V5a2 2 0 0 1 4 0v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "knee",
    label: "Knee",
    description: "Support knee stability and range of motion.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 18c2-6 4-9 6-9s4 3 6 9" strokeLinecap="round" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    id: "lower-back",
    label: "Lower Back",
    description: "Ease tension and improve core support.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18M9 6h6M8 12h8M9 18h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "wrist",
    label: "Wrist",
    description: "Rebuild wrist flexibility and control.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 14V8a2 2 0 0 1 4 0v6" strokeLinecap="round" />
        <path d="M12 8V6M14 10h4M14 14h3M14 18h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    description: "Explore exercises for additional areas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3" />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.1),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent-soft/60 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white shadow-[0_8px_24px_var(--shadow)]">
            RM
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Revive Motion
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 pb-24">
        <section className="animate-fade-up mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            Recovery & Mobility
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Move better, feel stronger
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Select a body area to begin guided exercises and restore comfortable
            movement at your own pace.
          </p>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {bodyAreas.map((area, index) => (
            <button
              key={area.id}
              type="button"
              style={{ animationDelay: `${index * 80}ms` }}
              className="animate-fade-up group flex flex-col rounded-2xl border border-[var(--border)] bg-surface p-6 text-left shadow-[0_4px_24px_var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_12px_40px_rgba(37,99,235,0.15)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                {area.icon}
              </div>
              <h2 className="mt-5 text-lg font-semibold text-foreground">{area.label}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{area.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Start exercises
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}
