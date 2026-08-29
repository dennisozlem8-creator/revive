import Image from "next/image";
import type { ReactNode } from "react";
import { KIDS_ICON_SRC, type KidsIconName } from "@/lib/kids-icons";

type KidsIconProps = {
  name: KidsIconName;
  size?: number;
  className?: string;
  alt?: string;
};

export function KidsIcon({ name, size = 28, className = "", alt = "" }: KidsIconProps) {
  return (
    <Image
      src={KIDS_ICON_SRC[name]}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain ${className}`}
    />
  );
}

export function KidsIconTitle({
  icon,
  children,
  size = 32,
  className = "",
}: {
  icon: KidsIconName;
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <KidsIcon name={icon} size={size} />
      <span>{children}</span>
    </span>
  );
}
