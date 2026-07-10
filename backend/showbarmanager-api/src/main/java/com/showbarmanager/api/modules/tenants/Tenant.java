package com.showbarmanager.api.modules.tenants;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 2)
    private String country = "PT";

    @Column(nullable = false, length = 3)
    private String currency = "EUR";

    @Column(nullable = false, length = 10)
    private String language = "pt-PT";

    @Column(nullable = false, length = 80)
    private String timezone = "Europe/Lisbon";

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Tenant() {
    }

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();

        if (this.active == null) {
            this.active = true;
        }

        if (this.country == null || this.country.isBlank()) {
            this.country = "PT";
        }

        if (this.currency == null || this.currency.isBlank()) {
            this.currency = "EUR";
        }

        if (this.language == null || this.language.isBlank()) {
            this.language = "pt-PT";
        }

        if (this.timezone == null || this.timezone.isBlank()) {
            this.timezone = "Europe/Lisbon";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}