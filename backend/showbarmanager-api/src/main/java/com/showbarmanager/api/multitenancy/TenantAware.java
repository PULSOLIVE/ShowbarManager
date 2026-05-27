package com.showbarmanager.api.multitenancy;

import java.util.UUID;

public interface TenantAware {

    UUID getTenantId();

    void setTenantId(UUID tenantId);
}