package com.grupi2.calorie_tracker.services;

import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.MealType;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.repositories.FoodEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FoodEntryServiceTest {

    @Mock
    private FoodEntryRepository foodEntryRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private FoodEntryService foodEntryService;

    private User testUser;
    private FoodEntry testFoodEntry;
    private FoodEntryRequest testRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);

        testFoodEntry = new FoodEntry();
        testFoodEntry.setId(1L);
        testFoodEntry.setUser(testUser);
        testFoodEntry.setFoodName("Test Food");
        testFoodEntry.setCalories(500);
        testFoodEntry.setPrice(BigDecimal.TEN);
        testFoodEntry.setDateTime(LocalDateTime.now());
        testFoodEntry.setMealType(MealType.LUNCH);

        testRequest = new FoodEntryRequest();
        testRequest.setFoodName("Test Food");
        testRequest.setCalories(500);
        testRequest.setPrice(BigDecimal.TEN);
        testRequest.setDateTime(LocalDateTime.now());
        testRequest.setMealType(MealType.LUNCH);
        testRequest.setDescription("Test Description");
    }

    @Test
    void createFoodEntry_Success() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(foodEntryRepository.save(any(FoodEntry.class))).thenReturn(testFoodEntry);

        FoodEntry result = foodEntryService.createFoodEntry(testRequest, 1L);

        assertNotNull(result);
        assertEquals(testFoodEntry.getFoodName(), result.getFoodName());
        verify(foodEntryRepository).save(any(FoodEntry.class));
    }

    @Test
    void deleteFoodEntry_Success() {
        when(foodEntryRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(testFoodEntry));

        boolean result = foodEntryService.deleteFoodEntry(1L, 1L);

        assertTrue(result);
        verify(foodEntryRepository).delete(testFoodEntry);
    }

    @Test
    void deleteFoodEntry_NotFound() {
        when(foodEntryRepository.findByIdAndUserId(1L, 1L))
                .thenReturn(Optional.empty());

        boolean result = foodEntryService.deleteFoodEntry(1L, 1L);

        assertFalse(result);
        verify(foodEntryRepository, never()).delete(any());
    }

    @Test
    void getUserFoodEntriesForDay() {
        LocalDateTime date = LocalDateTime.now();
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
                1L, startOfDay, endOfDay))
                .thenReturn(Arrays.asList(testFoodEntry));

        List<FoodEntry> results = foodEntryService.getUserFoodEntriesForDay(1L, date);

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        verify(foodEntryRepository).findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
                1L, startOfDay, endOfDay);
    }

    @Test
    void getDailyCalories() {
        LocalDateTime date = LocalDateTime.now();
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        when(foodEntryRepository.getTotalCaloriesForUserBetweenDates(1L, startOfDay, endOfDay))
                .thenReturn(500);

        Integer calories = foodEntryService.getDailyCalories(1L, date);

        assertEquals(500, calories);
    }

    @Test
    void getHighCalorieDays() {
        Date testDate = new Date();
        when(foodEntryRepository.findHighCalorieDays(1L, 2024, 1, 2000))
                .thenReturn(Arrays.asList(testDate));

        List<LocalDateTime> results = foodEntryService.getHighCalorieDays(1L, 2024, 1, 2000);

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getMonthlySpending_WithResults() {
        when(foodEntryRepository.calculateMonthlySpending(1L, 2024, 1))
                .thenReturn(BigDecimal.valueOf(100.00));

        BigDecimal result = foodEntryService.getMonthlySpending(1L, 2024, 1);

        assertEquals(BigDecimal.valueOf(100.00), result);
    }

    @Test
    void getMonthlySpending_NoResults() {
        when(foodEntryRepository.calculateMonthlySpending(1L, 2024, 1))
                .thenReturn(null);

        BigDecimal result = foodEntryService.getMonthlySpending(1L, 2024, 1);

        assertEquals(BigDecimal.ZERO, result);
    }

    @Test
    void getUserFoodEntriesForWeek() {
        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
                eq(1L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(testFoodEntry));

        List<FoodEntry> results = foodEntryService.getUserFoodEntriesForWeek(1L, 2024, 1);

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getUserFoodEntriesForMonth() {
        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
                eq(1L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(testFoodEntry));

        List<FoodEntry> results = foodEntryService.getUserFoodEntriesForMonth(1L, 2024, 1);

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getUserFoodEntriesForAllTime() {
        when(foodEntryRepository.findByUserIdOrderByDateTimeDesc(1L))
                .thenReturn(Arrays.asList(testFoodEntry));

        List<FoodEntry> results = foodEntryService.getUserFoodEntriesForAllTime(1L);

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getUserFoodEntriesForAllTimeWithinRange() {
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(1L, start, end))
                .thenReturn(Arrays.asList(testFoodEntry));

        List<FoodEntry> results = foodEntryService.getUserFoodEntriesForAllTimeWithinRange(1L, start, end);

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }
}