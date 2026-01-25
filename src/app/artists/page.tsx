import type { Metadata } from "next";
import Link from "next/link";
import { artists } from "@/data/artists";

export const metadata: Metadata = {
  title: "Все художники — Передвижники",
  description: "Список художников-передвижников с краткими описаниями."
};

export default function ArtistsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-parchment-100">Все художники</h1>
        <p className="text-parchment-200/80">
          Выберите художника, чтобы перейти к его биографии и работам.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <Link
            key={artist.slug}
            href={`/artists/${artist.slug}`}
            className="rounded-2xl border border-ink-600 bg-ink-800/70 p-5 shadow-soft transition hover:-translate-y-1 hover:border-accent-400/60"
          >
            <h2 className="text-xl font-semibold text-parchment-100">{artist.name}</h2>
            <p className="mt-2 text-sm text-parchment-200/80">{artist.bio}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
