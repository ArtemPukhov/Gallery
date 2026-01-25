type FavoritesToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  count: number;
};

export default function FavoritesToggle({
  enabled,
  onToggle,
  disabled,
  count
}: FavoritesToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`col-span-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
        enabled
          ? "border-accent-400/70 bg-ink-900/80 text-parchment-100"
          : "border-ink-600 bg-ink-900/40 text-parchment-200/70"
      } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-accent-400/60"}`}
    >
      <span>Только избранное</span>
      <span className="text-xs">{count}</span>
    </button>
  );
}
