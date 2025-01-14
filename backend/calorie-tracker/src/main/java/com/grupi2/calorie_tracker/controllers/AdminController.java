package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.AdminStatsResponse;
import com.grupi2.calorie_tracker.dto.UserOverBudgetDTO;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {

        return ResponseEntity.ok(adminService.getAdminStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{userId}/entries")
    public ResponseEntity<List<FoodEntry>> getUserEntries(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserEntries(userId));
    }

    @PutMapping("/entries/{entryId}")
    public ResponseEntity<FoodEntry> updateEntry(
            @PathVariable Long entryId,
            @RequestBody FoodEntry updatedEntry) {
        return ResponseEntity.ok(adminService.updateEntry(entryId, updatedEntry));
    }

    @DeleteMapping("/entries/{entryId}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long entryId) {
        adminService.deleteEntry(entryId);
        return ResponseEntity.noContent().build();
    }
}