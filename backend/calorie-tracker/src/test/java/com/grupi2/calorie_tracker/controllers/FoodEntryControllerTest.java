package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.dto.HistoryResponse;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.security.CustomUserDetails;
import com.grupi2.calorie_tracker.services.FoodEntryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class FoodEntryControllerTest {

    @Mock
    private FoodEntryService foodEntryService;

    @Mock
    private CustomUserDetails userDetails;

    @InjectMocks
    private FoodEntryController foodEntryController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(userDetails.getId()).thenReturn(1L);
    }

    @Test
    void createFoodEntry_Success() {

        FoodEntryRequest request = new FoodEntryRequest();
        FoodEntry expectedEntry = new FoodEntry();
        when(foodEntryService.createFoodEntry(any(FoodEntryRequest.class), anyLong()))
                .thenReturn(expectedEntry);


        ResponseEntity<FoodEntry> response = foodEntryController.createFoodEntry(request, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedEntry, response.getBody());
        verify(foodEntryService).createFoodEntry(request, 1L);
    }

    @Test
    void getDailyEntries_Success() {

        LocalDateTime date = LocalDateTime.now();
        List<FoodEntry> expectedEntries = new ArrayList<>();
        when(foodEntryService.getUserFoodEntriesForDay(anyLong(), any(LocalDateTime.class)))
                .thenReturn(expectedEntries);

        ResponseEntity<List<FoodEntry>> response = foodEntryController.getDailyEntries(date, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedEntries, response.getBody());
        verify(foodEntryService).getUserFoodEntriesForDay(1L, date);
    }

    @Test
    void deleteFoodEntry_Success() {

        when(foodEntryService.deleteFoodEntry(anyLong(), anyLong())).thenReturn(true);

        ResponseEntity<Void> response = foodEntryController.deleteFoodEntry(1L, userDetails);

        assertEquals(204, response.getStatusCodeValue());
        verify(foodEntryService).deleteFoodEntry(1L, 1L);
    }

    @Test
    void deleteFoodEntry_NotFound() {

        when(foodEntryService.deleteFoodEntry(anyLong(), anyLong())).thenReturn(false);

        ResponseEntity<Void> response = foodEntryController.deleteFoodEntry(1L, userDetails);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void getDailyCalories_Success() {

        LocalDateTime date = LocalDateTime.now();
        when(foodEntryService.getDailyCalories(anyLong(), any(LocalDateTime.class)))
                .thenReturn(2000);

        ResponseEntity<Integer> response = foodEntryController.getDailyCalories(date, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2000, response.getBody());
    }

    @Test
    void getDailyCalories_NullResponse() {

        LocalDateTime date = LocalDateTime.now();
        when(foodEntryService.getDailyCalories(anyLong(), any(LocalDateTime.class)))
                .thenReturn(null);

        ResponseEntity<Integer> response = foodEntryController.getDailyCalories(date, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody());
    }

    @Test
    void getHighCalorieDays_Success() {

        List<LocalDateTime> expectedDays = new ArrayList<>();
        when(foodEntryService.getHighCalorieDays(anyLong(), anyInt(), anyInt(), anyInt()))
                .thenReturn(expectedDays);

        ResponseEntity<List<LocalDateTime>> response =
                foodEntryController.getHighCalorieDays(2024, 1, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedDays, response.getBody());
    }

    @Test
    void getMonthlySpending_Success() {

        BigDecimal expectedSpending = new BigDecimal("150.00");
        when(foodEntryService.getMonthlySpending(anyLong(), anyInt(), anyInt()))
                .thenReturn(expectedSpending);

        ResponseEntity<BigDecimal> response =
                foodEntryController.getMonthlySpending(2024, 1, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedSpending, response.getBody());
    }

    @Test
    void getHistory_DayRange_Success() {

        List<FoodEntry> entries = new ArrayList<>();
        when(foodEntryService.getUserFoodEntriesForDay(anyLong(), any()))
                .thenReturn(entries);

        ResponseEntity<?> response = foodEntryController.getHistory(
                "day", 2024, 1, null, 1, null, null, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof HistoryResponse);
    }

    @Test
    void getHistory_DayRange_MissingParameters() {

        ResponseEntity<?> response = foodEntryController.getHistory(
                "day", null, null, null, null, null, null, userDetails);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Year, month, and day are required for the 'day' range.", response.getBody());
    }

    @Test
    void getHistory_WeekRange_Success() {

        List<FoodEntry> entries = new ArrayList<>();
        when(foodEntryService.getUserFoodEntriesForWeek(anyLong(), anyInt(), anyInt()))
                .thenReturn(entries);

        ResponseEntity<?> response = foodEntryController.getHistory(
                "week", 2024, null, 1, null, null, null, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof HistoryResponse);
    }

    @Test
    void getHistory_WeekRange_MissingParameters() {

        ResponseEntity<?> response = foodEntryController.getHistory(
                "week", null, null, null, null, null, null, userDetails);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Year and week are required for the 'week' range.", response.getBody());
    }

    @Test
    void getHistory_MonthRange_Success() {

        List<FoodEntry> entries = new ArrayList<>();
        when(foodEntryService.getUserFoodEntriesForMonth(anyLong(), anyInt(), anyInt()))
                .thenReturn(entries);

        ResponseEntity<?> response = foodEntryController.getHistory(
                "month", 2024, 1, null, null, null, null, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof HistoryResponse);
    }

    @Test
    void getHistory_MonthRange_MissingParameters() {

        ResponseEntity<?> response = foodEntryController.getHistory(
                "month", null, null, null, null, null, null, userDetails);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Year and month are required for the 'month' range.", response.getBody());
    }

    @Test
    void getHistory_AllRange_WithDateRange_Success() {

        List<FoodEntry> entries = new ArrayList<>();
        when(foodEntryService.getUserFoodEntriesForAllTimeWithinRange(anyLong(), any(), any()))
                .thenReturn(entries);

        ResponseEntity<?> response = foodEntryController.getHistory(
                "all", null, null, null, null, "2024-01-01", "2024-12-31", userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof HistoryResponse);
    }

    @Test
    void getHistory_AllRange_WithInvalidDateFormat() {

        ResponseEntity<?> response = foodEntryController.getHistory(
                "all", null, null, null, null, "invalid-date", "invalid-date", userDetails);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid date format. Please use 'YYYY-MM-DD'.", response.getBody());
    }

    @Test
    void getHistory_AllRange_WithoutDateRange_Success() {

        List<FoodEntry> entries = new ArrayList<>();
        when(foodEntryService.getUserFoodEntriesForAllTime(anyLong()))
                .thenReturn(entries);

        ResponseEntity<?> response = foodEntryController.getHistory(
                "all", null, null, null, null, null, null, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof HistoryResponse);
    }

    @Test
    void getHistory_InvalidRange() {

        ResponseEntity<?> response = foodEntryController.getHistory(
                "invalid", null, null, null, null, null, null, userDetails);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid range parameter.", response.getBody());
    }
}