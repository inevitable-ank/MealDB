package com.Meal.MealDb.client;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TheMealDbCategory(
        @JsonProperty("idCategory") String idCategory,
        @JsonProperty("strCategory") String strCategory,
        @JsonProperty("strCategoryDescription") String strCategoryDescription,
        @JsonProperty("strCategoryThumb") String strCategoryThumb) {
}
