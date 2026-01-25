import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorks, getWorkById, getArtistByWorkId } from "@/utils/data";
import WorkImage from "@/components/WorkImage";
import FavoriteButton from "@/components/FavoriteButton";

type PageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return getAllWorks().map((work) => ({ id: work.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const work = getWorkById(params.id);
  if (!work) {
    return { title: "Работа не найдена" };
  }
  return {
    title: `${work.title} — Передвижники`,
    description: work.description.slice(0, 140)
  };
}

export default function WorkPage({ params }: PageProps) {
  const work = getWorkById(params.id);
  if (!work) {
    notFound();
  }
  const artist = getArtistByWorkId(params.id);

  return (
    <section className="space-y-6">
      <Link
        href={artist ? `/artists/${artist.slug}` : "/"}
        className="inline-flex items-center gap-2 text-sm text-parchment-200/70 hover:text-parchment-100"
      >
        ← Назад
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-ink-600 bg-ink-800/60 p-4 shadow-soft">
          <WorkImage
            src={work.imageUrl}
            alt={work.title}
            className="h-auto w-full rounded-xl object-cover"
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-ink-600 bg-ink-800/60 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-parchment-100">{work.title}</h1>
              {work.year && <p className="text-sm text-parchment-200/70">{work.year}</p>}
              {artist && (
                <p className="mt-1 text-sm text-parchment-200/80">{artist.name}</p>
              )}
            </div>
            <FavoriteButton workId={work.id} size="md" />
          </div>

          <p className="text-parchment-200/90">{work.description}</p>

          {work.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent-400/50 px-3 py-1 text-xs text-accent-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
