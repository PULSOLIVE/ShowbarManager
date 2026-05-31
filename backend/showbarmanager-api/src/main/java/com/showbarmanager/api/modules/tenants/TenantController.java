package com.showbarmanager.api.modules.tenants;

import com.showbarmanager.api.modules.tenants.dto.CreateTenantRequest;
import com.showbarmanager.api.modules.tenants.dto.TenantResponse;
import com.showbarmanager.api.modules.tenants.dto.UpdateTenantRequest;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @PostMapping
    public ApiResponse<TenantResponse> create(
            @Valid @RequestBody CreateTenantRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Tenant criado com sucesso",
                tenantService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<TenantResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Tenants listados com sucesso",
                tenantService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<TenantResponse> findById(@PathVariable UUID id) {
        return new ApiResponse<>(
                true,
                "Tenant encontrado com sucesso",
                tenantService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<TenantResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTenantRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Tenant atualizado com sucesso",
                tenantService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        tenantService.delete(id);

        return new ApiResponse<>(
                true,
                "Tenant excluído com sucesso",
                null
        );
    }
}