type Step = {
  id: string;
  label: string;
};

type StepProgressProps = {
  steps: Step[];
  current: string;
  variant?: "patient" | "caregiver";
};

export function StepProgress({ steps, current, variant = "patient" }: StepProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === current);
  const isCaregiver = variant === "caregiver";

  return (
    <div className="rm-step-progress" role="list" aria-label="Session progress">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = step.id === current;
        return (
          <div
            key={step.id}
            role="listitem"
            className={`rm-step ${done ? "rm-step--done" : ""} ${active ? "rm-step--active" : ""} ${
              isCaregiver ? "rm-step--caregiver" : ""
            }`}
          >
            <span className="rm-step-dot">{done ? "✓" : i + 1}</span>
            <span className="rm-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
