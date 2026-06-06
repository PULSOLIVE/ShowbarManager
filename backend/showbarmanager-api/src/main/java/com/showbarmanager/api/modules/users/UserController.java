package com.showbarmanager.api.modules.users;

import com.showbarmanager.api.modules.users.dto.CreateUserRequest;
import com.showbarmanager.api.modules.users.dto.UpdateUserRequest;
import com.showbarmanager.api.modules.users.dto.UserResponse;
import com.showbarmanager.api.responses.ApiResponse;
import com.showbarmanager.api.security.RequirePermission;
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
    @RequirePermission("USERS_CREATE")
    public ApiResponse<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        return new ApiResponse<>(
                true,
                "Usuário criado com sucesso",
                userService.create(request)
        );
    }

    @GetMapping
    @RequirePermission("USERS_VIEW")
    public ApiResponse<List<UserResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Usuários listados com sucesso",
                userService.findAll()
        );
    }

    @GetMapping("/{id}")
    @RequirePermission("USERS_VIEW")
    public ApiResponse<UserResponse> findById(@PathVariable UUID id) {
        return new ApiResponse<>(
                true,
                "Usuário encontrado com sucesso",
                userService.findById(id)
        );
    }

    @PutMapping("/{id}")
    @RequirePermission("USERS_UPDATE")
    public ApiResponse<UserResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Usuário atualizado com sucesso",
                userService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @RequirePermission("USERS_DELETE")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        userService.delete(id);

        return new ApiResponse<>(
                true,
                "Usuário excluído com sucesso",
                null
        );
    }
}