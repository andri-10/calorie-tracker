package com.grupi2.calorie_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class UserOverBudgetDTO {
    private Long id;
    private String name;
    private BigDecimal totalSpent;
}
