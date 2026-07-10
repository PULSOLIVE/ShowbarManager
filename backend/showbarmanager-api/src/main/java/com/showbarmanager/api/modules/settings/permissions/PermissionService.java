package com.showbarmanager.api.modules.settings.permissions;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.permissions.dto.CreatePermissionRequest;
import com.showbarmanager.api.modules.settings.permissions.dto.PermissionResponse;
import com.showbarmanager.api.modules.settings.permissions.dto.UpdatePermissionRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public PermissionResponse create(CreatePermissionRequest request) {
        String normalizedCode = normalizeCode(request.getCode());

        if (permissionRepository.existsByCode(normalizedCode)) {
            throw new BusinessException("Já existe uma permissão com este código.");
        }

        Permission permission = new Permission();
        permission.setCode(normalizedCode);
        permission.setName(request.getName());
        permission.setModule(normalizeCode(request.getModule()));
        permission.setAction(normalizeCode(request.getAction()));
        permission.setDescription(request.getDescription());
        permission.setActive(request.getActive() != null ? request.getActive() : true);
        permission.setSystemPermission(request.getSystemPermission() != null ? request.getSystemPermission() : false);
        permission.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        Permission savedPermission = permissionRepository.save(permission);

        return toResponse(savedPermission);
    }

    public List<PermissionResponse> findAll() {
        return permissionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PermissionResponse findById(UUID id) {
        Permission permission = findPermissionById(id);

        return toResponse(permission);
    }

    public PermissionResponse update(UUID id, UpdatePermissionRequest request) {
        Permission permission = findPermissionById(id);

        permission.setName(request.getName());
        permission.setModule(normalizeCode(request.getModule()));
        permission.setAction(normalizeCode(request.getAction()));
        permission.setDescription(request.getDescription());

        if (request.getActive() != null) {
            permission.setActive(request.getActive());
        }

        if (request.getSystemPermission() != null) {
            permission.setSystemPermission(request.getSystemPermission());
        }

        if (request.getPriority() != null) {
            permission.setPriority(request.getPriority());
        }

        Permission savedPermission = permissionRepository.save(permission);

        return toResponse(savedPermission);
    }

    public void delete(UUID id) {
        Permission permission = findPermissionById(id);

        if (Boolean.TRUE.equals(permission.getSystemPermission())) {
            throw new BusinessException("Permissão de sistema não pode ser excluída.");
        }

        permissionRepository.delete(permission);
    }

    private Permission findPermissionById(UUID id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permissão não encontrada."));
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }

    private PermissionResponse toResponse(Permission permission) {
        PermissionResponse response = new PermissionResponse();

        response.setId(permission.getId());
        response.setCode(permission.getCode());
        response.setName(permission.getName());
        response.setModule(permission.getModule());
        response.setAction(permission.getAction());
        response.setDescription(permission.getDescription());
        response.setActive(permission.getActive());
        response.setSystemPermission(permission.getSystemPermission());
        response.setPriority(permission.getPriority());
        response.setCreatedAt(permission.getCreatedAt());
        response.setUpdatedAt(permission.getUpdatedAt());

        return response;
    }
}