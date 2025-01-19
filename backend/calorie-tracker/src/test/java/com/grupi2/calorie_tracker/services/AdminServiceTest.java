package com.grupi2.calorie_tracker.services;

import com.grupi2.calorie_tracker.dto.AdminStatsResponse;
import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.dto.UserOverBudgetDTO;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.repositories.FoodEntryRepository;
import com.grupi2.calorie_tracker.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private FoodEntryRepository foodEntryRepository;

    @Mock
    private FoodEntryService foodEntryService;

    @InjectMocks
    private AdminService adminService;

    private User user;
    private FoodEntry foodEntry;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setName("John Doe");

        foodEntry = new FoodEntry();
        foodEntry.setId(1L);
        foodEntry.setFoodName("Pizza");
        foodEntry.setCalories(500);
        foodEntry.setPrice(new BigDecimal("12.50"));
        foodEntry.setUser(user);
        foodEntry.setDateTime(LocalDateTime.now());
    }

    @Test
    public void getAdminStats_Success() {
        // Given
        when(userRepository.count()).thenReturn(10L);
        when(foodEntryRepository.count()).thenReturn(100L);
        when(foodEntryRepository.countDistinctUsersByDateTimeBetween(any(), any())).thenReturn(5);
        when(foodEntryRepository.countByDateTimeBetween(any(), any())).thenReturn(50);
        when(foodEntryRepository.getAverageCaloriesLastWeek(any())).thenReturn(300.0);
        when(foodEntryRepository.calculateMonthlySpending(anyLong(), anyInt(), anyInt())).thenReturn(new BigDecimal("1200"));
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));

        // When
        AdminStatsResponse stats = adminService.getAdminStats();

        // Then
        assertNotNull(stats);
        assertEquals(10, stats.getTotalUsers());
        assertEquals(100, stats.getTotalEntries());
        assertEquals(5, stats.getActiveToday());
        assertEquals(50, stats.getLastWeekEntries());
        assertEquals(300.0, stats.getAverageCaloriesAllUsers());
        assertTrue(stats.getUsersOverBudget().size() > 0);
    }

    @Test
    public void getUsersOverBudget_Success() {
        // Given
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        when(foodEntryRepository.calculateMonthlySpending(anyLong(), anyInt(), anyInt())).thenReturn(new BigDecimal("1200"));

        // When
        List<UserOverBudgetDTO> usersOverBudget = adminService.getUsersOverBudget();

        // Then
        assertEquals(1, usersOverBudget.size());
        assertEquals(user.getName(), usersOverBudget.get(0).getName());
    }

    @Test
    public void getUsersOverBudget_NoUsersOverBudget() {
        // Given
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        when(foodEntryRepository.calculateMonthlySpending(anyLong(), anyInt(), anyInt())).thenReturn(new BigDecimal("500"));

        // When
        List<UserOverBudgetDTO> usersOverBudget = adminService.getUsersOverBudget();

        // Then
        assertTrue(usersOverBudget.isEmpty());
    }

    @Test
    public void getUserById_UserFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When
        User result = adminService.getUserById(1L);

        // Then
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
    }

    @Test
    public void getUserById_UserNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> adminService.getUserById(1L));
    }

    @Test
    public void createFoodEntryForUser_Success() {
        // Given
        when(foodEntryService.createFoodEntry(any(), anyLong())).thenReturn(foodEntry);

        // When
        FoodEntry result = adminService.createFoodEntryForUser(1L, new FoodEntryRequest());

        // Then
        assertNotNull(result);
        assertEquals(foodEntry.getFoodName(), result.getFoodName());
    }

    @Test
    public void updateEntry_Success() {
        // Given
        when(foodEntryRepository.findById(1L)).thenReturn(Optional.of(foodEntry));
        when(foodEntryRepository.save(any(FoodEntry.class))).thenReturn(foodEntry);

        // When
        FoodEntry updatedEntry = adminService.updateEntry(1L, foodEntry);

        // Then
        assertNotNull(updatedEntry);
        assertEquals(foodEntry.getFoodName(), updatedEntry.getFoodName());
    }

    @Test
    public void updateEntry_EntryNotFound() {
        // Given
        when(foodEntryRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> adminService.updateEntry(1L, foodEntry));
    }

    @Test
    public void deleteEntry_Success() {
        // Given
        doNothing().when(foodEntryRepository).deleteById(1L);

        // When
        adminService.deleteEntry(1L);

        // Then
        verify(foodEntryRepository, times(1)).deleteById(1L);
    }

    @Test
    public void deleteEntry_EntryNotFound() {
        // Given
        doThrow(new RuntimeException("Entry not found")).when(foodEntryRepository).deleteById(1L);

        // When & Then
        assertThrows(RuntimeException.class, () -> adminService.deleteEntry(1L));
    }
}