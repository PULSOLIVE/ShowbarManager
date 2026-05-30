package com.showbarmanager.api.modules.tenants;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
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
            throw new BusinessException("Já existe um tenant com este slug.");
        }

        if (tenant.getActive() == null) {
            tenant.setActive(true);
        }

        return tenantRepository.save(tenant);
    }

    public List<Tenant> findAll() {
        return tenantRepository.findAll();
    }

    public Tenant findById(UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));
    }

    public Tenant update(UUID id, UpdateTenantRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));

        boolean slugChanged = request.getSlug() != null
                && !request.getSlug().equalsIgnoreCase(tenant.getSlug());

        if (slugChanged && tenantRepository.existsBySlug(request.getSlug())) {
            throw new BusinessException("Já existe outro tenant com este slug.");
        }

        if (request.getName() != null) {
            tenant.setName(request.getName());
        }

        if (request.getSlug() != null) {
            tenant.setSlug(request.getSlug());
        }

        if (request.getCountry() != null) {
            tenant.setCountry(request.getCountry());
        }

        if (request.getCurrency() != null) {
            tenant.setCurrency(request.getCurrency());
        }

        if (request.getLanguage() != null) {
            tenant.setLanguage(request.getLanguage());
        }

        if (request.getTimezone() != null) {
            tenant.setTimezone(request.getTimezone());
        }

        if (request.getActive() != null) {
            tenant.setActive(request.getActive());
        }

        return tenantRepository.save(tenant);
    }

    public void delete(UUID id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));

        tenantRepository.delete(tenant);
    }
}