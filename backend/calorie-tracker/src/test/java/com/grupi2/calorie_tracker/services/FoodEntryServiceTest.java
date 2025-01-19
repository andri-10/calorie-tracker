package com.grupi2.calorie_tracker.services;

import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.MealType;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.repositories.FoodEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class FoodEntryServiceTest {

    @Mock
    private FoodEntryRepository foodEntryRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private FoodEntryService foodEntryService;

    private User user;
    private FoodEntryRequest foodEntryRequest;
    private FoodEntry foodEntry;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setName("testUser");

        foodEntryRequest = new FoodEntryRequest();
        foodEntryRequest.setFoodName("Pizza");
        foodEntryRequest.setCalories(250);
        foodEntryRequest.setPrice(new BigDecimal("10.99"));
        foodEntryRequest.setMealType(MealType.DINNER);
        foodEntryRequest.setDateTime(LocalDateTime.now());

        foodEntry = new FoodEntry();
        foodEntry.setId(1L);
        foodEntry.setUser(user);
        foodEntry.setFoodName(foodEntryRequest.getFoodName());
        foodEntry.setCalories(foodEntryRequest.getCalories());
        foodEntry.setPrice(foodEntryRequest.getPrice());
        foodEntry.setMealType(MealType.DINNER);
        foodEntry.setDateTime(foodEntryRequest.getDateTime());
    }

    @Test
    void createFoodEntryTest() {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(user);
        when(foodEntryRepository.save(any(FoodEntry.class))).thenReturn(foodEntry);

        // Act
        FoodEntry createdFoodEntry = foodEntryService.createFoodEntry(foodEntryRequest, 1L);

        // Assert
        assertNotNull(createdFoodEntry);
        assertEquals("Pizza", createdFoodEntry.getFoodName());
        assertEquals(250, createdFoodEntry.getCalories());
        assertEquals(new BigDecimal("10.99"), createdFoodEntry.getPrice());
        assertEquals(MealType.DINNER, createdFoodEntry.getMealType());
        assertEquals(user, createdFoodEntry.getUser());
    }

    @Test
    void deleteFoodEntryTest() {
        // Arrange
        when(foodEntryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(foodEntry));

        // Act
        boolean result = foodEntryService.deleteFoodEntry(1L, 1L);

        // Assert
        assertTrue(result);
        verify(foodEntryRepository, times(1)).delete(foodEntry);
    }

    @Test
    void deleteFoodEntryNotFoundTest() {
        // Arrange
        when(foodEntryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act
        boolean result = foodEntryService.deleteFoodEntry(1L, 1L);

        // Assert
        assertFalse(result);
        verify(foodEntryRepository, never()).delete(any(FoodEntry.class));
    }

    @Test
    void getUserFoodEntriesForDayTest() {
        // Arrange
        LocalDateTime today = LocalDateTime.now();
        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(1L, today.toLocalDate().atStartOfDay(), today.toLocalDate().atTime(23, 59, 59)))
                .thenReturn(List.of(foodEntry));

        // Act
        var result = foodEntryService.getUserFoodEntriesForDay(1L, today);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getDailyCaloriesTest() {
        // Arrange
        LocalDateTime today = LocalDateTime.now();
        when(foodEntryRepository.getTotalCaloriesForUserBetweenDates(1L, today.toLocalDate().atStartOfDay(), today.toLocalDate().atTime(23, 59, 59)))
                .thenReturn(250);

        // Act
        Integer totalCalories = foodEntryService.getDailyCalories(1L, today);

        // Assert
        assertEquals(250, totalCalories);
    }

    @Test
    void getMonthlySpendingTest() {
        // Arrange
        int year = 2025;
        int month = 1;
        when(foodEntryRepository.calculateMonthlySpending(1L, year, month)).thenReturn(new BigDecimal("50.75"));

        // Act
        BigDecimal spending = foodEntryService.getMonthlySpending(1L, year, month);

        // Assert
        assertEquals(new BigDecimal("50.75"), spending);
    }

    @Test
    void getUserFoodEntriesForAllTimeTest() {
        // Arrange
        when(foodEntryRepository.findByUserIdOrderByDateTimeDesc(1L)).thenReturn(List.of(foodEntry));

        // Act
        var result = foodEntryService.getUserFoodEntriesForAllTime(1L);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getUserFoodEntriesForWeekTest() {
        // Arrange
        int year = 2025;
        int week = 3;
        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(1L, LocalDate.of(year, 1, 1).atStartOfDay(), LocalDate.of(year, 1, 7).atTime(23, 59, 59)))
                .thenReturn(List.of(foodEntry));

        // Act
        var result = foodEntryService.getUserFoodEntriesForWeek(1L, year, week);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getUserFoodEntriesForMonthTest() {
        // Arrange
        int year = 2025;
        int month = 1;
        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(1L, LocalDate.of(year, month, 1).atStartOfDay(), LocalDate.of(year, month, 31).atTime(23, 59, 59)))
                .thenReturn(List.of(foodEntry));

        // Act
        var result = foodEntryService.getUserFoodEntriesForMonth(1L, year, month);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getUserFoodEntriesForAllTimeWithinRangeTest() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();
        when(foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(1L, startDate, endDate)).thenReturn(List.of(foodEntry));

        // Act
        var result = foodEntryService.getUserFoodEntriesForAllTimeWithinRange(1L, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
}
