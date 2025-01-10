package com.grupi2.calorie_tracker.repositories;

import com.grupi2.calorie_tracker.entities.FoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface FoodEntryRepository extends JpaRepository<FoodEntry, Long> {
    List<FoodEntry> findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
            Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(f.calories) FROM FoodEntry f WHERE f.user.id = ?1 AND f.dateTime BETWEEN ?2 AND ?3")
    Integer getTotalCaloriesForUserBetweenDates(Long userId, LocalDateTime start, LocalDateTime end);
}