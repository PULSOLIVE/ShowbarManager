package com.showbarmanager.api.modules.settings.tenantrules;

import com.showbarmanager.api.modules.settings.tenantrules.dto.CreateTenantEnvironmentRuleRequest;
import com.showbarmanager.api.modules.settings.tenantrules.dto.TenantEnvironmentRuleResponse;
import com.showbarmanager.api.modules.settings.tenantrules.dto.UpdateTenantEnvironmentRuleRequest;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings/tenant-rules")
public class TenantEnvironmentRuleController {

    private final TenantEnvironmentRuleService tenantEnvironmentRuleService;

    public TenantEnvironmentRuleController(
            TenantEnvironmentRuleService tenantEnvironmentRuleService
    ) {
        this.tenantEnvironmentRuleService = tenantEnvironmentRuleService;
    }

    @PostMapping
    public ApiResponse<TenantEnvironmentRuleResponse> create(
            @Valid @RequestBody CreateTenantEnvironmentRuleRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Regra de ambiente criada com sucesso",
                tenantEnvironmentRuleService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<TenantEnvironmentRuleResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Regras de ambiente listadas com sucesso",
                tenantEnvironmentRuleService.findAll()
        );
    }

    @GetMapping("/enabled")
    public ApiResponse<List<TenantEnvironmentRuleResponse>> findEnabled() {
        return new ApiResponse<>(
                true,
                "Regras de ambiente ativas listadas com sucesso",
                tenantEnvironmentRuleService.findEnabled()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<TenantEnvironmentRuleResponse> findById(
            @PathVariable UUID id
    ) {
        return new ApiResponse<>(
                true,
                "Regra de ambiente encontrada com sucesso",
                tenantEnvironmentRuleService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<TenantEnvironmentRuleResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTenantEnvironmentRuleRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Regra de ambiente atualizada com sucesso",
                tenantEnvironmentRuleService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        tenantEnvironmentRuleService.delete(id);

        return new ApiResponse<>(
                true,
                "Regra de ambiente excluída com sucesso",
                null
        );
    }
}