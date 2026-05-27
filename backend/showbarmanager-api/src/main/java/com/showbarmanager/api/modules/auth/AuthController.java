package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.modules.auth.dto.LoginRequest;
import com.showbarmanager.api.modules.auth.dto.LoginResponse;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return new ApiResponse<>(
                true,
                "Login realizado com sucesso",
                authService.login(request, httpServletRequest.getRemoteAddr())
        );
    }
}