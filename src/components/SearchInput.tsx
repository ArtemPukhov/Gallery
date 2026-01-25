type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-parchment-200/70">
        Поиск по названию
      </label>
      <input
        className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-parchment-100"
        placeholder="Например, «Бурлаки»"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
