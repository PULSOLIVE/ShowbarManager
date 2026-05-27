package com.showbarmanager.api.modules.health;

import com.showbarmanager.api.responses.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/v1/health")
    public ApiResponse<String> health() {

        return new ApiResponse<>(
                true,
                "API ShowbarManager online",
                "SHOWBARMANAGER ERP COMPLETE ECOSYSTEM"
        );
    }
}