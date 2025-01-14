package com.grupi2.calorie_tracker.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.Locale;

@Entity
@Table(name = "foodentries")
@Data
public class FoodEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;



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
    @Column(name = "date_time", updatable = false)
    private LocalDateTime dateTime;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)  
    @JsonProperty("formattedTime")             
    public String getFormattedTime() {
        if (dateTime == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");
        return dateTime.format(formatter);
    }


    public int getYear() {
        return dateTime.getYear();
    }

    public int getMonth() {
        return dateTime.getMonthValue(); 
    }

    public int getWeek() {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        return dateTime.get(weekFields.weekOfYear());  
    }
}