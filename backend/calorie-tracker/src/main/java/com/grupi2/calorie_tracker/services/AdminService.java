package com.grupi2.calorie_tracker.services;

import com.grupi2.calorie_tracker.dto.AdminStatsResponse;
import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.dto.UserOverBudgetDTO;
import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.repositories.FoodEntryRepository;
import com.grupi2.calorie_tracker.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final FoodEntryRepository foodEntryRepository;
    private final FoodEntryService foodEntryService;

    @Autowired
    public AdminService(UserRepository userRepository, FoodEntryRepository foodEntryRepository, FoodEntryService foodEntryService) {
        this.userRepository = userRepository;
        this.foodEntryRepository = foodEntryRepository;
        this.foodEntryService = foodEntryService;
    }

    public AdminStatsResponse getAdminStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime fourteenDaysAgo = now.minusDays(14);

        int totalUsers = (int) userRepository.count();
        int totalEntries = (int) foodEntryRepository.count();
        int activeToday = foodEntryRepository.countDistinctUsersByDateTimeBetween(
                now.toLocalDate().atStartOfDay(),
                now.toLocalDate().plusDays(1).atStartOfDay()
        );

        int lastWeekEntries = foodEntryRepository.countByDateTimeBetween(sevenDaysAgo, now);
        int weekBeforeEntries = foodEntryRepository.countByDateTimeBetween(fourteenDaysAgo, sevenDaysAgo);

        double averageCaloriesAllUsers = foodEntryRepository.getAverageCaloriesLastWeek(sevenDaysAgo);

        List<UserOverBudgetDTO> usersOverBudget = getUsersOverBudget();

        return new AdminStatsResponse(
                totalUsers,
                totalEntries,
                activeToday,
                lastWeekEntries,
                weekBeforeEntries,
                averageCaloriesAllUsers,
                usersOverBudget
        );


    }

    private List<UserOverBudgetDTO> getUsersOverBudget() {
        // Define the budget limit, e.g., 1000
        BigDecimal budgetLimit = new BigDecimal("1000");

        // Get the current month and year
        LocalDateTime now = LocalDateTime.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();

        // Fetch all users
        List<User> allUsers = getAllUsers();

        // Map the users to a list of UserOverBudgetDTOs, including monthly spending calculation
        return allUsers.stream()
                .map(user -> {
                    BigDecimal monthlySpending = foodEntryRepository.calculateMonthlySpending(user.getId(), currentYear, currentMonth);
                    // Only include users who exceeded the budget
                    if (monthlySpending != null && monthlySpending.compareTo(budgetLimit) > 0) {
                        return new UserOverBudgetDTO(
                                user.getId(),
                                user.getName(),
                                monthlySpending
                        );
                    }
                    return null;
                })
                .filter(userOverBudgetDTO -> userOverBudgetDTO != null)
                .collect(Collectors.toList());
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<FoodEntry> getUserEntries(Long userId) {
        return foodEntryRepository.findByUserIdOrderByDateTimeDesc(userId);
    }

    public FoodEntry createFoodEntryForUser(Long userId, FoodEntryRequest request) {
        // We can reuse the existing foodEntryService method since it has the same functionality
        return foodEntryService.createFoodEntry(request, userId);
    }

    @Transactional
    public FoodEntry updateEntry(Long entryId, FoodEntry updatedEntry) {
        FoodEntry existingEntry = foodEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        existingEntry.setFoodName(updatedEntry.getFoodName());
        existingEntry.setCalories(updatedEntry.getCalories());
        existingEntry.setPrice(updatedEntry.getPrice());
        existingEntry.setMealType(updatedEntry.getMealType());
        existingEntry.setDescription(updatedEntry.getDescription());

        return foodEntryRepository.save(existingEntry);
    }

    @Transactional
    public void deleteEntry(Long entryId) {
        foodEntryRepository.deleteById(entryId);
    }
}