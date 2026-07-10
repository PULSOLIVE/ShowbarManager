package com.showbarmanager.api.modules.settings.permissions;

import com.showbarmanager.api.modules.settings.permissions.dto.CreatePermissionRequest;
import com.showbarmanager.api.modules.settings.permissions.dto.PermissionResponse;
import com.showbarmanager.api.modules.settings.permissions.dto.UpdatePermissionRequest;
import com.showbarmanager.api.responses.ApiResponse;
import com.showbarmanager.api.security.RequirePermission;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostMapping
    @RequirePermission("PERMISSIONS_CREATE")
    public ApiResponse<PermissionResponse> create(@Valid @RequestBody CreatePermissionRequest request) {
        return new ApiResponse<>(
                true,
                "Permissão criada com sucesso",
                permissionService.create(request)
        );
    }

    @GetMapping
    @RequirePermission("PERMISSIONS_VIEW")
    public ApiResponse<List<PermissionResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Permissões listadas com sucesso",
                permissionService.findAll()
        );
    }

    @GetMapping("/{id}")
    @RequirePermission("PERMISSIONS_VIEW")
    public ApiResponse<PermissionResponse> findById(@PathVariable UUID id) {
        return new ApiResponse<>(
                true,
                "Permissão encontrada com sucesso",
                permissionService.findById(id)
        );
    }

    @PutMapping("/{id}")
    @RequirePermission("PERMISSIONS_UPDATE")
    public ApiResponse<PermissionResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePermissionRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Permissão atualizada com sucesso",
                permissionService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @RequirePermission("PERMISSIONS_DELETE")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        permissionService.delete(id);

        return new ApiResponse<>(
                true,
                "Permissão excluída com sucesso",
                null
        );
    }
}