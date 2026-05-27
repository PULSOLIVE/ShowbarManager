package com.showbarmanager.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.showbarmanager.api.responses.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;
    private final AuthLoggingService authLoggingService;

    public CustomAccessDeniedHandler(
            ObjectMapper objectMapper,
            AuthLoggingService authLoggingService
    ) {
        this.objectMapper = objectMapper;
        this.authLoggingService = authLoggingService;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {

        String email = SecurityUtils.getCurrentUsername();

        authLoggingService.accessDenied(
                email,
                request.getRequestURI(),
                request.getRemoteAddr()
        );

        ErrorResponse errorResponse = new ErrorResponse(
                "Acesso negado.",
                "FORBIDDEN",
                HttpStatus.FORBIDDEN.value(),
                request.getRequestURI(),
                null
        );

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}