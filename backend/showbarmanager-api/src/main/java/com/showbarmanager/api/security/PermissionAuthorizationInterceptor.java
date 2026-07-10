package com.showbarmanager.api.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class PermissionAuthorizationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler
    ) {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RequirePermission annotation = handlerMethod.getMethodAnnotation(RequirePermission.class);

        if (annotation == null) {
            annotation = handlerMethod.getBeanType().getAnnotation(RequirePermission.class);
        }

        if (annotation == null) {
            return true;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Acesso negado.");
        }

        Set<String> authorities = authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toSet());

        if (authorities.contains("ROLE_ADMIN_MASTER") || authorities.contains("ROLE_DEVELOPER_MASTER")) {
            return true;
        }

        boolean allowed;

        if (annotation.requireAll()) {
            allowed = Arrays.stream(annotation.value()).allMatch(authorities::contains);
        } else {
            allowed = Arrays.stream(annotation.value()).anyMatch(authorities::contains);
        }

        if (!allowed) {
            throw new AccessDeniedException("Permissão insuficiente.");
        }

        return true;
    }
}