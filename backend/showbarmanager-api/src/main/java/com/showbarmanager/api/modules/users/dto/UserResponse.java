package com.showbarmanager.api.modules.users.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class UserResponse {

    private UUID id;

    private UUID tenantId;

    private String name;

    private String email;

    private Boolean active;

    private Boolean masterUser;

    private Boolean developerUser;

    private Set<String> roles;

    private List<UUID> profileIds = new ArrayList<>();

    private Set<String> profiles;

    private List<UUID> permissionIds = new ArrayList<>();

    private Set<String> permissions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getMasterUser() {
        return masterUser;
    }

    public void setMasterUser(Boolean masterUser) {
        this.masterUser = masterUser;
    }

    public Boolean getDeveloperUser() {
        return developerUser;
    }

    public void setDeveloperUser(Boolean developerUser) {
        this.developerUser = developerUser;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public List<UUID> getProfileIds() {
        return profileIds;
    }

    public void setProfileIds(List<UUID> profileIds) {
        this.profileIds = profileIds;
    }

    public Set<String> getProfiles() {
        return profiles;
    }

    public void setProfiles(Set<String> profiles) {
        this.profiles = profiles;
    }

    public List<UUID> getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(List<UUID> permissionIds) {
        this.permissionIds = permissionIds;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}