import type { CSSProperties } from "react";

type SafePictureProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

export function SafePicture({ src, alt, className, width, height, style }: SafePictureProps) {
  return (
    // Native img. next/image is named Image and crashes React 19 in this app.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} width={width} height={height} style={style} />
  );
}
