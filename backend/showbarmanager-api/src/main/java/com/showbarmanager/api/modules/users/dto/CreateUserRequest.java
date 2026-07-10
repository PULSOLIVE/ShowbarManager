package com.showbarmanager.api.modules.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CreateUserRequest {

    @NotNull
    private UUID tenantId;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String phone;

    private String phoneCountryCode;

    private String phoneDialCode;

    @NotBlank
    private String password;

    @NotBlank
    private String role;

    private String language;

    private List<UUID> profileIds = new ArrayList<>();

    private List<UUID> permissionIds = new ArrayList<>();

    public UUID getTenantId() { return tenantId; }
    public String getName() { return name; }
    public @Email @NotBlank String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPhoneCountryCode() { return phoneCountryCode; }
    public String getPhoneDialCode() { return phoneDialCode; }
    public @NotBlank String getPassword() { return password; }
    public @NotBlank String getRole() { return role; }
    public String getLanguage() { return language; }
    public List<UUID> getProfileIds() { return profileIds; }
    public List<UUID> getPermissionIds() { return permissionIds; }

    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    public void setName(String name) { this.name = name; }
    public void setEmail(@Email @NotBlank String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPhoneCountryCode(String phoneCountryCode) { this.phoneCountryCode = phoneCountryCode; }
    public void setPhoneDialCode(String phoneDialCode) { this.phoneDialCode = phoneDialCode; }
    public void setPassword(@NotBlank String password) { this.password = password; }
    public void setRole(@NotBlank String role) { this.role = role; }
    public void setLanguage(String language) { this.language = language; }
    public void setProfileIds(List<UUID> profileIds) { this.profileIds = profileIds; }
    public void setPermissionIds(List<UUID> permissionIds) { this.permissionIds = permissionIds; }
}