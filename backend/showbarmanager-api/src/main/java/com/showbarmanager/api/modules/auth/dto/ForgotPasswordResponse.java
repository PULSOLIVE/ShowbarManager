package com.showbarmanager.api.modules.auth.dto;

public class ForgotPasswordResponse {

    private String resetToken;
    private Integer expiresInMinutes;
    private String maskedDestination;

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public Integer getExpiresInMinutes() {
        return expiresInMinutes;
    }

    public void setExpiresInMinutes(Integer expiresInMinutes) {
        this.expiresInMinutes = expiresInMinutes;
    }

    public String getMaskedDestination() {
        return maskedDestination;
    }

    public void setMaskedDestination(String maskedDestination) {
        this.maskedDestination = maskedDestination;
    }
}