package com.grupi2.calorie_tracker.dto;

public class PasswordResetRequest {
    private String email;
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
