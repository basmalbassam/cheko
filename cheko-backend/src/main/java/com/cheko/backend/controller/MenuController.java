package com.cheko.backend.controller;

import com.cheko.backend.model.Menu;
import com.cheko.backend.service.MenuService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // handles HTTP requests from the frontend
@RequestMapping("/menu") //  all endpoints start with /menu
@CrossOrigin
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // Get /menu?restaurantId=1&search=toast&category=Drinks&page=0&size=9
    @GetMapping
    public Page<Menu> getMenu(
            @RequestParam int restaurantId,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        return menuService.getMenuByRestaurant(restaurantId, search, category, page, size);
    }

    // Get /menu/categories?restaurantId=1 → categories this restaurant has
    // Get /menu/categories → all categories from enum
    @GetMapping("/categories")
    public List<String> getCategories(
            @RequestParam(required = false) Integer restaurantId
    ) {
        if (restaurantId != null) {
            return menuService.getCategoriesByRestaurant(restaurantId);
        }
        return menuService.getAllCategories();
    }

    // Get /menu/second-highest-calorie
    @GetMapping("/second-highest-calorie")
    public List<Menu> getSecondHighestCaloriePerCategory() {
        return menuService.getSecondHighestCaloriePerCategory();
    }
}