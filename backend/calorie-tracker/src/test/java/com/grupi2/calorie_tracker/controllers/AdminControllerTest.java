package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.AdminStatsResponse;
import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.entities.MealType;
import com.grupi2.calorie_tracker.services.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private User testUser;
    private FoodEntry testFoodEntry;
    private FoodEntryRequest testFoodEntryRequest;
    private AdminStatsResponse testStatsResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");

        // Initialize test food entry
        testFoodEntry = new FoodEntry();
        testFoodEntry.setId(1L);
        testFoodEntry.setUser(testUser);
        testFoodEntry.setFoodName("Test Food");
        testFoodEntry.setCalories(500);
        testFoodEntry.setPrice(BigDecimal.TEN);
        testFoodEntry.setDateTime(LocalDateTime.now());
        testFoodEntry.setMealType(MealType.LUNCH);

        // Initialize test food entry request
        testFoodEntryRequest = new FoodEntryRequest();
        testFoodEntryRequest.setFoodName("Test Food");
        testFoodEntryRequest.setCalories(500);
        testFoodEntryRequest.setPrice(BigDecimal.TEN);
        testFoodEntryRequest.setDateTime(LocalDateTime.now());
        testFoodEntryRequest.setMealType(MealType.LUNCH);

    }


    @Test
    void getAllUsers_Success() {
        List<User> users = Arrays.asList(testUser);
        when(adminService.getAllUsers()).thenReturn(users);

        ResponseEntity<List<User>> response = adminController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(adminService).getAllUsers();
    }

    @Test
    void getUserEntries_Success() {
        List<FoodEntry> entries = Arrays.asList(testFoodEntry);
        when(adminService.getUserEntries(1L)).thenReturn(entries);

        ResponseEntity<List<FoodEntry>> response = adminController.getUserEntries(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(adminService).getUserEntries(1L);
    }

    @Test
    void getUserById_Success() {
        when(adminService.getUserById(1L)).thenReturn(testUser);

        ResponseEntity<User> response = adminController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testUser.getId(), response.getBody().getId());
        verify(adminService).getUserById(1L);
    }

    @Test
    void addFoodEntryForUser_Success() {
        when(adminService.createFoodEntryForUser(eq(1L), any(FoodEntryRequest.class)))
                .thenReturn(testFoodEntry);

        ResponseEntity<FoodEntry> response = adminController.addFoodEntryForUser(1L, testFoodEntryRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testFoodEntry.getId(), response.getBody().getId());
        verify(adminService).createFoodEntryForUser(eq(1L), any(FoodEntryRequest.class));
    }

    @Test
    void updateEntry_Success() {
        when(adminService.updateEntry(eq(1L), any(FoodEntry.class))).thenReturn(testFoodEntry);

        ResponseEntity<FoodEntry> response = adminController.updateEntry(1L, testFoodEntry);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testFoodEntry.getId(), response.getBody().getId());
        verify(adminService).updateEntry(eq(1L), any(FoodEntry.class));
    }

    @Test
    void deleteEntry_Success() {
        doNothing().when(adminService).deleteEntry(1L);

        ResponseEntity<Void> response = adminController.deleteEntry(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(adminService).deleteEntry(1L);
    }
}