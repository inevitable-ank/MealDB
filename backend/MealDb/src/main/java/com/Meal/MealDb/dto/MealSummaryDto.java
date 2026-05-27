package com.Meal.MealDb.dto;

import java.util.List;

public record MealSummaryDto(
        String id,
        String name,
        String category,
        String area,
        String thumbnail,
        List<String> tags) {
}
