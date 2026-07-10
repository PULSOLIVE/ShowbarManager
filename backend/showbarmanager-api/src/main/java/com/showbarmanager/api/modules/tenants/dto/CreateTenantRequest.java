package com.showbarmanager.api.modules.tenants.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTenantRequest {

    @NotBlank(message = "O nome do tenant é obrigatório.")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres.")
    private String name;

    @NotBlank(message = "O slug do tenant é obrigatório.")
    @Size(max = 100, message = "O slug deve ter no máximo 100 caracteres.")
    private String slug;

    @Size(max = 2, message = "O país deve ter no máximo 2 caracteres.")
    private String country = "PT";

    @Size(max = 3, message = "A moeda deve ter no máximo 3 caracteres.")
    private String currency = "EUR";

    @Size(max = 10, message = "O idioma deve ter no máximo 10 caracteres.")
    private String language = "pt-PT";

    @Size(max = 80, message = "O timezone deve ter no máximo 80 caracteres.")
    private String timezone = "Europe/Lisbon";

    private Boolean active = true;

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getCountry() {
        return country;
    }

    public String getCurrency() {
        return currency;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimezone() {
        return timezone;
    }

    public Boolean getActive() {
        return active;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}