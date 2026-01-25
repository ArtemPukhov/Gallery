"use client";

import { useMemo, useState } from "react";
import { artists } from "@/data/artists";
import GalleryGrid from "@/components/GalleryGrid";
import WorkCard from "@/components/WorkCard";
import ArtistSelect from "@/components/ArtistSelect";
import SearchInput from "@/components/SearchInput";
import TagFilter from "@/components/TagFilter";
import FavoritesToggle from "@/components/FavoritesToggle";
import { getAllWorks } from "@/utils/data";
import { useFavorites } from "@/utils/favorites";

export default function HomePage() {
  const allWorks = useMemo(() => getAllWorks(), []);
  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favorites, isReady } = useFavorites();

  const tags = useMemo(() => {
    const set = new Set<string>();
    allWorks.forEach((work) => work.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [allWorks]);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const filteredWorks = allWorks.filter((work) => {
    const matchesArtist = selectedArtist === "all" || work.artistSlug === selectedArtist;
    const matchesQuery =
      query.trim().length === 0 ||
      work.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesTag = tag === "all" || work.tags?.includes(tag);
    const matchesFavorite = !favoritesOnly || favoriteSet.has(work.id);
    return matchesArtist && matchesQuery && matchesTag && matchesFavorite;
  });

  const emptyMessage = favoritesOnly
    ? "В избранном пока нет работ."
    : "Нет работ по выбранным фильтрам. Попробуйте сбросить фильтры.";

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-parchment-100">
          Галерея «Передвижники»
        </h1>
        <p className="max-w-2xl text-parchment-200/80">
          Исследуйте ключевые работы товарищества передвижников. Выберите художника,
          отфильтруйте по теме и откройте полное описание каждой картины.
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-ink-600 bg-ink-800/70 p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
        <ArtistSelect
          artists={artists}
          value={selectedArtist}
          onChange={setSelectedArtist}
          onReset={() => setSelectedArtist("all")}
        />
        <SearchInput value={query} onChange={setQuery} />
        <TagFilter tags={tags} value={tag} onChange={setTag} />
        <FavoritesToggle
          enabled={favoritesOnly}
          onToggle={() => setFavoritesOnly((prev) => !prev)}
          disabled={!isReady}
          count={favorites.length}
        />
      </div>

      {filteredWorks.length === 0 ? (
        <div className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6 text-center text-parchment-200/70">
          {emptyMessage}
        </div>
      ) : (
        <GalleryGrid>
          {filteredWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </GalleryGrid>
      )}
    </section>
  );
}
