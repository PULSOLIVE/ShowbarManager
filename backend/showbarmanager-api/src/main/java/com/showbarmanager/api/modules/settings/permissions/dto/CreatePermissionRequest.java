package com.showbarmanager.api.modules.settings.permissions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePermissionRequest {

    @NotBlank(message = "O código da permissão é obrigatório.")
    @Size(max = 100, message = "O código deve ter no máximo 100 caracteres.")
    private String code;

    @NotBlank(message = "O nome da permissão é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    private String name;

    @NotBlank(message = "O módulo da permissão é obrigatório.")
    @Size(max = 80, message = "O módulo deve ter no máximo 80 caracteres.")
    private String module;

    @NotBlank(message = "A ação da permissão é obrigatória.")
    @Size(max = 80, message = "A ação deve ter no máximo 80 caracteres.")
    private String action;

    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String description;

    private Boolean active = true;

    private Boolean systemPermission = false;

    private Integer priority = 0;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getSystemPermission() { return systemPermission; }
    public void setSystemPermission(Boolean systemPermission) { this.systemPermission = systemPermission; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
}