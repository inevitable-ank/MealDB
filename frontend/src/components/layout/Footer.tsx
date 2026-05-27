export default function Footer() {
  return (
    <footer className="border-t border-amber-100/60 bg-white/70">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl text-slate-900">TheMealDB Explorer</p>
          <p className="text-sm text-slate-500">
            Discover recipes, learn flavors, and cook with confidence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <a className="transition hover:text-amber-700" href="#">
            Privacy
          </a>
          <a className="transition hover:text-amber-700" href="#">
            Terms
          </a>
          <a className="transition hover:text-amber-700" href="#">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
