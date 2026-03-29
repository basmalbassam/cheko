package com.cheko.backend.service;

import com.cheko.backend.model.Menu;
import com.cheko.backend.repository.MenuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    public List<Menu> getMenu(String search, String category) {

        List<Menu> menuList = menuRepository.findAll();

        return menuList.stream()
                .filter(item -> {
                    boolean matchesSearch = (search == null ||
                            item.getName().toLowerCase().contains(search.toLowerCase()) ||
                            item.getDescription().toLowerCase().contains(search.toLowerCase()));

                    boolean matchesCategory = (category == null ||
                            item.getCategory().equalsIgnoreCase(category));

                    return matchesSearch && matchesCategory;
                })
                .toList();
    }

    public List<Menu> getSecondHighestCaloriePerCategory() {
        return menuRepository.findSecondHighestCaloriePerCategory();
    }
}