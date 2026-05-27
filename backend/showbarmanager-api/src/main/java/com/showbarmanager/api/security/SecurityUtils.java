package com.showbarmanager.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static boolean isAuthenticated() {
        Authentication authentication = getAuthentication();

        return authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal());
    }

    public static String getCurrentUsername() {
        Authentication authentication = getAuthentication();

        if (authentication == null) {
            return null;
        }

        return authentication.getName();
    }

    public static boolean hasRole(String role) {
        Authentication authentication = getAuthentication();

        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_" + role)
                );
    }

    public static boolean isAdminMaster() {
        return hasRole("ADMIN_MASTER");
    }

    public static boolean isDeveloperMaster() {
        return hasRole("DEVELOPER_MASTER");
    }

    public static boolean isTenantAdmin() {
        return hasRole("TENANT_ADMIN");
    }
}