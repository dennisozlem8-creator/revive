import type { CopyKey } from "@/lib/i18n";
import type { MeasureMethod, PTPrescription } from "@/lib/users";

export type { MeasureMethod };

export const MEASURE_METHODS: MeasureMethod[] = ["camera", "motion", "muscle"];

export function prescribedMethod(prescription?: PTPrescription | null): MeasureMethod {
  const method = prescription?.method;
  if (method === "camera" || method === "motion" || method === "muscle") return method;
  return "camera";
}

export const methodHref: Record<MeasureMethod, string> = {
  camera: "/goniometer",
  motion: "/motion",
  muscle: "/muscle",
};

export const methodImage: Record<MeasureMethod, string> = {
  camera: "/images/landing-photo-goniometer.png?v=2",
  motion: "/images/landing-mpu.png?v=8",
  muscle: "/images/landing-myoware.png?v=6",
};

export const methodTitleKey: Record<MeasureMethod, CopyKey> = {
  camera: "wayPhotoTitle",
  motion: "wayMotionTitle",
  muscle: "wayMuscleTitle",
};

export const methodTextKey: Record<MeasureMethod, CopyKey> = {
  camera: "methodCameraText",
  motion: "methodMotionText",
  muscle: "methodMuscleText",
};
