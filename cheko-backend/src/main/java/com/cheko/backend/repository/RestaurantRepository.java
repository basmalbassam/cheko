package com.cheko.backend.repository;

import com.cheko.backend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    // filter restaurants by search text or category
    @Query(value = """
            SELECT DISTINCT r.* -- get all restaurant columns
            FROM restaurant r
            LEFT JOIN restaurant_menu rm ON rm.restaurant_id = r.id -- connect restaurant to junction table
            LEFT JOIN menu m ON m.id = rm.menu_id -- connect to menu table
            WHERE (:search = '' OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:category = '' OR m.category = :category)
            ORDER BY r.id
            """, nativeQuery = true)
    List<Restaurant> findBySearchAndCategory(
            @Param("search") String search,
            @Param("category") String category
    );
}