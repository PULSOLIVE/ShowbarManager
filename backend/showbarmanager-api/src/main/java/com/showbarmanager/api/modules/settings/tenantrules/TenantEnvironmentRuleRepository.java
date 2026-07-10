package com.showbarmanager.api.modules.settings.tenantrules;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantEnvironmentRuleRepository
        extends JpaRepository<TenantEnvironmentRule, UUID> {

    boolean existsByRuleKey(String ruleKey);

    Optional<TenantEnvironmentRule> findByRuleKey(String ruleKey);

    List<TenantEnvironmentRule> findAllByOrderByPriorityAscNameAsc();

    List<TenantEnvironmentRule> findByEnabledTrueOrderByPriorityAscNameAsc();
}