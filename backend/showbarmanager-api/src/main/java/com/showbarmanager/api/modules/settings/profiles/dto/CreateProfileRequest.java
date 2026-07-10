package com.showbarmanager.api.modules.settings.profiles.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CreateProfileRequest {

    @NotBlank(message = "O código do perfil é obrigatório.")
    @Size(max = 80, message = "O código deve ter no máximo 80 caracteres.")
    private String code;

    @NotBlank(message = "O nome do perfil é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    private String name;

    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String description;

    private Boolean active = true;

    private Boolean systemProfile = false;

    private Integer priority = 0;

    private List<UUID> permissionIds = new ArrayList<>();

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getSystemProfile() {
        return systemProfile;
    }

    public void setSystemProfile(Boolean systemProfile) {
        this.systemProfile = systemProfile;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public List<UUID> getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(List<UUID> permissionIds) {
        this.permissionIds = permissionIds != null ? permissionIds : new ArrayList<>();
    }
}