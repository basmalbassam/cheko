package com.cheko.backend.model;

// enum that define all  menu categories
public enum Category {
    BREAKFAST("Breakfast"),
    DRINKS("Drinks"),
    SOUPS("Soups"),
    SUSHI("Sushi"),
    RICE("Rice");


    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
