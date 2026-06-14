package com.showbarmanager.api.modules.settings.tenantrules;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenant_environment_rules")
public class TenantEnvironmentRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "rule_key", nullable = false, unique = true, length = 80)
    private String ruleKey;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false)
    private Integer priority = 0;

    @Column(name = "system_rule", nullable = false)
    private Boolean systemRule = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (enabled == null) {
            enabled = true;
        }

        if (priority == null) {
            priority = 0;
        }

        if (systemRule == null) {
            systemRule = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
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

    public void setId(UUID id) {
        this.id = id;
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