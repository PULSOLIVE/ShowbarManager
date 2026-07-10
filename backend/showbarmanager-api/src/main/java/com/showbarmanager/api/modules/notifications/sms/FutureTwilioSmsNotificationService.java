package com.showbarmanager.api.modules.notifications.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FutureTwilioSmsNotificationService implements SmsNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(FutureTwilioSmsNotificationService.class);

    @Override
    public void sendOtp(String phone, String message, String code) {
        logger.warn(
                "twilio-sms-provider-not-configured to={} code={}",
                phone,
                code
        );

        throw new UnsupportedOperationException("Twilio SMS provider is not implemented yet.");
    }
}