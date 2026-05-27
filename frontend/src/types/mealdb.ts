export type Ingredient = {
  name: string
  measure: string
}

export type MealSummary = {
  id: string
  name: string
  category?: string | null
  area?: string | null
  thumbnail: string
  tags: string[]
}

export type MealDetails = {
  id: string
  name: string
  category?: string | null
  area?: string | null
  thumbnail: string
  tags: string[]
  minutes?: number | null
  calories?: number | null
  servings?: number | null
  ingredients: Ingredient[]
  instructions: string
  youtubeId?: string | null
}

export type Category = {
  id: string
  name: string
  description: string
  thumbnail: string
}
