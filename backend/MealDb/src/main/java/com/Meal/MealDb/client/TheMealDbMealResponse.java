package com.Meal.MealDb.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record TheMealDbMealResponse(
        @JsonProperty("meals") List<TheMealDbMeal> meals) {
}
