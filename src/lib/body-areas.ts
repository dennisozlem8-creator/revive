export type BodyArea = {
  id: string;
  label: string;
  description: string;
};

export const bodyAreas: BodyArea[] = [
  {
    id: "ankle",
    label: "Ankle",
    description: "Strengthen and restore ankle mobility.",
  },
  {
    id: "knee",
    label: "Knee",
    description: "Support knee stability and range of motion.",
  },
  {
    id: "lower-back",
    label: "Lower Back",
    description: "Ease tension and improve core support.",
  },
  {
    id: "wrist",
    label: "Wrist",
    description: "Rebuild wrist flexibility and control.",
  },
  {
    id: "other",
    label: "Other",
    description: "Explore exercises for additional areas.",
  },
];

export function getBodyArea(id: string) {
  return bodyAreas.find((area) => area.id === id);
}
