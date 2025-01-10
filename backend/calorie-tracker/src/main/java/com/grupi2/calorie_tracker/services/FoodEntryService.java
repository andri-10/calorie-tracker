package com.grupi2.calorie_tracker.services;

import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.dto.FoodEntryRequest;
import com.grupi2.calorie_tracker.repositories.FoodEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodEntryService {
    private final FoodEntryRepository foodEntryRepository;
    private final UserService userService;

    @Transactional
    public FoodEntry createFoodEntry(FoodEntryRequest request, Long userId) {
        User user = userService.getUserById(userId);

        FoodEntry foodEntry = new FoodEntry();
        foodEntry.setUser(user);
        foodEntry.setFoodName(request.getFoodName());
        foodEntry.setCalories(request.getCalories());
        foodEntry.setPrice(request.getPrice());
        foodEntry.setDateTime(request.getDateTime());
        foodEntry.setMealType(request.getMealType());
        foodEntry.setDescription(request.getDescription());

        return foodEntryRepository.save(foodEntry);
    }

    public List<FoodEntry> getUserFoodEntriesForDay(Long userId, LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return foodEntryRepository.findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
                userId, startOfDay, endOfDay);
    }

    public Integer getDailyCalories(Long userId, LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return foodEntryRepository.getTotalCaloriesForUserBetweenDates(
                userId, startOfDay, endOfDay);
    }
}