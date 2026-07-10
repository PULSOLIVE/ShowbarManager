package com.showbarmanager.api.modules.settings.countries;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "country_fiscal_rules")
public class CountryFiscalRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "country_code", nullable = false, unique = true, length = 2)
    private String countryCode;

    @Column(name = "country_name", nullable = false, length = 120)
    private String countryName;

    @Column(name = "tax_name", nullable = false, length = 120)
    private String taxName;

    @Column(nullable = false, length = 500)
    private String description;

    @ElementCollection
    @CollectionTable(
            name = "country_fiscal_rule_fields",
            joinColumns = @JoinColumn(name = "country_fiscal_rule_id")
    )
    @Column(name = "field_name", nullable = false, length = 120)
    private List<String> fields = new ArrayList<>();

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Integer priority = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (fields == null) {
            fields = new ArrayList<>();
        }

        if (active == null) {
            active = true;
        }

        if (priority == null) {
            priority = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();

        if (fields == null) {
            fields = new ArrayList<>();
        }
    }

    public UUID getId() {
        return id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}