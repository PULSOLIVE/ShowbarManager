package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.modules.auth.dto.ForgotPasswordRequest;
import com.showbarmanager.api.modules.auth.dto.ForgotPasswordResponse;
import com.showbarmanager.api.modules.auth.dto.LoginRequest;
import com.showbarmanager.api.modules.auth.dto.LoginResponse;
import com.showbarmanager.api.modules.auth.dto.ResetPasswordRequest;
import com.showbarmanager.api.modules.auth.dto.ResetPasswordResponse;
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

    @PostMapping("/forgot-password")
    public ApiResponse<ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return new ApiResponse<>(
                true,
                "Código de redefinição enviado com sucesso",
                authService.forgotPassword(request, httpServletRequest.getRemoteAddr())
        );
    }

    @PostMapping("/reset-password")
    public ApiResponse<ResetPasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return new ApiResponse<>(
                true,
                "Senha redefinida com sucesso",
                authService.resetPassword(request, httpServletRequest.getRemoteAddr())
        );
    }
}