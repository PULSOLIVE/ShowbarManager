package com.showbarmanager.api.multitenancy;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TenantResolver {

    public static final String TENANT_HEADER = "X-Tenant-Id";

    public UUID resolveTenantId(HttpServletRequest request) {
        String tenantId = request.getHeader(TENANT_HEADER);

        if (tenantId == null || tenantId.isBlank()) {
            return null;
        }

        return UUID.fromString(tenantId);
    }
}