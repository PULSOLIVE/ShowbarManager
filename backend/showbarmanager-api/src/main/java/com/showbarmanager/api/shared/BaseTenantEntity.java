package com.showbarmanager.api.shared;

import com.showbarmanager.api.multitenancy.TenantAware;
import com.showbarmanager.api.multitenancy.TenantUtils;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;

import java.util.UUID;

@MappedSuperclass
public abstract class BaseTenantEntity extends AuditableEntity implements TenantAware, TenantOwned {

    @Column(name = "tenant_id", nullable = false, updatable = false)
    private UUID tenantId;

    @Override
    public UUID getTenantId() {
        return tenantId;
    }

    @Override
    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    @PrePersist
    protected void onCreateBaseTenantEntity() {
        super.onCreateAuditableEntity();

        if (this.tenantId == null) {
            this.tenantId = TenantUtils.getCurrentTenantIdOrThrow();
        }
    }
}