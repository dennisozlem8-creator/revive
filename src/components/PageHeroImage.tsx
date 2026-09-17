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
      {/* Native img: next/image named Image crashes React 19 on this app. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${src}${src.includes("?") ? "&" : "?"}v=clinic`}
        alt={alt}
        width={800}
        height={400}
        className="w-full object-cover"
        style={{ height }}
      />
    </div>
  );
}
