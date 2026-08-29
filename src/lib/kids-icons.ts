export const KIDS_ICON_SRC = {
  gamepad: "/kids/icons/kids-icon-gamepad.webp",
  star: "/kids/icons/kids-icon-star.webp",
  sparkle: "/kids/icons/kids-icon-sparkle.webp",
  fire: "/kids/icons/kids-icon-fire.webp",
  target: "/kids/icons/kids-icon-target.webp",
  map: "/kids/icons/kids-icon-map.webp",
  rocket: "/kids/icons/kids-icon-rocket.webp",
  trophy: "/kids/icons/kids-icon-trophy.webp",
  hero: "/kids/icons/kids-icon-hero.webp",
  bolt: "/kids/icons/kids-icon-bolt.webp",
  crown: "/kids/icons/kids-icon-crown.webp",
  foot: "/kids/icons/kids-icon-foot.webp",
  knee: "/kids/icons/kids-icon-knee.webp",
  wave: "/kids/icons/kids-icon-wave.webp",
  hand: "/kids/icons/kids-icon-hand.webp",
  check: "/kids/icons/kids-icon-check.webp",
  mystery: "/kids/icons/kids-icon-mystery.webp",
  party: "/kids/icons/kids-icon-party.webp",
  heart: "/kids/icons/kids-icon-heart.webp",
} as const;

export type KidsIconName = keyof typeof KIDS_ICON_SRC;
