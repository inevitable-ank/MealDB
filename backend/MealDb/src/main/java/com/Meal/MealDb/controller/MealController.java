package com.Meal.MealDb.controller;

import com.Meal.MealDb.dto.CategoryDto;
import com.Meal.MealDb.dto.MealDetailsDto;
import com.Meal.MealDb.dto.MealSummaryDto;
import com.Meal.MealDb.dto.StatsDto;
import com.Meal.MealDb.service.MealService;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Validated
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping("/search")
    public List<MealSummaryDto> search(@RequestParam("name") @NotBlank String name) {
        return mealService.searchByName(name.trim());
    }

    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return mealService.categories();
    }

    @GetMapping("/category/{name}")
    public List<MealSummaryDto> category(@PathVariable("name") @NotBlank String name) {
        return mealService.mealsByCategory(name.trim());
    }

    @GetMapping("/meal/{id}")
    public MealDetailsDto meal(@PathVariable("id") @NotBlank String id) {
        return mealService.mealById(id.trim());
    }

    @GetMapping("/random")
    public MealDetailsDto random() {
        return mealService.randomMeal();
    }

    @GetMapping("/stats")
    public StatsDto stats(@RequestParam(value = "query", required = false) String query) {
        return mealService.stats(query);
    }
}
