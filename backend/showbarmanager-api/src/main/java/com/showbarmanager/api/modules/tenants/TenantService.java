package com.showbarmanager.api.modules.tenants;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public Tenant create(Tenant tenant) {
        if (tenantRepository.existsBySlug(tenant.getSlug())) {
            throw new RuntimeException("Já existe um tenant com este slug.");
        }

        return tenantRepository.save(tenant);
    }

    public List<Tenant> findAll() {
        return tenantRepository.findAll();
    }

    public Tenant findById(UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant não encontrado."));
    }
}