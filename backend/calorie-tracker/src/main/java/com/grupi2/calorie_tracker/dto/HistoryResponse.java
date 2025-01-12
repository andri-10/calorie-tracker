package com.grupi2.calorie_tracker.dto;

import com.grupi2.calorie_tracker.entities.FoodEntry;

import java.util.List;

public class HistoryResponse {
    private List<FoodEntry> entries;
    private int totalCalories;

    // Constructor
    public HistoryResponse(List<FoodEntry> entries, int totalCalories) {
        this.entries = entries;
        this.totalCalories = totalCalories;
    }

    // Getters and Setters
    public List<FoodEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<FoodEntry> entries) {
        this.entries = entries;
    }

    public int getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(int totalCalories) {
        this.totalCalories = totalCalories;
    }
}
