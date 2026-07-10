package com.showbarmanager.api.modules.settings.countries;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.countries.dto.CountryFiscalRuleResponse;
import com.showbarmanager.api.modules.settings.countries.dto.CreateCountryFiscalRuleRequest;
import com.showbarmanager.api.modules.settings.countries.dto.UpdateCountryFiscalRuleRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CountryFiscalRuleService {

    private final CountryFiscalRuleRepository countryFiscalRuleRepository;

    public CountryFiscalRuleService(
            CountryFiscalRuleRepository countryFiscalRuleRepository
    ) {
        this.countryFiscalRuleRepository = countryFiscalRuleRepository;
    }

    public CountryFiscalRuleResponse create(CreateCountryFiscalRuleRequest request) {
        String normalizedCountryCode = normalizeCountryCode(request.getCountryCode());

        if (countryFiscalRuleRepository.existsByCountryCode(normalizedCountryCode)) {
            throw new BusinessException("Já existe regra fiscal para este país.");
        }

        CountryFiscalRule rule = new CountryFiscalRule();

        rule.setCountryCode(normalizedCountryCode);
        rule.setCountryName(normalizeText(request.getCountryName()));
        rule.setTaxName(normalizeText(request.getTaxName()));
        rule.setDescription(normalizeText(request.getDescription()));
        rule.setFields(normalizeFields(request.getFields()));
        rule.setActive(request.getActive() != null ? request.getActive() : true);
        rule.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        return toResponse(countryFiscalRuleRepository.save(rule));
    }

    public List<CountryFiscalRuleResponse> findAll() {
        return countryFiscalRuleRepository
                .findAllByOrderByPriorityAscCountryNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<CountryFiscalRuleResponse> findActive() {
        return countryFiscalRuleRepository
                .findByActiveTrueOrderByPriorityAscCountryNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CountryFiscalRuleResponse findById(UUID id) {
        return toResponse(findRuleById(id));
    }

    public CountryFiscalRuleResponse findByCountryCode(String countryCode) {
        String normalizedCountryCode = normalizeCountryCode(countryCode);

        CountryFiscalRule rule = countryFiscalRuleRepository
                .findByCountryCode(normalizedCountryCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Regra fiscal do país não encontrada."
                ));

        return toResponse(rule);
    }

    public CountryFiscalRuleResponse update(
            UUID id,
            UpdateCountryFiscalRuleRequest request
    ) {
        CountryFiscalRule rule = findRuleById(id);

        String normalizedCountryCode = normalizeCountryCode(request.getCountryCode());

        boolean countryChanged =
                !normalizedCountryCode.equalsIgnoreCase(rule.getCountryCode());

        if (countryChanged && countryFiscalRuleRepository.existsByCountryCode(normalizedCountryCode)) {
            throw new BusinessException("Já existe regra fiscal para este país.");
        }

        rule.setCountryCode(normalizedCountryCode);
        rule.setCountryName(normalizeText(request.getCountryName()));
        rule.setTaxName(normalizeText(request.getTaxName()));
        rule.setDescription(normalizeText(request.getDescription()));
        rule.setFields(normalizeFields(request.getFields()));

        if (request.getActive() != null) {
            rule.setActive(request.getActive());
        }

        if (request.getPriority() != null) {
            rule.setPriority(request.getPriority());
        }

        return toResponse(countryFiscalRuleRepository.save(rule));
    }

    public void delete(UUID id) {
        CountryFiscalRule rule = findRuleById(id);
        countryFiscalRuleRepository.delete(rule);
    }

    private CountryFiscalRule findRuleById(UUID id) {
        return countryFiscalRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Regra fiscal do país não encontrada."
                ));
    }

    private String normalizeCountryCode(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isBlank() ? null : normalized;
    }

    private List<String> normalizeFields(List<String> fields) {
        if (fields == null) {
            return new ArrayList<>();
        }

        return fields.stream()
                .map(this::normalizeText)
                .filter(field -> field != null && !field.isBlank())
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private CountryFiscalRuleResponse toResponse(CountryFiscalRule rule) {
        CountryFiscalRuleResponse response = new CountryFiscalRuleResponse();

        response.setId(rule.getId());
        response.setCountryCode(rule.getCountryCode());
        response.setCountryName(rule.getCountryName());
        response.setTaxName(rule.getTaxName());
        response.setDescription(rule.getDescription());
        response.setFields(rule.getFields());
        response.setActive(rule.getActive());
        response.setPriority(rule.getPriority());
        response.setCreatedAt(rule.getCreatedAt());
        response.setUpdatedAt(rule.getUpdatedAt());

        return response;
    }
}