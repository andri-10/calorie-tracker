package com.grupi2.calorie_tracker.repositories;

import com.grupi2.calorie_tracker.entities.FoodEntry;
import com.grupi2.calorie_tracker.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.util.Date;

import java.util.Optional;

public interface FoodEntryRepository extends JpaRepository<FoodEntry, Long> {
    List<FoodEntry> findByUserIdOrderByDateTimeDesc(Long userId);
    List<FoodEntry> findByUserIdAndDateTimeBetweenOrderByDateTimeDesc(
            Long userId, LocalDateTime start, LocalDateTime end);
    Optional<FoodEntry> findByIdAndUserId(Long foodEntryId, Long userId);
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

    List<FoodEntry> findByUserId(Long userId);

    @Query("SELECT COUNT(DISTINCT f.user) FROM FoodEntry f WHERE f.dateTime BETWEEN :start AND :end")
    int countDistinctUsersByDateTimeBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    int countByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    //@Query("SELECT AVG(f.calories) FROM FoodEntry f WHERE f.dateTime >= :startDate GROUP BY f.user")
    //double getAverageCaloriesPerUserLastWeek(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT AVG(f.calories) FROM FoodEntry f WHERE f.dateTime >= :startDate")
    double getAverageCaloriesLastWeek(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT DISTINCT f.user FROM FoodEntry f " +
            "WHERE f.dateTime BETWEEN :start AND :end " +
            "GROUP BY f.user " +
            "HAVING SUM(f.price) > :limit")
    List<User> findUsersOverBudget(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("limit") BigDecimal limit
    );

    @Query("SELECT SUM(f.price) FROM FoodEntry f " +
            "WHERE f.user.id = :userId AND f.dateTime BETWEEN :start AND :end")
    BigDecimal getTotalSpendingForUserInPeriod(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}