package com.showbarmanager.api.modules.users;

import com.showbarmanager.api.modules.users.dto.CreateUserRequest;
import com.showbarmanager.api.modules.users.dto.UserResponse;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        return new ApiResponse<>(
                true,
                "Usuário criado com sucesso",
                userService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Usuários listados com sucesso",
                userService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> findById(@PathVariable UUID id) {
        return new ApiResponse<>(
                true,
                "Usuário encontrado com sucesso",
                userService.findById(id)
        );
    }
}