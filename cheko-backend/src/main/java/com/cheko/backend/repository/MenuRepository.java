package com.cheko.backend.repository;

import com.cheko.backend.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Integer> {

    @Query(value = """
            SELECT id, name, description, price, image, calorie, category, lat, lng
            FROM ( SELECT *, DENSE_RANK() OVER (PARTITION BY category ORDER BY calorie DESC) AS rnk FROM menu ) 
            ranked WHERE rnk = 2
            """, nativeQuery = true)
    List<Menu> findSecondHighestCaloriePerCategory();
}