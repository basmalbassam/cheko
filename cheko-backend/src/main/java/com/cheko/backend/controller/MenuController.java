package com.cheko.backend.controller;

import com.cheko.backend.model.Menu;
import com.cheko.backend.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu")
@CrossOrigin (origins = "http://localhost:3000")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<Menu> getMenu(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return menuService.getMenu(search, category);
    }

    @GetMapping("/second-highest-calorie")
    public List<Menu> getSecondHighestCaloriePerCategory() {
        return menuService.getSecondHighestCaloriePerCategory();
    }

    @GetMapping("/locations")
    public List<Menu> getAllLocations() {
        return menuService.getAllLocations();
    }
}