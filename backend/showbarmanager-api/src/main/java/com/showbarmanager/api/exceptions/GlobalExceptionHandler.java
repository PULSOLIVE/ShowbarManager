package com.showbarmanager.api.exceptions;

import com.showbarmanager.api.responses.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getMessage(),
                "BUSINESS_ERROR",
                HttpStatus.BAD_REQUEST,
                request,
                null
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getMessage(),
                "RESOURCE_NOT_FOUND",
                HttpStatus.NOT_FOUND,
                request,
                null
        );
    }

    @ExceptionHandler(TenantNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTenantNotFoundException(
            TenantNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getMessage(),
                "TENANT_NOT_FOUND",
                HttpStatus.NOT_FOUND,
                request,
                null
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(
            UnauthorizedException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getMessage(),
                "UNAUTHORIZED",
                HttpStatus.UNAUTHORIZED,
                request,
                null
        );
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbiddenException(
            ForbiddenException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getMessage(),
                "FORBIDDEN",
                HttpStatus.FORBIDDEN,
                request,
                null
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getMessage(),
                "BAD_CREDENTIALS",
                HttpStatus.UNAUTHORIZED,
                request,
                null
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        List<String> details = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .toList();

        return buildResponse(
                "Erro de validação nos campos enviados.",
                "VALIDATION_ERROR",
                HttpStatus.BAD_REQUEST,
                request,
                details
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                "Erro interno inesperado.",
                "INTERNAL_SERVER_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR,
                request,
                List.of(exception.getMessage())
        );
    }

    private String formatFieldError(FieldError fieldError) {
        return fieldError.getField() + ": " + fieldError.getDefaultMessage();
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            String message,
            String error,
            HttpStatus status,
            HttpServletRequest request,
            List<String> details
    ) {
        ErrorResponse response = new ErrorResponse(
                message,
                error,
                status.value(),
                request.getRequestURI(),
                details
        );

        return ResponseEntity.status(status).body(response);
    }
}