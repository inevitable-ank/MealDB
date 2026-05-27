import { useCallback, useEffect, useMemo, useState } from 'react'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import SectionHeading from '../components/ui/SectionHeading'
import CategoryGrid from '../features/categories/CategoryGrid'
import MealDetails from '../features/meals/MealDetails'
import MealCard from '../features/meals/MealCard'
import RandomHighlight from '../features/random/RandomHighlight'
import SearchBar from '../features/search/SearchBar'
import type { Category, MealDetails as MealDetailsType, MealSummary } from '../types/mealdb'
import {
  getCategories,
  getMealById,
  getRandomMeal,
  searchMeals,
} from '../services/api/mealdb'

export default function Home() {
  const [query, setQuery] = useState('chicken')
  const [categories, setCategories] = useState<Category[]>([])
  const [meals, setMeals] = useState<MealSummary[]>([])
  const [randomMeal, setRandomMeal] = useState<MealDetailsType | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<MealDetailsType | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRandomMeal = useCallback(async () => {
    try {
      const data = await getRandomMeal()
      setRandomMeal(data)
    } catch {
      setError('Unable to load a random meal right now.')
    }
  }, [])

  const loadSearch = useCallback(
    async (showLoading = true) => {
      const term = query.trim() || 'chicken'
      if (showLoading) {
        setIsSearching(true)
      }
      setError(null)
      try {
        const data = await searchMeals(term)
        setMeals(data)
        if (data.length > 0) {
          const details = await getMealById(data[0].id)
          setSelectedMeal(details)
        }
      } catch (err) {
        setError('Unable to load recipes right now. Please try again.')
      } finally {
        if (showLoading) {
          setIsSearching(false)
        }
      }
    },
    [query],
  )

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [categoryData, randomData, searchData] = await Promise.all([
          getCategories(),
          getRandomMeal(),
          searchMeals('chicken'),
        ])
        setCategories(categoryData)
        setRandomMeal(randomData)
        setMeals(searchData)
        if (searchData.length > 0) {
          const details = await getMealById(searchData[0].id)
          setSelectedMeal(details)
        }
      } catch {
        setError('Unable to load recipes right now. Please try again.')
      } finally {
        setIsInitialLoading(false)
      }
    }
    void loadInitial()
  }, [])

  useEffect(() => {
    if (!selectedMeal && randomMeal) {
      setSelectedMeal(randomMeal)
    }
  }, [randomMeal, selectedMeal])

  const handleShuffle = async () => {
    await loadRandomMeal()
  }

  const handleSelectMeal = async (id: string) => {
    try {
      const details = await getMealById(id)
      setSelectedMeal(details)
    } catch {
      setError('Unable to load meal details right now.')
    }
  }

  const highlightMeal = useMemo(() => {
    return randomMeal ?? selectedMeal
  }, [randomMeal, selectedMeal])

  return (
    <div className="grain">
      <Header />

      <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-16 px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-900">
                New season collection
              </span>
              <span className="rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                Powered by TheMealDB
              </span>
            </div>
            <h1 className="font-display text-4xl text-slate-900 md:text-6xl">
              Cook boldly with curated recipes, crafted for modern kitchens.
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              Search meals, explore categories, and unlock detailed recipe cards
              designed for clarity, speed, and flavor.
            </p>
            <div id="search">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSearch={() => loadSearch(true)}
                isLoading={isSearching}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: '2.8k', text: 'Recipes curated' },
                { label: '120+', text: 'Global cuisines' },
                { label: '15 min', text: 'Avg prep time' },
              ].map((stat) => (
                <div
                  key={stat.text}
                  className="rounded-3xl border border-white/60 bg-white/70 p-4 text-center shadow-[0_20px_40px_-32px_rgba(15,23,42,0.5)]"
                >
                  <p className="text-2xl font-semibold text-slate-900">{stat.label}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {stat.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
            <div className="grid gap-6">
            <div className="glass-card rounded-4xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                Chef spotlight
              </p>
              {highlightMeal ? (
                <>
                  <h2 className="font-display text-3xl text-slate-900">
                    {highlightMeal.name}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {highlightMeal.instructions}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {highlightMeal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  {isInitialLoading ? 'Loading spotlight recipe...' : 'No spotlight available.'}
                </p>
              )}
            </div>
            <div className="overflow-hidden rounded-4xl shadow-[0_30px_60px_-36px_rgba(15,23,42,0.6)]">
              {highlightMeal ? (
                <img
                  className="h-full w-full object-cover"
                  src={highlightMeal.thumbnail}
                  alt={highlightMeal.name}
                />
              ) : null}
            </div>
          </div>
        </section>

        <section id="categories" className="space-y-8">
          <SectionHeading
            title="Browse by mood, cuisine, or craving"
            subtitle="Categories"
          />
          <CategoryGrid categories={categories} />
        </section>

        <section id="recipes" className="space-y-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              title="Recipes tailored to your search"
              subtitle="Featured meals"
            />
            <p className="text-sm text-slate-500">
              Showing {meals.length} results
            </p>
          </div>
          {error ? (
            <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">
              {error}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onSelect={handleSelectMeal} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <SectionHeading title="Pick something surprising" subtitle="Random meal" />
          {highlightMeal ? (
            <RandomHighlight meal={highlightMeal} onShuffle={handleShuffle} />
          ) : (
            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 text-sm text-slate-500">
              Loading a random meal...
            </div>
          )}
        </section>

        <section id="details" className="space-y-6">
          <SectionHeading title="Detailed recipe preview" subtitle="Recipe details" />
          {selectedMeal ? (
            <MealDetails meal={selectedMeal} />
          ) : (
            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 text-sm text-slate-500">
              Select a meal to see the details.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
