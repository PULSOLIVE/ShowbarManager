package com.showbarmanager.api.modules.settings.branding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateBrandingSettingsRequest {

    @NotBlank
    @Size(max = 160)
    private String publicName;

    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkPrimaryColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkSecondaryColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkAccentColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkBackgroundColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkCardColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkCardSoftColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkSurfaceColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkTextColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkMutedColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkBorderColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkSuccessColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkWarningColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String darkDangerColor;

    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightPrimaryColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightSecondaryColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightAccentColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightBackgroundColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightCardColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightCardSoftColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightSurfaceColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightTextColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightMutedColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightBorderColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightSuccessColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightWarningColor;
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") private String lightDangerColor;

    private Boolean active;

    public String getPublicName() { return publicName; }
    public void setPublicName(String publicName) { this.publicName = publicName; }

    public String getDarkPrimaryColor() { return darkPrimaryColor; }
    public void setDarkPrimaryColor(String darkPrimaryColor) { this.darkPrimaryColor = darkPrimaryColor; }

    public String getDarkSecondaryColor() { return darkSecondaryColor; }
    public void setDarkSecondaryColor(String darkSecondaryColor) { this.darkSecondaryColor = darkSecondaryColor; }

    public String getDarkAccentColor() { return darkAccentColor; }
    public void setDarkAccentColor(String darkAccentColor) { this.darkAccentColor = darkAccentColor; }

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

    public String getLightAccentColor() { return lightAccentColor; }
    public void setLightAccentColor(String lightAccentColor) { this.lightAccentColor = lightAccentColor; }

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
}