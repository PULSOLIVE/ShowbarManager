package com.showbarmanager.api.modules.users;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.permissions.Permission;
import com.showbarmanager.api.modules.settings.permissions.PermissionRepository;
import com.showbarmanager.api.modules.settings.profiles.Profile;
import com.showbarmanager.api.modules.settings.profiles.ProfileRepository;
import com.showbarmanager.api.modules.tenants.Tenant;
import com.showbarmanager.api.modules.tenants.TenantRepository;
import com.showbarmanager.api.modules.users.dto.CreateUserRequest;
import com.showbarmanager.api.modules.users.dto.UpdateUserRequest;
import com.showbarmanager.api.modules.users.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantRepository tenantRepository;
    private final ProfileRepository profileRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            TenantRepository tenantRepository,
            ProfileRepository profileRepository,
            PermissionRepository permissionRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tenantRepository = tenantRepository;
        this.profileRepository = profileRepository;
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String normalizedPhone = normalizePhone(request.getPhone());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BusinessException("Já existe um usuário com este e-mail.");
        }

        if (normalizedPhone != null && userRepository.existsByPhone(normalizedPhone)) {
            throw new BusinessException("Já existe um usuário com este telefone.");
        }

        Tenant tenant = tenantRepository.findById(request.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada."));

        User user = new User();
        user.setTenant(tenant);
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPhone(normalizedPhone);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLanguage(normalizeLanguage(request.getLanguage()));
        user.setRoles(new HashSet<>(Set.of(role)));
        user.setProfiles(resolveProfiles(request.getProfileIds()));
        user.setPermissions(resolvePermissions(request.getPermissionIds()));
        user.setActive(true);

        applySpecialUserFlags(user, role);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        User user = findUserById(id);

        return toResponse(user);
    }

    @Transactional
    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = findUserById(id);

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String normalizedPhone = normalizePhone(request.getPhone());
        boolean emailChanged = !user.getEmail().equalsIgnoreCase(normalizedEmail);

        if (emailChanged && userRepository.existsByEmail(normalizedEmail)) {
            throw new BusinessException("Já existe outro usuário com este e-mail.");
        }

        if (normalizedPhone != null) {
            User phoneOwner = userRepository.findByPhone(normalizedPhone).orElse(null);

            if (phoneOwner != null && !phoneOwner.getId().equals(user.getId())) {
                throw new BusinessException("Já existe outro usuário com este telefone.");
            }
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada."));

        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPhone(normalizedPhone);
        user.setLanguage(normalizeLanguage(request.getLanguage()));
        user.setRoles(new HashSet<>(Set.of(role)));
        user.setProfiles(resolveProfiles(request.getProfileIds()));
        user.setPermissions(resolvePermissions(request.getPermissionIds()));

        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        user.setMasterUser(false);
        user.setDeveloperUser(false);

        applySpecialUserFlags(user, role);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    @Transactional
    public void delete(UUID id) {
        User user = findUserById(id);

        userRepository.delete(user);
    }

    private String normalizePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }

        return phone.trim()
                .replace(" ", "")
                .replace("-", "")
                .replace("(", "")
                .replace(")", "");
    }

    private String normalizeLanguage(String language) {
        if (language == null || language.isBlank()) {
            return null;
        }

        return language.trim();
    }

    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private Set<Profile> resolveProfiles(List<UUID> profileIds) {
        if (profileIds == null || profileIds.isEmpty()) {
            return new HashSet<>();
        }

        Set<UUID> uniqueProfileIds = new HashSet<>(profileIds);
        List<Profile> profiles = profileRepository.findAllById(uniqueProfileIds);

        if (profiles.size() != uniqueProfileIds.size()) {
            throw new BusinessException("Um ou mais perfis informados não foram encontrados.");
        }

        return new HashSet<>(profiles);
    }

    private Set<Permission> resolvePermissions(List<UUID> permissionIds) {
        if (permissionIds == null || permissionIds.isEmpty()) {
            return new HashSet<>();
        }

        Set<UUID> uniquePermissionIds = new HashSet<>(permissionIds);
        List<Permission> permissions = permissionRepository.findAllById(uniquePermissionIds);

        if (permissions.size() != uniquePermissionIds.size()) {
            throw new BusinessException("Uma ou mais permissões informadas não foram encontradas.");
        }

        return new HashSet<>(permissions);
    }

    private void applySpecialUserFlags(User user, Role role) {
        if ("ADMIN_MASTER".equals(role.getName())) {
            user.setMasterUser(true);
        }

        if ("DEVELOPER_MASTER".equals(role.getName())) {
            user.setDeveloperUser(true);
        }
    }

    private Set<String> resolveEffectivePermissions(User user) {
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

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setTenantId(user.getTenant() != null ? user.getTenant().getId() : null);
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setLanguage(user.getLanguage());
        response.setActive(user.getActive());
        response.setMasterUser(user.getMasterUser());
        response.setDeveloperUser(user.getDeveloperUser());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        response.setRoles(
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );

        response.setProfileIds(
                user.getProfiles()
                        .stream()
                        .map(Profile::getId)
                        .toList()
        );

        response.setProfiles(
                user.getProfiles()
                        .stream()
                        .map(Profile::getCode)
                        .collect(Collectors.toSet())
        );

        response.setPermissionIds(
                user.getPermissions()
                        .stream()
                        .map(Permission::getId)
                        .toList()
        );

        response.setPermissions(
                user.getPermissions()
                        .stream()
                        .map(Permission::getCode)
                        .collect(Collectors.toSet())
        );

        response.setEffectivePermissions(resolveEffectivePermissions(user));

        return response;
    }
}