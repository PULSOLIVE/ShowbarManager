package com.showbarmanager.api.security;

import com.showbarmanager.api.exceptions.UnauthorizedException;
import com.showbarmanager.api.modules.users.Role;
import com.showbarmanager.api.modules.users.User;
import com.showbarmanager.api.modules.users.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUserEntity() {
        Authentication authentication = SecurityUtils.getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Usuário não autenticado.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuário autenticado não encontrado."));
    }

    public AuthenticatedUser getCurrentUser() {
        User user = getCurrentUserEntity();

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        return new AuthenticatedUser(
                user.getId(),
                user.getTenant() != null ? user.getTenant().getId() : null,
                user.getName(),
                user.getEmail(),
                roles,
                Boolean.TRUE.equals(user.getMasterUser()),
                Boolean.TRUE.equals(user.getDeveloperUser())
        );
    }

    public UUID getCurrentUserId() {
        return getCurrentUserEntity().getId();
    }

    public UUID getCurrentTenantId() {
        User user = getCurrentUserEntity();

        if (user.getTenant() == null) {
            return null;
        }

        return user.getTenant().getId();
    }

    public List<String> getCurrentRoles() {
        return getCurrentUser().roles();
    }

    public boolean isAdminMaster() {
        return getCurrentUser().roles().contains("ADMIN_MASTER");
    }

    public boolean isDeveloperMaster() {
        return getCurrentUser().roles().contains("DEVELOPER_MASTER");
    }

    public boolean isTenantAdmin() {
        return getCurrentUser().roles().contains("TENANT_ADMIN");
    }
}