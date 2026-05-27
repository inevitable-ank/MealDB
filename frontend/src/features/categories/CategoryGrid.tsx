import type { Category } from '../../types/mealdb'

type CategoryGridProps = {
  categories: Category[]
  onSelect?: (category: Category) => void
}

const colorClasses = [
  'bg-amber-100 text-amber-900',
  'bg-emerald-100 text-emerald-900',
  'bg-cyan-100 text-cyan-900',
  'bg-rose-100 text-rose-900',
  'bg-lime-100 text-lime-900',
  'bg-purple-100 text-purple-900',
]

export default function CategoryGrid({ categories, onSelect }: CategoryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <article
          key={category.id}
          className="glass-card flex flex-col gap-4 rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.5)]"
        >
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-2xl object-cover"
              src={category.thumbnail}
              alt={category.name}
              loading="lazy"
            />
            <span
              className={`w-fit rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${colorClasses[index % colorClasses.length]}`}
            >
              {category.name}
            </span>
          </div>
          <p className="text-sm text-slate-600">{category.description}</p>
          <button
            className="text-left text-sm font-semibold text-amber-700 transition hover:text-amber-600"
            onClick={() => onSelect?.(category)}
          >
            Explore category
          </button>
        </article>
      ))}
    </div>
  )
}
