type TagFilterProps = {
  tags: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function TagFilter({ tags, value, onChange }: TagFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-parchment-200/70">
        Теги
      </label>
      <select
        className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-parchment-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">Все темы</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
