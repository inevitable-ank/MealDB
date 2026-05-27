import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  getMealsByCategory,
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
  const [toast, setToast] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const categoriesRef = useRef<HTMLElement | null>(null)
  const recipesRef = useRef<HTMLElement | null>(null)
  const detailsRef = useRef<HTMLElement | null>(null)

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
        recipesRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  useEffect(() => {
    if (!selectedMeal && randomMeal) {
      setSelectedMeal(randomMeal)
    }
  }, [randomMeal, selectedMeal])

  const handleShuffle = async () => {
    try {
      const data = await getRandomMeal()
      setRandomMeal(data)
      setSelectedMeal(data)
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch {
      setError('Unable to load a random meal right now.')
    }
  }

  const handleSelectMeal = async (id: string) => {
    try {
      const details = await getMealById(id)
      setSelectedMeal(details)
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch {
      setError('Unable to load meal details right now.')
    }
  }

  const handleCategorySelect = async (category: Category) => {
    try {
      const data = await getMealsByCategory(category.name)
      setMeals(data)
      setQuery(category.name)
      recipesRef.current?.scrollIntoView({ behavior: 'smooth' })
      if (data.length > 0) {
        const details = await getMealById(data[0].id)
        setSelectedMeal(details)
      }
      showToast(`Showing ${category.name} recipes`)
    } catch {
      setError('Unable to load category meals right now.')
    }
  }

  const handleAdvancedFilters = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' })
    showToast('Pick a category to filter results')
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  const handleNav = (section: 'search' | 'categories' | 'recipes' | 'details') => {
    const sectionMap = {
      search: searchRef.current,
      categories: categoriesRef.current,
      recipes: recipesRef.current,
      details: detailsRef.current,
    }
    const target = sectionMap[section]
    if (!target) {
      return
    }
    const headerOffset = 96
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const handleSaveMeal = (meal: MealDetailsType) => {
    const key = 'mealdb:favorites'
    const stored = localStorage.getItem(key)
    const favorites = stored ? (JSON.parse(stored) as MealDetailsType[]) : []
    const exists = favorites.some((item) => item.id === meal.id)
    if (!exists) {
      favorites.push(meal)
      localStorage.setItem(key, JSON.stringify(favorites))
      showToast('Saved to favorites')
    } else {
      showToast('Already in favorites')
    }
  }

  const highlightMeal = useMemo(() => {
    return randomMeal ?? selectedMeal
  }, [randomMeal, selectedMeal])

  const spotlightText = useMemo(() => {
    if (!highlightMeal?.instructions) {
      return ''
    }
    const limit = 220
    if (highlightMeal.instructions.length <= limit) {
      return highlightMeal.instructions
    }
    const trimmed = highlightMeal.instructions.slice(0, limit)
    const lastSpace = trimmed.lastIndexOf(' ')
    const safeCut = lastSpace > 0 ? lastSpace : limit
    return `${trimmed.slice(0, safeCut)}...`
  }, [highlightMeal])

  const hasSpotlightOverflow = useMemo(() => {
    return Boolean(highlightMeal?.instructions && highlightMeal.instructions.length > 220)
  }, [highlightMeal])

  return (
    <div className="grain">
      <Header onNavigate={handleNav} />

      <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-16 px-6 py-12">
        {toast ? (
          <div className="rounded-3xl border border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-800">
            {toast}
          </div>
        ) : null}
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
            <div ref={searchRef} id="search">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSearch={() => loadSearch(true)}
                onAdvanced={handleAdvancedFilters}
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
            {meals.length > 0 ? (
              <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.5)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                    Quick picks
                  </p>
                  <button
                    className="text-xs font-semibold text-amber-700 transition hover:text-amber-600"
                    onClick={() => recipesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View all
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {meals.slice(0, 3).map((meal) => (
                    <button
                      key={meal.id}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-28px_rgba(15,23,42,0.5)]"
                      onClick={() => handleSelectMeal(meal.id)}
                    >
                      <img
                        className="h-12 w-12 rounded-xl object-cover"
                        src={meal.thumbnail}
                        alt={meal.name}
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{meal.name}</p>
                        <p className="text-xs text-slate-500">
                          {meal.category ?? 'Chef selection'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
                    {spotlightText}
                  </p>
                  <div className="mt-3">
                    <button
                      className="text-sm font-semibold text-amber-700 transition hover:text-amber-600"
                      onClick={() => handleSelectMeal(highlightMeal.id)}
                    >
                      {hasSpotlightOverflow ? 'Read more' : 'View recipe details'}
                    </button>
                  </div>
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
            <div className="h-64 overflow-hidden rounded-4xl shadow-[0_30px_60px_-36px_rgba(15,23,42,0.6)] md:h-72 lg:h-[420px]">
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

        <section id="categories" ref={categoriesRef} className="space-y-8">
          <SectionHeading
            title="Browse by mood, cuisine, or craving"
            subtitle="Categories"
          />
          <CategoryGrid categories={categories} onSelect={handleCategorySelect} />
        </section>

        <section id="recipes" ref={recipesRef} className="space-y-8">
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
            <RandomHighlight
              meal={highlightMeal}
              onShuffle={handleShuffle}
              onSave={handleSaveMeal}
            />
          ) : (
            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 text-sm text-slate-500">
              Loading a random meal...
            </div>
          )}
        </section>

        <section id="details" ref={detailsRef} className="space-y-6">
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
