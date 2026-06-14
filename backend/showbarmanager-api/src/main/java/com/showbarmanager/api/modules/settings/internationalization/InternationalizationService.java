package com.showbarmanager.api.modules.settings.internationalization;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.internationalization.dto.CreateInternationalizationRequest;
import com.showbarmanager.api.modules.settings.internationalization.dto.InternationalizationResponse;
import com.showbarmanager.api.modules.settings.internationalization.dto.UpdateInternationalizationRequest;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class InternationalizationService {

    private final InternationalizationRepository internationalizationRepository;

    public InternationalizationService(
            InternationalizationRepository internationalizationRepository
    ) {
        this.internationalizationRepository = internationalizationRepository;
    }

    public InternationalizationResponse create(CreateInternationalizationRequest request) {
        String normalizedCode = normalizeCode(request.getCode());
        String normalizedCountryCode = normalizeCountryCode(request.getCountryCode());
        String normalizedLanguageCode = normalizeLanguageCode(request.getLanguageCode());

        if (internationalizationRepository.existsByCode(normalizedCode)) {
            throw new BusinessException("Já existe uma configuração internacional com este código.");
        }

        if (internationalizationRepository.existsByCountryCodeAndLanguageCode(
                normalizedCountryCode,
                normalizedLanguageCode
        )) {
            throw new BusinessException("Já existe uma configuração para este país e idioma.");
        }

        Internationalization internationalization = new Internationalization();

        internationalization.setCode(normalizedCode);
        internationalization.setCountryCode(normalizedCountryCode);
        internationalization.setCountryName(normalizeText(request.getCountryName()));
        internationalization.setLanguageCode(normalizedLanguageCode);
        internationalization.setLanguageName(normalizeText(request.getLanguageName()));
        internationalization.setCurrencyCode(normalizeCurrencyCode(request.getCurrencyCode()));
        internationalization.setCurrencySymbol(normalizeText(request.getCurrencySymbol()));
        internationalization.setTimezone(normalizeText(request.getTimezone()));
        internationalization.setTimezoneLabel(normalizeText(request.getTimezoneLabel()));
        internationalization.setDateFormat(normalizeDefault(request.getDateFormat(), "dd/MM/yyyy"));
        internationalization.setTimeFormat(normalizeDefault(request.getTimeFormat(), "HH:mm"));
        internationalization.setFlagEmoji(normalizeText(request.getFlagEmoji()));
        internationalization.setFlagIconUrl(normalizeText(request.getFlagIconUrl()));
        internationalization.setActive(request.getActive() != null ? request.getActive() : true);
        internationalization.setSystemDefault(
                request.getSystemDefault() != null ? request.getSystemDefault() : false
        );
        internationalization.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        if (Boolean.TRUE.equals(internationalization.getSystemDefault())) {
            unsetCurrentSystemDefault();
        }

        Internationalization savedInternationalization =
                internationalizationRepository.save(internationalization);

        return toResponse(savedInternationalization);
    }

    public List<InternationalizationResponse> findAll() {
        return internationalizationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InternationalizationResponse> findActive() {
        return internationalizationRepository
                .findByActiveTrueOrderByPriorityAscCountryNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InternationalizationResponse> findActiveCountries() {
        Map<String, Internationalization> countries = new LinkedHashMap<>();

        internationalizationRepository
                .findByActiveTrueOrderByPriorityAscCountryNameAsc()
                .forEach(item -> countries.putIfAbsent(item.getCountryCode(), item));

        return countries.values()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InternationalizationResponse> findActiveLanguages() {
        Map<String, Internationalization> languages = new LinkedHashMap<>();

        internationalizationRepository
                .findByActiveTrueOrderByPriorityAscCountryNameAsc()
                .forEach(item -> languages.putIfAbsent(item.getLanguageCode(), item));

        return languages.values()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<InternationalizationResponse> findActiveByCountryCode(String countryCode) {
        String normalizedCountryCode = normalizeCountryCode(countryCode);

        return internationalizationRepository
                .findByActiveTrueAndCountryCodeOrderByPriorityAscLanguageNameAsc(
                        normalizedCountryCode
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public InternationalizationResponse findById(UUID id) {
        Internationalization internationalization = findInternationalizationById(id);

        return toResponse(internationalization);
    }

    public InternationalizationResponse update(
            UUID id,
            UpdateInternationalizationRequest request
    ) {
        Internationalization internationalization = findInternationalizationById(id);

        String normalizedCode = normalizeCode(request.getCode());
        String normalizedCountryCode = normalizeCountryCode(request.getCountryCode());
        String normalizedLanguageCode = normalizeLanguageCode(request.getLanguageCode());

        boolean codeChanged =
                !normalizedCode.equalsIgnoreCase(internationalization.getCode());

        if (codeChanged && internationalizationRepository.existsByCode(normalizedCode)) {
            throw new BusinessException("Já existe uma configuração internacional com este código.");
        }

        boolean countryLanguageChanged =
                !normalizedCountryCode.equalsIgnoreCase(internationalization.getCountryCode())
                        || !normalizedLanguageCode.equalsIgnoreCase(
                        internationalization.getLanguageCode()
                );

        if (
                countryLanguageChanged
                        && internationalizationRepository.existsByCountryCodeAndLanguageCode(
                        normalizedCountryCode,
                        normalizedLanguageCode
                )
        ) {
            throw new BusinessException("Já existe uma configuração para este país e idioma.");
        }

        internationalization.setCode(normalizedCode);
        internationalization.setCountryCode(normalizedCountryCode);
        internationalization.setCountryName(normalizeText(request.getCountryName()));
        internationalization.setLanguageCode(normalizedLanguageCode);
        internationalization.setLanguageName(normalizeText(request.getLanguageName()));
        internationalization.setCurrencyCode(normalizeCurrencyCode(request.getCurrencyCode()));
        internationalization.setCurrencySymbol(normalizeText(request.getCurrencySymbol()));
        internationalization.setTimezone(normalizeText(request.getTimezone()));
        internationalization.setTimezoneLabel(normalizeText(request.getTimezoneLabel()));

        if (request.getDateFormat() != null) {
            internationalization.setDateFormat(
                    normalizeDefault(request.getDateFormat(), "dd/MM/yyyy")
            );
        }

        if (request.getTimeFormat() != null) {
            internationalization.setTimeFormat(
                    normalizeDefault(request.getTimeFormat(), "HH:mm")
            );
        }

        internationalization.setFlagEmoji(normalizeText(request.getFlagEmoji()));
        internationalization.setFlagIconUrl(normalizeText(request.getFlagIconUrl()));

        if (request.getActive() != null) {
            internationalization.setActive(request.getActive());
        }

        if (request.getSystemDefault() != null) {
            internationalization.setSystemDefault(request.getSystemDefault());

            if (Boolean.TRUE.equals(request.getSystemDefault())) {
                unsetCurrentSystemDefaultExcept(internationalization.getId());
            }
        }

        if (request.getPriority() != null) {
            internationalization.setPriority(request.getPriority());
        }

        Internationalization savedInternationalization =
                internationalizationRepository.save(internationalization);

        return toResponse(savedInternationalization);
    }

    public void delete(UUID id) {
        Internationalization internationalization = findInternationalizationById(id);

        if (Boolean.TRUE.equals(internationalization.getSystemDefault())) {
            throw new BusinessException("A configuração padrão do sistema não pode ser excluída.");
        }

        internationalizationRepository.delete(internationalization);
    }

    private Internationalization findInternationalizationById(UUID id) {
        return internationalizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Configuração internacional não encontrada."
                ));
    }

    private void unsetCurrentSystemDefault() {
        internationalizationRepository.findBySystemDefaultTrue()
                .ifPresent(currentDefault -> {
                    currentDefault.setSystemDefault(false);
                    internationalizationRepository.save(currentDefault);
                });
    }

    private void unsetCurrentSystemDefaultExcept(UUID currentId) {
        internationalizationRepository.findBySystemDefaultTrue()
                .ifPresent(currentDefault -> {
                    if (!currentDefault.getId().equals(currentId)) {
                        currentDefault.setSystemDefault(false);
                        internationalizationRepository.save(currentDefault);
                    }
                });
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isBlank() ? null : normalized;
    }

    private String normalizeDefault(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }

        return value.trim();
    }

    private String normalizeCode(String code) {
        return code == null ? null : code.trim().toUpperCase();
    }

    private String normalizeCountryCode(String countryCode) {
        return countryCode == null ? null : countryCode.trim().toUpperCase();
    }

    private String normalizeLanguageCode(String languageCode) {
        return languageCode == null ? null : languageCode.trim();
    }

    private String normalizeCurrencyCode(String currencyCode) {
        return currencyCode == null ? null : currencyCode.trim().toUpperCase();
    }

    private InternationalizationResponse toResponse(
            Internationalization internationalization
    ) {
        InternationalizationResponse response = new InternationalizationResponse();

        response.setId(internationalization.getId());
        response.setCode(internationalization.getCode());
        response.setCountryCode(internationalization.getCountryCode());
        response.setCountryName(internationalization.getCountryName());
        response.setLanguageCode(internationalization.getLanguageCode());
        response.setLanguageName(internationalization.getLanguageName());
        response.setCurrencyCode(internationalization.getCurrencyCode());
        response.setCurrencySymbol(internationalization.getCurrencySymbol());
        response.setTimezone(internationalization.getTimezone());
        response.setTimezoneLabel(internationalization.getTimezoneLabel());
        response.setDateFormat(internationalization.getDateFormat());
        response.setTimeFormat(internationalization.getTimeFormat());
        response.setFlagEmoji(internationalization.getFlagEmoji());
        response.setFlagIconUrl(internationalization.getFlagIconUrl());
        response.setActive(internationalization.getActive());
        response.setSystemDefault(internationalization.getSystemDefault());
        response.setPriority(internationalization.getPriority());
        response.setCreatedAt(internationalization.getCreatedAt());
        response.setUpdatedAt(internationalization.getUpdatedAt());

        return response;
    }
}