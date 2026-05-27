import type { MealSummary } from '../../types/mealdb'

type MealCardProps = {
  meal: MealSummary
  onSelect?: (id: string) => void
}

export default function MealCard({ meal, onSelect }: MealCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.6)]">
      <div className="relative h-44 overflow-hidden">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={meal.thumbnail}
          alt={meal.name}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-slate-900/0" />
        {meal.category ? (
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
            {meal.category}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{meal.name}</h3>
          <p className="text-sm text-slate-500">
            {meal.area ? `${meal.area} • ` : ''}
            {meal.tags.length > 0 ? `${meal.tags.length} tags` : 'Curated pick'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {meal.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          className="mt-auto text-left text-sm font-semibold text-amber-700 transition hover:text-amber-600"
          onClick={() => onSelect?.(meal.id)}
        >
          View recipe details
        </button>
      </div>
    </article>
  )
}
