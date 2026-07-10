package com.showbarmanager.api.modules.settings.tenantrules.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TenantEnvironmentRuleResponse {

    private UUID id;
    private String name;
    private String description;
    private String ruleKey;
    private Boolean enabled;
    private Integer priority;
    private Boolean systemRule;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getRuleKey() {
        return ruleKey;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public Integer getPriority() {
        return priority;
    }

    public Boolean getSystemRule() {
        return systemRule;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRuleKey(String ruleKey) {
        this.ruleKey = ruleKey;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public void setSystemRule(Boolean systemRule) {
        this.systemRule = systemRule;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}