package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.dto.HistoryResponse;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/food-entries")


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

    @DeleteMapping("/{foodEntryId}")
    public ResponseEntity<Void> deleteFoodEntry(
            @PathVariable Long foodEntryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((CustomUserDetails) userDetails).getId();
        boolean isDeleted = foodEntryService.deleteFoodEntry(userId, foodEntryId);

        if (isDeleted) {
            return ResponseEntity.noContent().build();  

        } else {
            return ResponseEntity.notFound().build();  

        }
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

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam String range,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer week,
            @RequestParam(required = false) Integer day,
            @RequestParam(required = false) String startDate,  

            @RequestParam(required = false) String endDate,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getId();

        

        List<FoodEntry> entries;

        

        if (range.equals("day")) {
            if (year == null || month == null || day == null) {
                return ResponseEntity.badRequest().body("Year, month, and day are required for the 'day' range.");
            }

            LocalDate date = LocalDate.of(year, Month.of(month), day);
            entries = foodEntryService.getUserFoodEntriesForDay(userId, date.atStartOfDay());

        } else if (range.equals("week")) {
            if (year == null || week == null) {
                return ResponseEntity.badRequest().body("Year and week are required for the 'week' range.");
            }

            entries = foodEntryService.getUserFoodEntriesForWeek(userId, year, week);

        } else if (range.equals("month")) {
            if (year == null || month == null) {
                return ResponseEntity.badRequest().body("Year and month are required for the 'month' range.");
            }

            entries = foodEntryService.getUserFoodEntriesForMonth(userId, year, month);

        } else if (range.equals("all")) {
            

            if (startDate != null && endDate != null) {
                try {
                    

                    LocalDate start = LocalDate.parse(startDate);
                    LocalDate end = LocalDate.parse(endDate);
                    entries = foodEntryService.getUserFoodEntriesForAllTimeWithinRange(userId, start.atStartOfDay(), end.atTime(23, 59, 59));
                    System.out.println("StartDate: " + startDate + ", EndDate: " + endDate);
                } catch (DateTimeParseException e) {
                    return ResponseEntity.badRequest().body("Invalid date format. Please use 'YYYY-MM-DD'.");
                }
            } else {
                

                entries = foodEntryService.getUserFoodEntriesForAllTime(userId);
            }

        } else {
            return ResponseEntity.badRequest().body("Invalid range parameter.");
        }

        

        int totalCalories = entries.stream().mapToInt(FoodEntry::getCalories).sum();

        

        return ResponseEntity.ok(new HistoryResponse(entries, totalCalories));
    }

}
