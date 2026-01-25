"use client";

import { useFavorites } from "@/utils/favorites";

type FavoriteButtonProps = {
  workId: string;
  size: "sm" | "md";
  stopNavigation?: boolean;
  className?: string;
};

export default function FavoriteButton({
  workId,
  size,
  stopNavigation,
  className
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(workId);

  const sizeClass = size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";

  return (
    <button
      type="button"
      aria-pressed={active}
      title={active ? "Убрать из избранного" : "В избранное"}
      className={`${sizeClass} ${className ?? ""} flex items-center justify-center rounded-full border border-ink-600 bg-ink-900/80 text-accent-400 transition hover:border-accent-400 hover:text-parchment-100`}
      onClick={(event) => {
        if (stopNavigation) {
          event.preventDefault();
          event.stopPropagation();
        }
        toggleFavorite(workId);
      }}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
