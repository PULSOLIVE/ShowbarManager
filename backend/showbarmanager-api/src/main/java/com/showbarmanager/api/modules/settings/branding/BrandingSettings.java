package com.showbarmanager.api.modules.settings.branding;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "branding_settings")
public class BrandingSettings {

    @Id
    private UUID id;

    @Column(name = "setting_key", nullable = false, unique = true, length = 80)
    private String settingKey;

    @Column(name = "public_name", nullable = false, length = 160)
    private String publicName;

    @Column(name = "dark_primary_color", nullable = false, length = 20)
    private String darkPrimaryColor;

    @Column(name = "dark_secondary_color", nullable = false, length = 20)
    private String darkSecondaryColor;

    @Column(name = "dark_background_color", nullable = false, length = 20)
    private String darkBackgroundColor;

    @Column(name = "dark_card_color", nullable = false, length = 20)
    private String darkCardColor;

    @Column(name = "dark_card_soft_color", nullable = false, length = 20)
    private String darkCardSoftColor;

    @Column(name = "dark_surface_color", nullable = false, length = 20)
    private String darkSurfaceColor;

    @Column(name = "dark_text_color", nullable = false, length = 20)
    private String darkTextColor;

    @Column(name = "dark_muted_color", nullable = false, length = 20)
    private String darkMutedColor;

    @Column(name = "dark_border_color", nullable = false, length = 20)
    private String darkBorderColor;

    @Column(name = "dark_success_color", nullable = false, length = 20)
    private String darkSuccessColor;

    @Column(name = "dark_warning_color", nullable = false, length = 20)
    private String darkWarningColor;

    @Column(name = "dark_danger_color", nullable = false, length = 20)
    private String darkDangerColor;

    @Column(name = "light_primary_color", nullable = false, length = 20)
    private String lightPrimaryColor;

    @Column(name = "light_secondary_color", nullable = false, length = 20)
    private String lightSecondaryColor;

    @Column(name = "light_background_color", nullable = false, length = 20)
    private String lightBackgroundColor;

    @Column(name = "light_card_color", nullable = false, length = 20)
    private String lightCardColor;

    @Column(name = "light_card_soft_color", nullable = false, length = 20)
    private String lightCardSoftColor;

    @Column(name = "light_surface_color", nullable = false, length = 20)
    private String lightSurfaceColor;

    @Column(name = "light_text_color", nullable = false, length = 20)
    private String lightTextColor;

    @Column(name = "light_muted_color", nullable = false, length = 20)
    private String lightMutedColor;

    @Column(name = "light_border_color", nullable = false, length = 20)
    private String lightBorderColor;

    @Column(name = "light_success_color", nullable = false, length = 20)
    private String lightSuccessColor;

    @Column(name = "light_warning_color", nullable = false, length = 20)
    private String lightWarningColor;

    @Column(name = "light_danger_color", nullable = false, length = 20)
    private String lightDangerColor;

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSettingKey() { return settingKey; }
    public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

    public String getPublicName() { return publicName; }
    public void setPublicName(String publicName) { this.publicName = publicName; }

    public String getDarkPrimaryColor() { return darkPrimaryColor; }
    public void setDarkPrimaryColor(String darkPrimaryColor) { this.darkPrimaryColor = darkPrimaryColor; }

    public String getDarkSecondaryColor() { return darkSecondaryColor; }
    public void setDarkSecondaryColor(String darkSecondaryColor) { this.darkSecondaryColor = darkSecondaryColor; }

    public String getDarkBackgroundColor() { return darkBackgroundColor; }
    public void setDarkBackgroundColor(String darkBackgroundColor) { this.darkBackgroundColor = darkBackgroundColor; }

    public String getDarkCardColor() { return darkCardColor; }
    public void setDarkCardColor(String darkCardColor) { this.darkCardColor = darkCardColor; }

    public String getDarkCardSoftColor() { return darkCardSoftColor; }
    public void setDarkCardSoftColor(String darkCardSoftColor) { this.darkCardSoftColor = darkCardSoftColor; }

    public String getDarkSurfaceColor() { return darkSurfaceColor; }
    public void setDarkSurfaceColor(String darkSurfaceColor) { this.darkSurfaceColor = darkSurfaceColor; }

    public String getDarkTextColor() { return darkTextColor; }
    public void setDarkTextColor(String darkTextColor) { this.darkTextColor = darkTextColor; }

    public String getDarkMutedColor() { return darkMutedColor; }
    public void setDarkMutedColor(String darkMutedColor) { this.darkMutedColor = darkMutedColor; }

    public String getDarkBorderColor() { return darkBorderColor; }
    public void setDarkBorderColor(String darkBorderColor) { this.darkBorderColor = darkBorderColor; }

    public String getDarkSuccessColor() { return darkSuccessColor; }
    public void setDarkSuccessColor(String darkSuccessColor) { this.darkSuccessColor = darkSuccessColor; }

    public String getDarkWarningColor() { return darkWarningColor; }
    public void setDarkWarningColor(String darkWarningColor) { this.darkWarningColor = darkWarningColor; }

    public String getDarkDangerColor() { return darkDangerColor; }
    public void setDarkDangerColor(String darkDangerColor) { this.darkDangerColor = darkDangerColor; }

    public String getLightPrimaryColor() { return lightPrimaryColor; }
    public void setLightPrimaryColor(String lightPrimaryColor) { this.lightPrimaryColor = lightPrimaryColor; }

    public String getLightSecondaryColor() { return lightSecondaryColor; }
    public void setLightSecondaryColor(String lightSecondaryColor) { this.lightSecondaryColor = lightSecondaryColor; }

    public String getLightBackgroundColor() { return lightBackgroundColor; }
    public void setLightBackgroundColor(String lightBackgroundColor) { this.lightBackgroundColor = lightBackgroundColor; }

    public String getLightCardColor() { return lightCardColor; }
    public void setLightCardColor(String lightCardColor) { this.lightCardColor = lightCardColor; }

    public String getLightCardSoftColor() { return lightCardSoftColor; }
    public void setLightCardSoftColor(String lightCardSoftColor) { this.lightCardSoftColor = lightCardSoftColor; }

    public String getLightSurfaceColor() { return lightSurfaceColor; }
    public void setLightSurfaceColor(String lightSurfaceColor) { this.lightSurfaceColor = lightSurfaceColor; }

    public String getLightTextColor() { return lightTextColor; }
    public void setLightTextColor(String lightTextColor) { this.lightTextColor = lightTextColor; }

    public String getLightMutedColor() { return lightMutedColor; }
    public void setLightMutedColor(String lightMutedColor) { this.lightMutedColor = lightMutedColor; }

    public String getLightBorderColor() { return lightBorderColor; }
    public void setLightBorderColor(String lightBorderColor) { this.lightBorderColor = lightBorderColor; }

    public String getLightSuccessColor() { return lightSuccessColor; }
    public void setLightSuccessColor(String lightSuccessColor) { this.lightSuccessColor = lightSuccessColor; }

    public String getLightWarningColor() { return lightWarningColor; }
    public void setLightWarningColor(String lightWarningColor) { this.lightWarningColor = lightWarningColor; }

    public String getLightDangerColor() { return lightDangerColor; }
    public void setLightDangerColor(String lightDangerColor) { this.lightDangerColor = lightDangerColor; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
