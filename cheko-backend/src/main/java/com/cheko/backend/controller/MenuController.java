package com.cheko.backend.controller;

import com.cheko.backend.model.Menu;
import com.cheko.backend.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController                                   // handle HTTP request and convert values to JSON
@RequestMapping("/menu")                       // all endpoints start with /menu
@CrossOrigin (origins = "http://localhost:3000") // only call this API
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // get all menu items (no params), search by name or description, filter by category
    @GetMapping
    public List<Menu> getMenu(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return menuService.getMenu(search, category);
    }

    // get @Query in MenuRepository from MenuService
    @GetMapping("/second-highest-calorie")
    public List<Menu> getSecondHighestCaloriePerCategory() {
        return menuService.getSecondHighestCaloriePerCategory();
    }

    @GetMapping("/locations")
    public List<Menu> getAllLocations() {
        return menuService.getAllLocations();
    }
}