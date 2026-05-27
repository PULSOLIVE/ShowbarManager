
package com.showbarmanager.api.responses;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private boolean success;
    private String message;
    private String error;
    private int status;
    private String path;
    private List<String> details;
    private LocalDateTime timestamp;

    public ErrorResponse() {
        this.success = false;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, String error, int status, String path, List<String> details) {
        this.success = false;
        this.message = message;
        this.error = error;
        this.status = status;
        this.path = path;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getError() {
        return error;
    }

    public int getStatus() {
        return status;
    }

    public String getPath() {
        return path;
    }

    public List<String> getDetails() {
        return details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setError(String error) {
        this.error = error;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}