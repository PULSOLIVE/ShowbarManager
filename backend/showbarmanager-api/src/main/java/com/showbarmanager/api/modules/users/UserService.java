package com.showbarmanager.api.modules.users;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.tenants.Tenant;
import com.showbarmanager.api.modules.tenants.TenantRepository;
import com.showbarmanager.api.modules.users.dto.CreateUserRequest;
import com.showbarmanager.api.modules.users.dto.UpdateUserRequest;
import com.showbarmanager.api.modules.users.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            TenantRepository tenantRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Já existe um usuário com este e-mail.");
        }

        Tenant tenant = tenantRepository.findById(request.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant não encontrado."));

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada."));

        User user = new User();
        user.setTenant(tenant);
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(new HashSet<>(Set.of(role)));
        user.setActive(true);

        applySpecialUserFlags(user, role);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return toResponse(user);
    }

    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        boolean emailChanged = !user.getEmail().equalsIgnoreCase(request.getEmail());

        if (emailChanged && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Já existe outro usuário com este e-mail.");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role não encontrada."));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRoles(new HashSet<>(Set.of(role)));

        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        user.setMasterUser(false);
        user.setDeveloperUser(false);

        applySpecialUserFlags(user, role);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    public void delete(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        userRepository.delete(user);
    }

    private void applySpecialUserFlags(User user, Role role) {
        if ("ADMIN_MASTER".equals(role.getName())) {
            user.setMasterUser(true);
        }

        if ("DEVELOPER_MASTER".equals(role.getName())) {
            user.setDeveloperUser(true);
        }
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setTenantId(user.getTenant() != null ? user.getTenant().getId() : null);
        response.setName(user.getName());
        response.setEmail(user.getEmail());
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

        return response;
    }
}