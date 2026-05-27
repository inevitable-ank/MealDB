import type { Category, MealDetails, MealSummary } from '../../types/mealdb'
import { request } from './client'

export function searchMeals(name: string): Promise<MealSummary[]> {
  return request(`/search?name=${encodeURIComponent(name)}`)
}

export function getCategories(): Promise<Category[]> {
  return request('/categories')
}

export function getMealsByCategory(category: string): Promise<MealSummary[]> {
  return request(`/category/${encodeURIComponent(category)}`)
}

export function getMealById(id: string): Promise<MealDetails> {
  return request(`/meal/${encodeURIComponent(id)}`)
}

export function getRandomMeal(): Promise<MealDetails> {
  return request('/random')
}
