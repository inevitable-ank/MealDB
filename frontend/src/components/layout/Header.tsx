type HeaderProps = {
  onNavigate?: (section: 'search' | 'categories' | 'recipes' | 'details') => void
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-lg font-bold text-amber-950 shadow-[0_12px_24px_-16px_rgba(245,158,11,0.9)]">
            T
          </div>
          <div>
            <p className="font-display text-lg text-slate-900">TheMealDB Explorer</p>
            <p className="text-xs text-slate-500">Curated flavors, modern kitchen.</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <button
            className="transition hover:text-amber-700"
            onClick={() => onNavigate?.('search')}
            type="button"
          >
            Search
          </button>
          <button
            className="transition hover:text-amber-700"
            onClick={() => onNavigate?.('categories')}
            type="button"
          >
            Categories
          </button>
          <button
            className="transition hover:text-amber-700"
            onClick={() => onNavigate?.('recipes')}
            type="button"
          >
            Recipes
          </button>
          <button
            className="transition hover:text-amber-700"
            onClick={() => onNavigate?.('details')}
            type="button"
          >
            Details
          </button>
        </nav>
      </div>
    </header>
  )
}
