import Image from "next/image";

type PageHeroImageProps = {
  src: string;
  alt: string;
  className?: string;
  height?: number;
};

export function PageHeroImage({
  src,
  alt,
  className = "",
  height = 120,
}: PageHeroImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[var(--border)] bg-surface-elevated/50 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="w-full object-cover opacity-90"
        style={{ height }}
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)]/40 to-transparent" />
    </div>
  );
}
