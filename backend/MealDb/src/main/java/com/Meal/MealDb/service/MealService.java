package com.Meal.MealDb.service;

import com.Meal.MealDb.client.TheMealDbClient;
import com.Meal.MealDb.client.TheMealDbMeal;
import com.Meal.MealDb.client.TheMealDbMealLite;
import com.Meal.MealDb.dto.CategoryDto;
import com.Meal.MealDb.dto.IngredientDto;
import com.Meal.MealDb.dto.MealDetailsDto;
import com.Meal.MealDb.dto.MealSummaryDto;
import com.Meal.MealDb.exception.ApiException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MealService {

    private final TheMealDbClient client;

    public MealService(TheMealDbClient client) {
        this.client = client;
    }

    @Cacheable(cacheNames = "mealsByName", key = "#name")
    public List<MealSummaryDto> searchByName(String name) {
        return client.searchByName(name).stream()
                .map(this::toSummary)
                .toList();
    }

    @Cacheable(cacheNames = "categories")
    public List<CategoryDto> categories() {
        return client.categories().stream()
                .map(category -> new CategoryDto(
                        category.idCategory(),
                        category.strCategory(),
                        category.strCategoryDescription(),
                        category.strCategoryThumb()))
                .toList();
    }

    @Cacheable(cacheNames = "mealsByCategory", key = "#category")
    public List<MealSummaryDto> mealsByCategory(String category) {
        return client.mealsByCategory(category).stream()
                .map(this::toSummary)
                .toList();
    }

    @Cacheable(cacheNames = "mealById", key = "#id")
    public MealDetailsDto mealById(String id) {
        Optional<TheMealDbMeal> meal = client.mealById(id);
        return meal.map(this::toDetails)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Meal not found"));
    }

    @Cacheable(cacheNames = "randomMeal")
    public MealDetailsDto randomMeal() {
        return toDetails(client.randomMeal());
    }

    private MealSummaryDto toSummary(TheMealDbMeal meal) {
        return new MealSummaryDto(
                meal.idMeal(),
                meal.strMeal(),
                meal.strCategory(),
                meal.strArea(),
                meal.strMealThumb(),
                splitTags(meal.strTags()));
    }

    private MealSummaryDto toSummary(TheMealDbMealLite meal) {
        return new MealSummaryDto(
                meal.idMeal(),
                meal.strMeal(),
                null,
                null,
                meal.strMealThumb(),
                Collections.emptyList());
    }

    private MealDetailsDto toDetails(TheMealDbMeal meal) {
        return new MealDetailsDto(
                meal.idMeal(),
                meal.strMeal(),
                meal.strCategory(),
                meal.strArea(),
                meal.strMealThumb(),
                splitTags(meal.strTags()),
                null,
                null,
                null,
                buildIngredients(meal),
                meal.strInstructions(),
                extractYoutubeId(meal.strYoutube()));
    }

    private List<String> splitTags(String tags) {
        if (!StringUtils.hasText(tags)) {
            return Collections.emptyList();
        }

        String[] split = tags.split(",");
        List<String> values = new ArrayList<>();
        for (String tag : split) {
            String trimmed = tag.trim();
            if (!trimmed.isEmpty()) {
                values.add(trimmed);
            }
        }
        return values;
    }

    private List<IngredientDto> buildIngredients(TheMealDbMeal meal) {
        List<String> ingredients = List.of(
                meal.strIngredient1(), meal.strIngredient2(), meal.strIngredient3(),
                meal.strIngredient4(), meal.strIngredient5(), meal.strIngredient6(),
                meal.strIngredient7(), meal.strIngredient8(), meal.strIngredient9(),
                meal.strIngredient10(), meal.strIngredient11(), meal.strIngredient12(),
                meal.strIngredient13(), meal.strIngredient14(), meal.strIngredient15(),
                meal.strIngredient16(), meal.strIngredient17(), meal.strIngredient18(),
                meal.strIngredient19(), meal.strIngredient20());

        List<String> measures = List.of(
                meal.strMeasure1(), meal.strMeasure2(), meal.strMeasure3(),
                meal.strMeasure4(), meal.strMeasure5(), meal.strMeasure6(),
                meal.strMeasure7(), meal.strMeasure8(), meal.strMeasure9(),
                meal.strMeasure10(), meal.strMeasure11(), meal.strMeasure12(),
                meal.strMeasure13(), meal.strMeasure14(), meal.strMeasure15(),
                meal.strMeasure16(), meal.strMeasure17(), meal.strMeasure18(),
                meal.strMeasure19(), meal.strMeasure20());

        List<IngredientDto> result = new ArrayList<>();
        IntStream.range(0, ingredients.size()).forEach(index -> {
            String ingredient = ingredients.get(index);
            String measure = measures.get(index);
            if (StringUtils.hasText(ingredient)) {
                result.add(new IngredientDto(ingredient.trim(), measure == null ? "" : measure.trim()));
            }
        });

        return result;
    }

    private String extractYoutubeId(String url) {
        if (!StringUtils.hasText(url)) {
            return null;
        }

        String normalized = url.trim();
        int index = normalized.indexOf("v=");
        if (index >= 0) {
            return normalized.substring(index + 2).split("&")[0];
        }

        String shortPrefix = "youtu.be/";
        int shortIndex = normalized.indexOf(shortPrefix);
        if (shortIndex >= 0) {
            return normalized.substring(shortIndex + shortPrefix.length()).split("\\?")[0];
        }

        return null;
    }
}
