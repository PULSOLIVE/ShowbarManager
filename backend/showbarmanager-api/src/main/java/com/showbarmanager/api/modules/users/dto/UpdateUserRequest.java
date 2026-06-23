package com.showbarmanager.api.modules.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class UpdateUserRequest {

    @NotBlank(message = "O nome e obrigatorio.")
    private String name;

    @NotBlank(message = "O e-mail e obrigatorio.")
    @Email(message = "Informe um e-mail valido.")
    private String email;

    private String phone;

    @NotBlank(message = "O perfil e obrigatorio.")
    private String role;

    private String language;

    private Boolean active;

    private List<UUID> profileIds = new ArrayList<>();

    private List<UUID> permissionIds = new ArrayList<>();

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public String getLanguage() { return language; }
    public Boolean getActive() { return active; }
    public List<UUID> getProfileIds() { return profileIds; }
    public List<UUID> getPermissionIds() { return permissionIds; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setRole(String role) { this.role = role; }
    public void setLanguage(String language) { this.language = language; }
    public void setActive(Boolean active) { this.active = active; }
    public void setProfileIds(List<UUID> profileIds) { this.profileIds = profileIds; }
    public void setPermissionIds(List<UUID> permissionIds) { this.permissionIds = permissionIds; }
}