package com.showbarmanager.api.modules.tenants;

public class UpdateTenantRequest {

    private String name;
    private String slug;
    private String country;
    private String currency;
    private String language;
    private String timezone;
    private Boolean active;

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