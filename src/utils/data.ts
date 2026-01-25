import { artists } from "@/data/artists";
import type { Work, Artist } from "@/types";

export function getAllWorks(): Work[] {
  return artists.flatMap((artist) =>
    artist.works.map((work) => ({
      ...work,
      artistSlug: artist.slug
    }))
  );
}

export function getWorksByArtistSlug(slug: string): Work[] {
  const artist = artists.find((item) => item.slug === slug);
  if (!artist) return [];
  return artist.works.map((work) => ({ ...work, artistSlug: artist.slug }));
}

export function getWorkById(id: string): Work | null {
  const artist = artists.find((item) => item.works.some((work) => work.id === id));
  if (!artist) return null;
  const work = artist.works.find((item) => item.id === id);
  if (!work) return null;
  return { ...work, artistSlug: artist.slug };
}

export function getArtistByWorkId(id: string): Artist | null {
  return artists.find((item) => item.works.some((work) => work.id === id)) ?? null;
}
