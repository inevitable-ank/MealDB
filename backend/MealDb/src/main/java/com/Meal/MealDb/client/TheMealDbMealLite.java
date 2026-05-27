package com.Meal.MealDb.client;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TheMealDbMealLite(
        @JsonProperty("idMeal") String idMeal,
        @JsonProperty("strMeal") String strMeal,
        @JsonProperty("strMealThumb") String strMealThumb) {
}
