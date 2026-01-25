import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { artists } from "@/data/artists";
import GalleryGrid from "@/components/GalleryGrid";
import WorkCard from "@/components/WorkCard";
import { getWorksByArtistSlug } from "@/utils/data";

type PageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const artist = artists.find((item) => item.slug === params.slug);
  if (!artist) {
    return { title: "Художник не найден" };
  }
  return {
    title: `${artist.name} — Передвижники`,
    description: artist.bio
  };
}

export default function ArtistPage({ params }: PageProps) {
  const artist = artists.find((item) => item.slug === params.slug);
  if (!artist) {
    notFound();
  }

  const works = getWorksByArtistSlug(params.slug);

  return (
    <section className="space-y-6">
      <Link
        href="/artists"
        className="inline-flex items-center gap-2 text-sm text-parchment-200/70 hover:text-parchment-100"
      >
        ← Назад к списку
      </Link>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-parchment-100">{artist.name}</h1>
        <p className="text-parchment-200/80">{artist.bio}</p>
      </header>

      <GalleryGrid>
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </GalleryGrid>
    </section>
  );
}
