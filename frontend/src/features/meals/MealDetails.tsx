import type { MealDetails as MealDetailsType } from '../../types/mealdb'

type MealDetailsProps = {
  meal: MealDetailsType
}

export default function MealDetails({ meal }: MealDetailsProps) {
  return (
    <section className="grid gap-6 rounded-3xl bg-white/80 p-6 shadow-[0_30px_60px_-36px_rgba(15,23,42,0.6)] lg:grid-cols-[1fr_0.8fr]">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Recipe details
          </p>
          <h3 className="font-display text-3xl text-slate-900">{meal.name}</h3>
          <p className="text-sm text-slate-500">
            {[meal.area, meal.category]
              .filter((value): value is string => Boolean(value))
              .join(' • ') || 'Global'}
          </p>
        </div>
        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          {meal.ingredients.map((ingredient) => (
            <div key={ingredient.name} className="flex items-center justify-between">
              <span>{ingredient.name}</span>
              <span className="font-semibold text-slate-900">{ingredient.measure}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600">{meal.instructions}</p>
      </div>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl">
          <img
            className="h-56 w-full object-cover"
            src={meal.thumbnail}
            alt={meal.name}
          />
        </div>
        {meal.youtubeId ? (
          <div className="aspect-video overflow-hidden rounded-3xl">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${meal.youtubeId}`}
              title={`${meal.name} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
