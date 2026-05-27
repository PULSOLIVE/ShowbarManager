package com.showbarmanager.api.security;

import java.util.List;
import java.util.UUID;

public record AuthenticatedUser(

        UUID userId,
        UUID tenantId,
        String name,
        String email,
        List<String> roles,
        boolean masterUser,
        boolean developerUser

) {
}