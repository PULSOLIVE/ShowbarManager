package com.showbarmanager.api.modules.tenants;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.tenants.dto.CreateTenantRequest;
import com.showbarmanager.api.modules.tenants.dto.TenantResponse;
import com.showbarmanager.api.modules.tenants.dto.UpdateTenantRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public TenantResponse create(CreateTenantRequest request) {
        String normalizedSlug = normalizeSlug(request.getSlug());

        if (tenantRepository.existsBySlug(normalizedSlug)) {
            throw new BusinessException("Já existe um tenant com este slug.");
        }

        Tenant tenant = new Tenant();
        tenant.setName(normalizeText(request.getName()));
        tenant.setSlug(normalizedSlug);
        tenant.setCountry(normalizeCountry(request.getCountry()));
        tenant.setCurrency(normalizeCurrency(request.getCurrency()));
        tenant.setLanguage(normalizeLanguage(request.getLanguage()));
        tenant.setTimezone(normalizeTimezone(request.getTimezone()));
        tenant.setActive(request.getActive() != null ? request.getActive() : true);

        Tenant savedTenant = tenantRepository.save(tenant);

        return toResponse(savedTenant);
    }

    public List<TenantResponse> findAll() {
        return tenantRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TenantResponse findById(UUID id) {
        Tenant tenant = findTenantById(id);

        return toResponse(tenant);
    }

    public TenantResponse update(UUID id, UpdateTenantRequest request) {
        Tenant tenant = findTenantById(id);

        String normalizedSlug = normalizeSlug(request.getSlug());

        boolean slugChanged = normalizedSlug != null
                && !normalizedSlug.equalsIgnoreCase(tenant.getSlug());

        if (slugChanged && tenantRepository.existsBySlug(normalizedSlug)) {
            throw new BusinessException("Já existe outro tenant com este slug.");
        }

        tenant.setName(normalizeText(request.getName()));
        tenant.setSlug(normalizedSlug);
        tenant.setCountry(normalizeCountry(request.getCountry()));
        tenant.setCurrency(normalizeCurrency(request.getCurrency()));
        tenant.setLanguage(normalizeLanguage(request.getLanguage()));
        tenant.setTimezone(normalizeTimezone(request.getTimezone()));

        if (request.getActive() != null) {
            tenant.setActive(request.getActive());
        }

        Tenant savedTenant = tenantRepository.save(tenant);

        return toResponse(savedTenant);
    }

    public void delete(UUID id) {
        Tenant tenant = findTenantById(id);

        tenantRepository.delete(tenant);
    }

    private Tenant findTenantById(UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));
    }

    private String normalizeText(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeSlug(String slug) {
        if (slug == null) {
            return null;
        }

        return slug.trim().toLowerCase();
    }

    private String normalizeCountry(String country) {
        if (country == null || country.isBlank()) {
            return "PT";
        }

        return country.trim().toUpperCase();
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return "EUR";
        }

        return currency.trim().toUpperCase();
    }

    private String normalizeLanguage(String language) {
        if (language == null || language.isBlank()) {
            return "pt-PT";
        }

        return language.trim();
    }

    private String normalizeTimezone(String timezone) {
        if (timezone == null || timezone.isBlank()) {
            return "Europe/Lisbon";
        }

        return timezone.trim();
    }

    private TenantResponse toResponse(Tenant tenant) {
        TenantResponse response = new TenantResponse();

        response.setId(tenant.getId());
        response.setName(tenant.getName());
        response.setSlug(tenant.getSlug());
        response.setCountry(tenant.getCountry());
        response.setCurrency(tenant.getCurrency());
        response.setLanguage(tenant.getLanguage());
        response.setTimezone(tenant.getTimezone());
        response.setActive(tenant.getActive());
        response.setCreatedAt(tenant.getCreatedAt());
        response.setUpdatedAt(tenant.getUpdatedAt());

        return response;
    }
}