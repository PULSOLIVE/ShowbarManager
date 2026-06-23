package com.showbarmanager.api.modules.users.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class UserResponse {

    private UUID id;
    private UUID tenantId;
    private String name;
    private String email;
    private String phone;
    private String language;
    private Boolean active;
    private Boolean masterUser;
    private Boolean developerUser;
    private Set<String> roles;
    private List<UUID> profileIds = new ArrayList<>();
    private Set<String> profiles;
    private List<UUID> permissionIds = new ArrayList<>();
    private Set<String> permissions;
    private Set<String> effectivePermissions = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getId() { return id; }
    public UUID getTenantId() { return tenantId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getLanguage() { return language; }
    public Boolean getActive() { return active; }
    public Boolean getMasterUser() { return masterUser; }
    public Boolean getDeveloperUser() { return developerUser; }
    public Set<String> getRoles() { return roles; }
    public List<UUID> getProfileIds() { return profileIds; }
    public Set<String> getProfiles() { return profiles; }
    public List<UUID> getPermissionIds() { return permissionIds; }
    public Set<String> getPermissions() { return permissions; }
    public Set<String> getEffectivePermissions() { return effectivePermissions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(UUID id) { this.id = id; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLanguage(String language) { this.language = language; }
    public void setActive(Boolean active) { this.active = active; }
    public void setMasterUser(Boolean masterUser) { this.masterUser = masterUser; }
    public void setDeveloperUser(Boolean developerUser) { this.developerUser = developerUser; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public void setProfileIds(List<UUID> profileIds) { this.profileIds = profileIds; }
    public void setProfiles(Set<String> profiles) { this.profiles = profiles; }
    public void setPermissionIds(List<UUID> permissionIds) { this.permissionIds = permissionIds; }
    public void setPermissions(Set<String> permissions) { this.permissions = permissions; }
    public void setEffectivePermissions(Set<String> effectivePermissions) { this.effectivePermissions = effectivePermissions; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}