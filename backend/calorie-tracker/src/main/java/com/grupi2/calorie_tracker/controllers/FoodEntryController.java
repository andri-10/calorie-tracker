package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.services.FoodEntryService;
import com.grupi2.calorie_tracker.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/food-entries")
//@RequiredArgsConstructor
public class FoodEntryController {

    private final FoodEntryService foodEntryService;

    @Autowired
    public FoodEntryController(FoodEntryService foodEntryService) {
        this.foodEntryService = foodEntryService;
    }
    @PostMapping
    public ResponseEntity<FoodEntry> createFoodEntry(
            @Valid @RequestBody FoodEntryRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((CustomUserDetails) userDetails).getId();
        FoodEntry foodEntry = foodEntryService.createFoodEntry(request, userId);
        return ResponseEntity.ok(foodEntry);
    }

    @GetMapping("/daily")
    public ResponseEntity<List<FoodEntry>> getDailyEntries(
            @RequestParam LocalDateTime date,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((CustomUserDetails) userDetails).getId();
        List<FoodEntry> entries = foodEntryService.getUserFoodEntriesForDay(userId, date);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/calories/daily")
    public ResponseEntity<Integer> getDailyCalories(
            @RequestParam LocalDateTime date,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((CustomUserDetails) userDetails).getId();
        Integer calories = foodEntryService.getDailyCalories(userId, date);
        return ResponseEntity.ok(calories != null ? calories : 0);
    }

    @GetMapping("/calories/high-calorie-days")
    public ResponseEntity<List<LocalDateTime>> getHighCalorieDays(
            @RequestParam int year,
            @RequestParam int month,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((CustomUserDetails) userDetails).getId();
        List<LocalDateTime> highCalorieDays = foodEntryService.getHighCalorieDays(userId, year, month, 2500);
        return ResponseEntity.ok(highCalorieDays);
    }

    @GetMapping("/spending/monthly")
    public ResponseEntity<BigDecimal> getMonthlySpending(
            @RequestParam int year,
            @RequestParam int month,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((CustomUserDetails) userDetails).getId();
        BigDecimal spending = foodEntryService.getMonthlySpending(userId, year, month);
        return ResponseEntity.ok(spending);
    }
}
