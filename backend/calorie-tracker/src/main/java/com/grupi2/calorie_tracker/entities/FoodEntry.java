package com.grupi2.calorie_tracker.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "foodentries")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "food_name", nullable = false, length = 255)
    private String foodName;

    @Column(name = "calories", nullable = false)
    private Integer calories;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
