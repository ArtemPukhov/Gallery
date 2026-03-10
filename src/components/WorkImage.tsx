"use client";

import { useState } from "react";

type WorkImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function WorkImage({ src, alt, className }: WorkImageProps) {
  const [hasError, setHasError] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const resolvedSrc = src.startsWith("/images/") ? `${basePath}${src}` : src;

  if (hasError) {
    return (
      <div className={`flex h-full w-full items-center justify-center text-xs text-parchment-200/60 ${className ?? ""}`}>
        Изображение недоступно
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
