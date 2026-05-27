package com.showbarmanager.api.modules.auth.dto;

import java.util.Set;
import java.util.UUID;

public class LoginResponse {

    private String token;

    private String tokenType = "Bearer";

    private UUID userId;

    private UUID tenantId;

    private String name;

    private String email;

    private Set<String> roles;

    private Boolean masterUser;

    private Boolean developerUser;

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public Boolean getMasterUser() {
        return masterUser;
    }

    public Boolean getDeveloperUser() {
        return developerUser;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public void setMasterUser(Boolean masterUser) {
        this.masterUser = masterUser;
    }

    public void setDeveloperUser(Boolean developerUser) {
        this.developerUser = developerUser;
    }
}