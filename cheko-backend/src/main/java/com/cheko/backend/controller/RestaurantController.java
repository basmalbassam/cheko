package com.cheko.backend.controller;

import com.cheko.backend.model.Restaurant;
import com.cheko.backend.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // Get /restaurants
    // Get /restaurants?search=toast
    // Get /restaurants?category=Breakfast → only R1, R2, R3 (R4 & R5 have no Breakfast)
    @GetMapping
    public List<Restaurant> getRestaurants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return restaurantService.getRestaurants(search, category);
    }
}