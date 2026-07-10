package com.showbarmanager.api.modules.notifications.sms;

public interface SmsNotificationService {

    void sendOtp(String phone, String message, String code);
}