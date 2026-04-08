package com.cheko.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurant")
public class Restaurant {

    @Id
    private int id;
    private String name;
    private String image;
    private double lat;
    private double lng;


    @ManyToMany
    @JoinTable( // creates the junction table
            name = "restaurant_menu",
            joinColumns = @JoinColumn(name = "restaurant_id"),
            inverseJoinColumns = @JoinColumn(name = "menu_id")
    )
    private List<Menu> menuItems = new ArrayList<>();

    public Restaurant() {}

    public Restaurant(int id, String name, String image, double lat, double lng) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.lat = lat;
        this.lng = lng;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public List<Menu> getMenuItems() { return menuItems; }
    public void setMenuItems(List<Menu> menuItems) { this.menuItems = menuItems; }
}