"use client";

import Link from "next/link";
import type { Work } from "@/types";
import FavoriteButton from "@/components/FavoriteButton";
import WorkImage from "@/components/WorkImage";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <Link
      href={`/works/${work.id}`}
      className="group relative rounded-2xl border border-ink-600 bg-ink-800/70 p-4 shadow-soft transition hover:-translate-y-1 hover:border-accent-400/60"
    >
      <FavoriteButton
        workId={work.id}
        size="sm"
        stopNavigation
        className="absolute right-4 top-4 z-10"
      />
      <div className="aspect-[4/3] overflow-hidden rounded-xl border border-ink-600 bg-ink-700/40">
        <WorkImage
          src={work.imageUrl}
          alt={work.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-2">
        <div>
          <h3 className="text-lg font-semibold text-parchment-100">{work.title}</h3>
          {work.year && <p className="text-xs text-parchment-200/70">{work.year}</p>}
        </div>
        <p className="text-sm text-parchment-200/80 max-h-24 overflow-hidden">
          {work.description}
        </p>
      </div>
    </Link>
  );
}
