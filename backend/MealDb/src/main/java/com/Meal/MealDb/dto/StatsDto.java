package com.Meal.MealDb.dto;

public record StatsDto(
        String query,
        int totalMeals,
        int categoryCount,
        int averageIngredients) {
}
