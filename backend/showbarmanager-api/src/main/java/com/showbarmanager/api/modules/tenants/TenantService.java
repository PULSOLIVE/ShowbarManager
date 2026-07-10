package com.showbarmanager.api.modules.tenants;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.internationalization.Internationalization;
import com.showbarmanager.api.modules.settings.internationalization.InternationalizationRepository;
import com.showbarmanager.api.modules.tenants.dto.CreateTenantRequest;
import com.showbarmanager.api.modules.tenants.dto.TenantResponse;
import com.showbarmanager.api.modules.tenants.dto.UpdateTenantRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final InternationalizationRepository internationalizationRepository;

    public TenantService(
            TenantRepository tenantRepository,
            InternationalizationRepository internationalizationRepository
    ) {
        this.tenantRepository = tenantRepository;
        this.internationalizationRepository = internationalizationRepository;
    }

    public TenantResponse create(CreateTenantRequest request) {
        String normalizedSlug = normalizeSlug(request.getSlug());

        if (tenantRepository.existsBySlug(normalizedSlug)) {
            throw new BusinessException("Já existe um tenant com este slug.");
        }

        Internationalization internationalization = resolveInternationalization(
                request.getCountry(),
                request.getLanguage(),
                request.getTimezone()
        );

        Tenant tenant = new Tenant();

        tenant.setName(normalizeText(request.getName()));
        tenant.setSlug(normalizedSlug);
        tenant.setCountry(internationalization.getCountryCode());
        tenant.setCurrency(internationalization.getCurrencyCode());
        tenant.setLanguage(internationalization.getLanguageCode());
        tenant.setTimezone(internationalization.getTimezone());
        tenant.setActive(request.getActive() != null ? request.getActive() : true);

        return toResponse(tenantRepository.save(tenant));
    }

    public List<TenantResponse> findAll() {
        return tenantRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TenantResponse findById(UUID id) {
        return toResponse(findTenantById(id));
    }

    public TenantResponse update(UUID id, UpdateTenantRequest request) {
        Tenant tenant = findTenantById(id);

        String normalizedSlug = normalizeSlug(request.getSlug());

        boolean slugChanged =
                !normalizedSlug.equalsIgnoreCase(tenant.getSlug());

        if (slugChanged && tenantRepository.existsBySlug(normalizedSlug)) {
            throw new BusinessException("Já existe outro tenant com este slug.");
        }

        Internationalization internationalization = resolveInternationalization(
                request.getCountry(),
                request.getLanguage(),
                request.getTimezone()
        );

        tenant.setName(normalizeText(request.getName()));
        tenant.setSlug(normalizedSlug);
        tenant.setCountry(internationalization.getCountryCode());
        tenant.setCurrency(internationalization.getCurrencyCode());
        tenant.setLanguage(internationalization.getLanguageCode());
        tenant.setTimezone(internationalization.getTimezone());

        if (request.getActive() != null) {
            tenant.setActive(request.getActive());
        }

        return toResponse(tenantRepository.save(tenant));
    }

    public void delete(UUID id) {
        Tenant tenant = findTenantById(id);

        tenantRepository.delete(tenant);
    }

    private Tenant findTenantById(UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));
    }

    private Internationalization resolveInternationalization(
            String country,
            String language,
            String timezone
    ) {
        String normalizedCountry = normalizeCountry(country);
        String normalizedLanguage = normalizeLanguage(language);
        String normalizedTimezone = normalizeTimezone(timezone);

        List<Internationalization> countryOptions =
                internationalizationRepository
                        .findByActiveTrueAndCountryCodeOrderByPriorityAscLanguageNameAsc(
                                normalizedCountry
                        );

        if (countryOptions.isEmpty()) {
            throw new BusinessException("País não está ativo na internacionalização.");
        }

        return countryOptions.stream()
                .filter(item -> item.getLanguageCode().equalsIgnoreCase(normalizedLanguage))
                .filter(item -> item.getTimezone().equalsIgnoreCase(normalizedTimezone))
                .findFirst()
                .orElseThrow(() -> new BusinessException(
                        "Idioma ou fuso horário não está disponível para este país."
                ));
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isBlank() ? null : normalized;
    }

    private String normalizeSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new BusinessException("O slug do tenant é obrigatório.");
        }

        return slug.trim().toLowerCase();
    }

    private String normalizeCountry(String country) {
        if (country == null || country.isBlank()) {
            return "PT";
        }

        return country.trim().toUpperCase();
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