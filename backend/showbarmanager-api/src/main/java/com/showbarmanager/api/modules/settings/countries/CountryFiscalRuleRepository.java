package com.showbarmanager.api.modules.settings.countries;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CountryFiscalRuleRepository
        extends JpaRepository<CountryFiscalRule, UUID> {

    boolean existsByCountryCode(String countryCode);

    Optional<CountryFiscalRule> findByCountryCode(String countryCode);

    List<CountryFiscalRule> findByActiveTrueOrderByPriorityAscCountryNameAsc();

    List<CountryFiscalRule> findAllByOrderByPriorityAscCountryNameAsc();
}