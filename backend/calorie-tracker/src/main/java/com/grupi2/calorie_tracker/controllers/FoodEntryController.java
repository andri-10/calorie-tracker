package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.services.FoodEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/food-entries")
@RequiredArgsConstructor
public class FoodEntryController {
    private final FoodEntryService foodEntryService;

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
}