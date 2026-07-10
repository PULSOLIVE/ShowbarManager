package com.showbarmanager.api.modules.settings.internationalization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateInternationalizationRequest {

    @NotBlank(message = "O código da internacionalização é obrigatório.")
    @Size(max = 20, message = "O código deve ter no máximo 20 caracteres.")
    private String code;

    @NotBlank(message = "O código do país é obrigatório.")
    @Size(max = 2, message = "O código do país deve ter no máximo 2 caracteres.")
    private String countryCode;

    @NotBlank(message = "O nome do país é obrigatório.")
    @Size(max = 120, message = "O nome do país deve ter no máximo 120 caracteres.")
    private String countryName;

    @NotBlank(message = "O código do idioma é obrigatório.")
    @Size(max = 20, message = "O código do idioma deve ter no máximo 20 caracteres.")
    private String languageCode;

    @NotBlank(message = "O nome do idioma é obrigatório.")
    @Size(max = 120, message = "O nome do idioma deve ter no máximo 120 caracteres.")
    private String languageName;

    @NotBlank(message = "O código da moeda é obrigatório.")
    @Size(max = 3, message = "O código da moeda deve ter no máximo 3 caracteres.")
    private String currencyCode;

    @NotBlank(message = "O símbolo da moeda é obrigatório.")
    @Size(max = 10, message = "O símbolo da moeda deve ter no máximo 10 caracteres.")
    private String currencySymbol;

    @NotBlank(message = "O timezone é obrigatório.")
    @Size(max = 80, message = "O timezone deve ter no máximo 80 caracteres.")
    private String timezone;

    @NotBlank(message = "O nome amigável do timezone é obrigatório.")
    @Size(max = 120, message = "O nome amigável do timezone deve ter no máximo 120 caracteres.")
    private String timezoneLabel;

    @Size(max = 30, message = "O formato da data deve ter no máximo 30 caracteres.")
    private String dateFormat;

    @Size(max = 20, message = "O formato da hora deve ter no máximo 20 caracteres.")
    private String timeFormat;

    @Size(max = 10, message = "A bandeira deve ter no máximo 10 caracteres.")
    private String flagEmoji;

    @Size(max = 255, message = "A URL do ícone da bandeira deve ter no máximo 255 caracteres.")
    private String flagIconUrl;

    private Boolean active;

    private Boolean systemDefault;

    private Integer priority;

    public String getCode() {
        return code;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public String getLanguageCode() {
        return languageCode;
    }

    public String getLanguageName() {
        return languageName;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public String getCurrencySymbol() {
        return currencySymbol;
    }

    public String getTimezone() {
        return timezone;
    }

    public String getTimezoneLabel() {
        return timezoneLabel;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public String getTimeFormat() {
        return timeFormat;
    }

    public String getFlagEmoji() {
        return flagEmoji;
    }

    public String getFlagIconUrl() {
        return flagIconUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public Boolean getSystemDefault() {
        return systemDefault;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public void setLanguageName(String languageName) {
        this.languageName = languageName;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public void setCurrencySymbol(String currencySymbol) {
        this.currencySymbol = currencySymbol;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public void setTimezoneLabel(String timezoneLabel) {
        this.timezoneLabel = timezoneLabel;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public void setTimeFormat(String timeFormat) {
        this.timeFormat = timeFormat;
    }

    public void setFlagEmoji(String flagEmoji) {
        this.flagEmoji = flagEmoji;
    }

    public void setFlagIconUrl(String flagIconUrl) {
        this.flagIconUrl = flagIconUrl;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setSystemDefault(Boolean systemDefault) {
        this.systemDefault = systemDefault;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}