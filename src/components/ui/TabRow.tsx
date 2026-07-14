"use client";

type TabRowProps<T extends string> = {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
};

export function TabRow<T extends string>({ tabs, active, onChange }: TabRowProps<T>) {
  return (
    <div className="flex gap-2 rounded-full border border-[var(--border)] bg-surface p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            active === tab.id
              ? "bg-brand text-white shadow-md"
              : "text-muted hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
