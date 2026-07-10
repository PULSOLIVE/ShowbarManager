package com.showbarmanager.api.modules.settings.tenantrules.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateTenantEnvironmentRuleRequest {

    @NotBlank(message = "O nome da regra é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    private String name;

    @NotBlank(message = "A descrição da regra é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String description;

    @NotBlank(message = "A chave da regra é obrigatória.")
    @Size(max = 80, message = "A chave da regra deve ter no máximo 80 caracteres.")
    private String ruleKey;

    private Boolean enabled;

    private Integer priority;

    private Boolean systemRule;

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
}