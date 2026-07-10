package com.showbarmanager.api.security;

import com.showbarmanager.api.modules.settings.permissions.Permission;
import com.showbarmanager.api.modules.settings.profiles.Profile;
import com.showbarmanager.api.modules.users.Role;
import com.showbarmanager.api.modules.users.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RbacAuthorityService {

    public Set<SimpleGrantedAuthority> buildAuthorities(User user) {
        Set<String> authorities = new HashSet<>();

        user.getRoles()
                .stream()
                .map(Role::getName)
                .map(role -> "ROLE_" + role)
                .forEach(authorities::add);

        authorities.addAll(resolveEffectivePermissionCodes(user));

        return authorities
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    public Set<String> resolveEffectivePermissionCodes(User user) {
        Set<String> effectivePermissions = new HashSet<>();

        user.getProfiles()
                .stream()
                .filter(profile -> Boolean.TRUE.equals(profile.getActive()))
                .flatMap(profile -> profile.getPermissions().stream())
                .filter(permission -> Boolean.TRUE.equals(permission.getActive()))
                .map(Permission::getCode)
                .forEach(effectivePermissions::add);

        user.getPermissions()
                .stream()
                .filter(permission -> Boolean.TRUE.equals(permission.getActive()))
                .map(Permission::getCode)
                .forEach(effectivePermissions::add);

        return effectivePermissions;
    }
}