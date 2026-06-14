package com.showbarmanager.api.modules.settings.tenantrules;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.tenantrules.dto.CreateTenantEnvironmentRuleRequest;
import com.showbarmanager.api.modules.settings.tenantrules.dto.TenantEnvironmentRuleResponse;
import com.showbarmanager.api.modules.settings.tenantrules.dto.UpdateTenantEnvironmentRuleRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TenantEnvironmentRuleService {

    private final TenantEnvironmentRuleRepository tenantEnvironmentRuleRepository;

    public TenantEnvironmentRuleService(
            TenantEnvironmentRuleRepository tenantEnvironmentRuleRepository
    ) {
        this.tenantEnvironmentRuleRepository = tenantEnvironmentRuleRepository;
    }

    public TenantEnvironmentRuleResponse create(CreateTenantEnvironmentRuleRequest request) {
        String normalizedRuleKey = normalizeRuleKey(request.getRuleKey());

        if (tenantEnvironmentRuleRepository.existsByRuleKey(normalizedRuleKey)) {
            throw new BusinessException("Já existe uma regra com esta chave.");
        }

        TenantEnvironmentRule rule = new TenantEnvironmentRule();

        rule.setName(normalizeText(request.getName()));
        rule.setDescription(normalizeText(request.getDescription()));
        rule.setRuleKey(normalizedRuleKey);
        rule.setEnabled(request.getEnabled() != null ? request.getEnabled() : true);
        rule.setPriority(request.getPriority() != null ? request.getPriority() : 0);
        rule.setSystemRule(request.getSystemRule() != null ? request.getSystemRule() : false);

        return toResponse(tenantEnvironmentRuleRepository.save(rule));
    }

    public List<TenantEnvironmentRuleResponse> findAll() {
        return tenantEnvironmentRuleRepository
                .findAllByOrderByPriorityAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TenantEnvironmentRuleResponse> findEnabled() {
        return tenantEnvironmentRuleRepository
                .findByEnabledTrueOrderByPriorityAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TenantEnvironmentRuleResponse findById(UUID id) {
        return toResponse(findRuleById(id));
    }

    public TenantEnvironmentRuleResponse update(
            UUID id,
            UpdateTenantEnvironmentRuleRequest request
    ) {
        TenantEnvironmentRule rule = findRuleById(id);

        String normalizedRuleKey = normalizeRuleKey(request.getRuleKey());

        boolean ruleKeyChanged =
                !normalizedRuleKey.equalsIgnoreCase(rule.getRuleKey());

        if (
                ruleKeyChanged
                        && tenantEnvironmentRuleRepository.existsByRuleKey(normalizedRuleKey)
        ) {
            throw new BusinessException("Já existe uma regra com esta chave.");
        }

        rule.setName(normalizeText(request.getName()));
        rule.setDescription(normalizeText(request.getDescription()));
        rule.setRuleKey(normalizedRuleKey);

        if (request.getEnabled() != null) {
            rule.setEnabled(request.getEnabled());
        }

        if (request.getPriority() != null) {
            rule.setPriority(request.getPriority());
        }

        if (request.getSystemRule() != null) {
            rule.setSystemRule(request.getSystemRule());
        }

        return toResponse(tenantEnvironmentRuleRepository.save(rule));
    }

    public void delete(UUID id) {
        TenantEnvironmentRule rule = findRuleById(id);

        tenantEnvironmentRuleRepository.delete(rule);
    }

    private TenantEnvironmentRule findRuleById(UUID id) {
        return tenantEnvironmentRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Regra de ambiente não encontrada."
                ));
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isBlank() ? null : normalized;
    }

    private String normalizeRuleKey(String value) {
        if (value == null) {
            return null;
        }

        return value
                .trim()
                .replaceAll("[^a-zA-Z0-9_\\-\\s]", "")
                .replaceAll("\\s+", "_")
                .replaceAll("-+", "_")
                .replaceAll("_+", "_")
                .toUpperCase();
    }

    private TenantEnvironmentRuleResponse toResponse(TenantEnvironmentRule rule) {
        TenantEnvironmentRuleResponse response = new TenantEnvironmentRuleResponse();

        response.setId(rule.getId());
        response.setName(rule.getName());
        response.setDescription(rule.getDescription());
        response.setRuleKey(rule.getRuleKey());
        response.setEnabled(rule.getEnabled());
        response.setPriority(rule.getPriority());
        response.setSystemRule(rule.getSystemRule());
        response.setCreatedAt(rule.getCreatedAt());
        response.setUpdatedAt(rule.getUpdatedAt());

        return response;
    }
}