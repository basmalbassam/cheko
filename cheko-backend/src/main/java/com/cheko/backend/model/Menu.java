package com.cheko.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu")
public class Menu {

    @Id
    private int id;
    private String name;
    private String description;
    private double price;
    private String image;
    private int calorie;
    private String category;

    // menu item can belong to many restaurants
    @ManyToMany(mappedBy = "menuItems") // (mappedBy = "menuItems") means Restaurant.java owns the @JoinTable definition
    private List<Restaurant> restaurants = new ArrayList<>();

    public Menu() {}

    public Menu(int id, String name, String description, double price, String image, int calorie, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.calorie = calorie;
        this.category = category;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public int getCalorie() { return calorie; }
    public void setCalorie(int calorie) { this.calorie = calorie; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
 /* Category enum:
    - Stored as String in DB
    - Controlled by enum in backend
 */