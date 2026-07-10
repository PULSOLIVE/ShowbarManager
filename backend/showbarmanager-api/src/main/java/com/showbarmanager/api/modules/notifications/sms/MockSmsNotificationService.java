package com.showbarmanager.api.modules.notifications.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
@ConditionalOnProperty(prefix = "app.sms", name = "provider", havingValue = "mock", matchIfMissing = true)
public class MockSmsNotificationService implements SmsNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(MockSmsNotificationService.class);

    private final RestClient restClient;
    private final String mockUrl;

    public MockSmsNotificationService(
            RestClient.Builder restClientBuilder,
            @Value("${app.sms.mock.url:http://localhost:3001/sms}") String mockUrl
    ) {
        this.restClient = restClientBuilder.build();
        this.mockUrl = mockUrl;
    }

    @Override
    public void sendOtp(String phone, String message, String code) {
        String timestamp = OffsetDateTime.now().toString();

        logger.info(
                "password-reset-sms-mock to={} code={} timestamp={}",
                phone,
                code,
                timestamp
        );

        restClient.post()
                .uri(mockUrl)
                .body(Map.of(
                        "telefone", phone,
                        "codigoOtp", code,
                        "timestamp", timestamp,
                        "mensagem", message
                ))
                .retrieve()
                .toBodilessEntity();
    }
}