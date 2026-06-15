package com.showbarmanager.api.modules.settings.branding.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BrandingSettingsResponse {

    private UUID id;
    private String publicName;

    private String darkPrimaryColor;
    private String darkSecondaryColor;
    private String darkBackgroundColor;
    private String darkCardColor;
    private String darkCardSoftColor;
    private String darkSurfaceColor;
    private String darkTextColor;
    private String darkMutedColor;
    private String darkBorderColor;
    private String darkSuccessColor;
    private String darkWarningColor;
    private String darkDangerColor;

    private String lightPrimaryColor;
    private String lightSecondaryColor;
    private String lightBackgroundColor;
    private String lightCardColor;
    private String lightCardSoftColor;
    private String lightSurfaceColor;
    private String lightTextColor;
    private String lightMutedColor;
    private String lightBorderColor;
    private String lightSuccessColor;
    private String lightWarningColor;
    private String lightDangerColor;

    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
