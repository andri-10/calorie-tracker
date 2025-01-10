package com.grupi2.calorie_tracker.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "foodentries")
@Data
public class FoodEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @NotBlank
    @Size(max = 255)
    @Column(name = "food_name", nullable = false)
    private String foodName;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer calories;

    @NotNull
    @DecimalMin("0.00")
    @Digits(integer = 8, fraction = 2)
    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false)
    private MealType mealType;

    @Column(length = 1000)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}