package com.grupi2.calorie_tracker.dto;

public class EmailRequest {
    private String email;
    private String subject;
    private String text;
    private String confirmationCode;

    public String getEmail() {
        return email;
    }

    public String getSubject() {
        return subject;
    }

    public String getText() {
        return text;
    }

    public String getConfirmationCode() {
        return confirmationCode;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }
}
