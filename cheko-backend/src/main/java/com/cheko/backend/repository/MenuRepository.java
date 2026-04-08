package com.cheko.backend.repository;

import com.cheko.backend.model.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Integer> {

    // Get paginated menu items for a restaurant

            // data query: menu items for the current page
    @Query(value = """
            SELECT m.* FROM menu m -- get all columns from menu
            INNER JOIN restaurant_menu rm ON rm.menu_id = m.id -- connect menu with restaurant
            WHERE rm.restaurant_id = :restaurantId -- only get menu items for this restaurant
            AND (:search = '' OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
                 OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:category = '' OR LOWER(m.category) = LOWER(:category))
            ORDER BY m.id
            """,

            // count query: total number of matching items
            countQuery = """
            SELECT COUNT(*) FROM menu m -- count total items for pagination
            INNER JOIN restaurant_menu rm ON rm.menu_id = m.id
            WHERE rm.restaurant_id = :restaurantId
            AND (:search = '' OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
                 OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:category = '' OR LOWER(m.category) = LOWER(:category))
            """,
            nativeQuery = true)
    Page<Menu> findByRestaurant(
            @Param("restaurantId") int restaurantId,
            @Param("search") String search,
            @Param("category") String category,
            Pageable pageable
    );

    // Get distinct categories that a specific restaurant serves
    @Query(value = """
            SELECT DISTINCT m.category FROM menu m
            INNER JOIN restaurant_menu rm ON rm.menu_id = m.id
            WHERE rm.restaurant_id = :restaurantId
            ORDER BY m.category
            """, nativeQuery = true)
    List<String> findCategoriesByRestaurant(@Param("restaurantId") int restaurantId);

    // second highest calorie per category
    @Query(value = """
            SELECT id, name, description, price, image, calorie, category
            FROM (
                SELECT *,
                       DENSE_RANK() OVER (PARTITION BY category ORDER BY calorie DESC) AS calorie_rank,
                       ROW_NUMBER() OVER (PARTITION BY category, name ORDER BY id ASC) AS name_rank
                FROM menu
            ) ranked
            WHERE calorie_rank = 2 AND name_rank = 1
            """, nativeQuery = true)
    List<Menu> findSecondHighestCaloriePerCategory();
}