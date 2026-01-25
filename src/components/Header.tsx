import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-ink-700/80 bg-ink-900/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-semibold text-parchment-100">
          Передвижники
        </Link>
        <nav className="flex items-center gap-4 text-sm text-parchment-200/80">
          <Link href="/" className="hover:text-parchment-100">
            Все художники
          </Link>
          <Link href="/artists" className="hover:text-parchment-100">
            Художники
          </Link>
        </nav>
      </div>
    </header>
  );
}
