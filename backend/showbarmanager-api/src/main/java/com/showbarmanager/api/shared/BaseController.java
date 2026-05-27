package com.showbarmanager.api.shared;

import com.showbarmanager.api.responses.ApiResponse;
import com.showbarmanager.api.responses.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {

    protected <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(
                true,
                message,
                data
        );
    }

    protected <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(success(message, data));
    }

    protected <T> ApiResponse<PageResponse<T>> page(String message, Page<T> page) {
        return new ApiResponse<>(
                true,
                message,
                PaginationUtils.build(page)
        );
    }
}