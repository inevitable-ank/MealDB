import Button from '../../components/ui/Button'
import type { MealDetails } from '../../types/mealdb'

type RandomHighlightProps = {
  meal: MealDetails
  onShuffle: () => void
  onSave?: (meal: MealDetails) => void
}

export default function RandomHighlight({ meal, onShuffle, onSave }: RandomHighlightProps) {
  return (
    <section className="grid gap-6 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_30px_60px_-36px_rgba(15,23,42,0.6)] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
          Feeling hungry?
        </p>
        <h3 className="font-display text-3xl text-slate-900">
          {meal.name}
        </h3>
        <p className="text-sm text-slate-600">
          {meal.instructions}
        </p>
        {(meal.minutes || meal.servings || meal.calories) && (
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            {meal.minutes ? <span>{meal.minutes} min</span> : null}
            {meal.servings ? <span>{meal.servings} servings</span> : null}
            {meal.calories ? <span>{meal.calories} cal</span> : null}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button onClick={onShuffle}>I am feeling hungry</Button>
          <Button variant="ghost" onClick={() => onSave?.(meal)}>
            Save recipe
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl">
        <img
          className="h-full w-full object-cover"
          src={meal.thumbnail}
          alt={meal.name}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-slate-900/0" />
      </div>
    </section>
  )
}
