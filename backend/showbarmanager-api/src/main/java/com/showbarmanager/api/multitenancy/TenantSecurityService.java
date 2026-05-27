package com.showbarmanager.api.multitenancy;

import com.showbarmanager.api.exceptions.ForbiddenException;
import com.showbarmanager.api.shared.TenantOwned;
import org.springframework.stereotype.Service;

@Service
public class TenantSecurityService {

    private final TenantAccessValidator tenantAccessValidator;

    public TenantSecurityService(TenantAccessValidator tenantAccessValidator) {
        this.tenantAccessValidator = tenantAccessValidator;
    }

    public <T extends TenantOwned> T validateAndReturn(T entity) {
        if (entity == null) {
            return null;
        }

        tenantAccessValidator.validateTenantAccess(entity.getTenantId());

        return entity;
    }

    public <T extends TenantOwned> void validate(T entity) {
        if (entity == null) {
            return;
        }

        tenantAccessValidator.validateTenantAccess(entity.getTenantId());
    }

    public void denyIfDifferentTenant(TenantOwned entity) {
        if (entity == null) {
            return;
        }

        if (!tenantAccessValidator.canAccessTenant(entity.getTenantId())) {
            throw new ForbiddenException("Acesso negado para este recurso.");
        }
    }
}