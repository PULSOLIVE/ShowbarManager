package com.showbarmanager.api.modules.settings.countries.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreateCountryFiscalRuleRequest {

    @NotBlank(message = "O código do país é obrigatório.")
    @Size(max = 2, message = "O código do país deve ter no máximo 2 caracteres.")
    private String countryCode;

    @NotBlank(message = "O nome do país é obrigatório.")
    @Size(max = 120, message = "O nome do país deve ter no máximo 120 caracteres.")
    private String countryName;

    @NotBlank(message = "A regra fiscal é obrigatória.")
    @Size(max = 120, message = "A regra fiscal deve ter no máximo 120 caracteres.")
    private String taxName;

    @NotBlank(message = "A descrição é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String description;

    @NotEmpty(message = "Informe pelo menos um campo obrigatório.")
    private List<@NotBlank(message = "O campo obrigatório não pode ser vazio.") String> fields;

    private Boolean active = true;

    private Integer priority = 0;

    public String getCountryCode() {
        return countryCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public String getTaxName() {
        return taxName;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getFields() {
        return fields;
    }

    public Boolean getActive() {
        return active;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public void setTaxName(String taxName) {
        this.taxName = taxName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setFields(List<String> fields) {
        this.fields = fields;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}