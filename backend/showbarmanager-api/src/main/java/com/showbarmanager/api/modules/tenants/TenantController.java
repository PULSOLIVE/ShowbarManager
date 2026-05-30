package com.showbarmanager.api.modules.tenants;

import com.showbarmanager.api.responses.ApiResponse;
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
    public ApiResponse<Tenant> create(@RequestBody Tenant tenant) {
        Tenant createdTenant = tenantService.create(tenant);

        return new ApiResponse<>(
                true,
                "Tenant criado com sucesso",
                createdTenant
        );
    }

    @GetMapping
    public ApiResponse<List<Tenant>> findAll() {
        return new ApiResponse<>(
                true,
                "Tenants listados com sucesso",
                tenantService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<Tenant> findById(@PathVariable UUID id) {
        return new ApiResponse<>(
                true,
                "Tenant encontrado com sucesso",
                tenantService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<Tenant> update(
            @PathVariable UUID id,
            @RequestBody UpdateTenantRequest request
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