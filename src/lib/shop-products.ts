export type ShopProduct = {
  id: string;
  name: string;
  category: "ankle" | "knee" | "lower-back" | "elbow";
  price: number;
  description: string;
  image: string;
  features: string[];
};

export const shopProducts: ShopProduct[] = [
  {
    id: "ankle-brace-pro",
    name: "Ankle Stability Brace Pro",
    category: "ankle",
    price: 49,
    description: "Lightweight support for sprains and post-surgery ankle recovery.",
    image: "/shop/ankle-brace.png",
    features: ["360° strap system", "ROM-friendly hinge", "Machine washable"],
  },
  {
    id: "knee-hinge-brace",
    name: "Knee Hinge Recovery Brace",
    category: "knee",
    price: 79,
    description: "Adjustable hinge limits unsafe flexion while you rebuild strength.",
    image: "/shop/knee-brace.png",
    features: ["Dual hinges", "Patella opening", "Works with Revive sensor"],
  },
  {
    id: "lumbar-support",
    name: "Lower Back Lumbar Support",
    category: "lower-back",
    price: 59,
    description: "Breathable lumbar brace for desk workers and spine rehab.",
    image: "/shop/lower-back-brace.png",
    features: ["Contoured panels", "Posture cues", "All-day comfort"],
  },
  {
    id: "elbow-tennis-brace",
    name: "Elbow Compression Brace",
    category: "elbow",
    price: 39,
    description: "Targeted compression for tennis elbow and repetitive strain.",
    image: "/shop/elbow-brace.png",
    features: ["Adjustable strap", "Gel pad", "Left or right arm"],
  },
];
