package com.showbarmanager.api.multitenancy;

import com.showbarmanager.api.exceptions.ForbiddenException;
import com.showbarmanager.api.security.CurrentUserService;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TenantAccessValidator {

    private final CurrentUserService currentUserService;

    public TenantAccessValidator(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    public void validateTenantAccess(UUID resourceTenantId) {
        if (resourceTenantId == null) {
            return;
        }

        if (currentUserService.isAdminMaster() || currentUserService.isDeveloperMaster()) {
            return;
        }

        UUID currentTenantId = currentUserService.getCurrentTenantId();

        if (currentTenantId == null || !currentTenantId.equals(resourceTenantId)) {
            throw new ForbiddenException("Acesso negado para este tenant.");
        }
    }

    public boolean canAccessTenant(UUID resourceTenantId) {
        try {
            validateTenantAccess(resourceTenantId);
            return true;
        } catch (ForbiddenException exception) {
            return false;
        }
    }
}