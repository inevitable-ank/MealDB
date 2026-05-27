package com.Meal.MealDb.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record TheMealDbMealLiteResponse(
        @JsonProperty("meals") List<TheMealDbMealLite> meals) {
}
