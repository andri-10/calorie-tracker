package com.grupi2.calorie_tracker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FoodEntryRequest {
    @NotBlank(message = "Food name is required")
    @Size(max = 255, message = "Food name must not exceed 255 characters")
    private String foodName;

    @NotNull(message = "Calories are required")
    @Min(value = 0, message = "Calories must be positive")
    private Integer calories;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Date and time are required")
    private LocalDateTime dateTime;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    private String description;
}
