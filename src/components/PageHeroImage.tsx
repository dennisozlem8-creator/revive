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
  height = 160,
}: PageHeroImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-surface-elevated ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="w-full object-cover"
        style={{ height }}
        priority
      />
    </div>
  );
}
