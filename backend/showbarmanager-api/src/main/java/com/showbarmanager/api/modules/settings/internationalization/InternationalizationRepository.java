package com.showbarmanager.api.modules.settings.internationalization;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InternationalizationRepository
        extends JpaRepository<Internationalization, UUID> {

    Optional<Internationalization> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCountryCodeAndLanguageCode(
            String countryCode,
            String languageCode
    );

    List<Internationalization> findByActiveTrueOrderByPriorityAscCountryNameAsc();

    List<Internationalization> findByActiveTrueAndCountryCodeOrderByPriorityAscLanguageNameAsc(
            String countryCode
    );

    Optional<Internationalization> findBySystemDefaultTrue();
}