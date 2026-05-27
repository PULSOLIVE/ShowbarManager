package com.showbarmanager.api.multitenancy;

import java.util.UUID;

public final class TenantUtils {

    private TenantUtils() {
    }

    public static UUID getCurrentTenantIdOrThrow() {
        UUID tenantId = TenantContext.getTenantId();

        if (tenantId == null) {
            throw new IllegalStateException("Tenant não informado na requisição.");
        }

        return tenantId;
    }

    public static UUID getCurrentTenantIdOrNull() {
        return TenantContext.getTenantId();
    }
}