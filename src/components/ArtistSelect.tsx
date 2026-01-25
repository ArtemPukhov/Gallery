type ArtistSelectProps = {
  artists: { slug: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

export default function ArtistSelect({
  artists,
  value,
  onChange,
  onReset
}: ArtistSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-parchment-200/70">
        Художник
      </label>
      <div className="flex gap-2">
        <select
          className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-parchment-100"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="all">Все художники</option>
          {artists.map((artist) => (
            <option key={artist.slug} value={artist.slug}>
              {artist.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-accent-400/40 px-3 py-2 text-xs text-accent-400 transition hover:border-accent-400 hover:text-parchment-100"
        >
          Все
        </button>
      </div>
    </div>
  );
}
