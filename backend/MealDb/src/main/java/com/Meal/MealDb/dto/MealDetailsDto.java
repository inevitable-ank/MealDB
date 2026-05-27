package com.Meal.MealDb.dto;

import java.util.List;

public record MealDetailsDto(
        String id,
        String name,
        String category,
        String area,
        String thumbnail,
        List<String> tags,
        Integer minutes,
        Integer calories,
        Integer servings,
        List<IngredientDto> ingredients,
        String instructions,
        String youtubeId) {
}
