package com.showbarmanager.api.modules.settings.internationalization;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "internationalizations")
public class Internationalization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "country_code", nullable = false, length = 2)
    private String countryCode;

    @Column(name = "country_name", nullable = false, length = 120)
    private String countryName;

    @Column(name = "language_code", nullable = false, length = 20)
    private String languageCode;

    @Column(name = "language_name", nullable = false, length = 120)
    private String languageName;

    @Column(name = "currency_code", nullable = false, length = 3)
    private String currencyCode;

    @Column(name = "currency_symbol", nullable = false, length = 10)
    private String currencySymbol;

    @Column(nullable = false, length = 80)
    private String timezone;

    @Column(name = "timezone_label", nullable = false, length = 120)
    private String timezoneLabel;

    @Column(name = "date_format", nullable = false, length = 30)
    private String dateFormat = "dd/MM/yyyy";

    @Column(name = "time_format", nullable = false, length = 20)
    private String timeFormat = "HH:mm";

    @Column(name = "flag_emoji", length = 10)
    private String flagEmoji;

    @Column(name = "flag_icon_url", length = 255)
    private String flagIconUrl;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "system_default", nullable = false)
    private Boolean systemDefault = false;

    @Column(nullable = false)
    private Integer priority = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (active == null) {
            active = true;
        }

        if (systemDefault == null) {
            systemDefault = false;
        }

        if (priority == null) {
            priority = 0;
        }

        if (dateFormat == null || dateFormat.isBlank()) {
            dateFormat = "dd/MM/yyyy";
        }

        if (timeFormat == null || timeFormat.isBlank()) {
            timeFormat = "HH:mm";
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}