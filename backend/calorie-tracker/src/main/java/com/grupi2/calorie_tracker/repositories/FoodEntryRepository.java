package com.grupi2.calorie_tracker.repositories;

import com.grupi2.calorie_tracker.entities.FoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface FoodEntryRepository extends JpaRepository<FoodEntry, Long> {
    List<FoodEntry> findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
            Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(f.calories) FROM FoodEntry f WHERE f.user.id = ?1 AND f.dateTime BETWEEN ?2 AND ?3")
    Integer getTotalCaloriesForUserBetweenDates(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT DISTINCT DATE(f.dateTime) " +
            "FROM FoodEntry f " +
            "WHERE f.user.id = :userId " +
            "AND YEAR(f.dateTime) = :year " +
            "AND MONTH(f.dateTime) = :month " +
            "GROUP BY DATE(f.dateTime) " +
            "HAVING SUM(f.calories) > :calorieThreshold")
    List<Date> findHighCalorieDays(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month,
            @Param("calorieThreshold") int calorieThreshold);

    @Query("SELECT SUM(f.price) FROM FoodEntry f " +
            "WHERE f.user.id = :userId " +
            "AND YEAR(f.dateTime) = :year " +
            "AND MONTH(f.dateTime) = :month")
    BigDecimal calculateMonthlySpending(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);
}