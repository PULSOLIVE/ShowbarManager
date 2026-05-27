package com.showbarmanager.api.responses;

import java.time.LocalDateTime;
import java.util.List;

public class ApiErrorResponse {

    private boolean success;
    private String message;
    private List<String> errors;
    private String path;
    private LocalDateTime timestamp;

    public ApiErrorResponse(String message, List<String> errors, String path) {
        this.success = false;
        this.message = message;
        this.errors = errors;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getErrors() {
        return errors;
    }

    public String getPath() {
        return path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}