package com.cheko.backend.service;

import com.cheko.backend.model.Restaurant;
import com.cheko.backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    // 	Get list of restaurants with optional filter and search
    public List<Restaurant> getRestaurants(String search, String category) {
        String searchParam = (search == null) ? "" : search;
        String categoryParam = (category == null) ? "" : category;
        return restaurantRepository.findBySearchAndCategory(searchParam, categoryParam);
    }
}