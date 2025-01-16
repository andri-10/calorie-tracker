package com.grupi2.calorie_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AdminStatsResponse {
    private int totalUsers;
    private int totalEntries;
    private int activeToday;
    private int lastWeekEntries;
    private int weekBeforeEntries;
    private double averageCaloriesAllUsers;
    private List<UserOverBudgetDTO> usersOverBudget;
}