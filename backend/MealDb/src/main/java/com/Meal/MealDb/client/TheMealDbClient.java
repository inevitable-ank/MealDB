package com.Meal.MealDb.client;

import com.Meal.MealDb.exception.ApiException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TheMealDbClient {

    private final RestClient restClient;

    public TheMealDbClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<TheMealDbMeal> searchByName(String name) {
        TheMealDbMealResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search.php").queryParam("s", name).build())
                .retrieve()
                .body(TheMealDbMealResponse.class);

        if (response == null || response.meals() == null) {
            return Collections.emptyList();
        }

        return response.meals();
    }

    public List<TheMealDbCategory> categories() {
        TheMealDbCategoryResponse response = restClient.get()
                .uri("/categories.php")
                .retrieve()
                .body(TheMealDbCategoryResponse.class);

        if (response == null || response.categories() == null) {
            return Collections.emptyList();
        }

        return response.categories();
    }

    public List<TheMealDbMealLite> mealsByCategory(String category) {
        TheMealDbMealLiteResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/filter.php").queryParam("c", category).build())
                .retrieve()
                .body(TheMealDbMealLiteResponse.class);

        if (response == null || response.meals() == null) {
            return Collections.emptyList();
        }

        return response.meals();
    }

    public Optional<TheMealDbMeal> mealById(String id) {
        TheMealDbMealResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/lookup.php").queryParam("i", id).build())
                .retrieve()
                .body(TheMealDbMealResponse.class);

        if (response == null || response.meals() == null || response.meals().isEmpty()) {
            return Optional.empty();
        }

        return Optional.ofNullable(response.meals().get(0));
    }

    public TheMealDbMeal randomMeal() {
        TheMealDbMealResponse response = restClient.get()
                .uri("/random.php")
                .retrieve()
                .body(TheMealDbMealResponse.class);

        if (response == null || response.meals() == null || response.meals().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Random meal not available");
        }

        return response.meals().get(0);
    }
}
