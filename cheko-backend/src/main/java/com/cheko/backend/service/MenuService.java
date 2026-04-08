package com.cheko.backend.service;

import com.cheko.backend.model.Category;
import com.cheko.backend.model.Menu;
import com.cheko.backend.repository.MenuRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // Get paginated menu items for a restaurant from  junction table
    public Page<Menu> getMenuByRestaurant(int restaurantId, String search, String category, int page, int size) {
        String searchParam = (search == null) ? "" : search;
        String categoryParam = (category == null) ? "" : category;
        return menuRepository.findByRestaurant(restaurantId, searchParam, categoryParam, PageRequest.of(page, size));
    }

    // Get categories this restaurant actually serves from junction table
    public List<String> getCategoriesByRestaurant(int restaurantId) {
        return menuRepository.findCategoriesByRestaurant(restaurantId);
    }

    // All valid categories from enum (for map filter dropdown)
    public List<String> getAllCategories() {
        List<String> categories = new ArrayList<>();
        for (Category c : Category.values()) {
            categories.add(c.getDisplayName());
        }
        return categories;
    }

    public List<Menu> getSecondHighestCaloriePerCategory() {
        return menuRepository.findSecondHighestCaloriePerCategory();
    }
}