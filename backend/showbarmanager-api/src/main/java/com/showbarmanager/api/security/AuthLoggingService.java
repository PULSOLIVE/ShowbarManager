package com.showbarmanager.api.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuthLoggingService {

    private static final Logger logger = LoggerFactory.getLogger(AuthLoggingService.class);

    public void loginSuccess(String email, String tenantId, String ip) {
        logger.info(
                "auth event=LOGIN_SUCCESS email={} tenantId={} ip={}",
                email,
                tenantId,
                ip
        );
    }

    public void loginFailure(String email, String ip, String reason) {
        logger.warn(
                "auth event=LOGIN_FAILURE email={} ip={} reason={}",
                email,
                ip,
                reason
        );
    }

    public void tokenInvalid(String ip, String reason) {
        logger.warn(
                "auth event=TOKEN_INVALID ip={} reason={}",
                ip,
                reason
        );
    }

    public void accessDenied(String email, String uri, String ip) {
        logger.warn(
                "auth event=ACCESS_DENIED email={} uri={} ip={}",
                email,
                uri,
                ip
        );
    }
}