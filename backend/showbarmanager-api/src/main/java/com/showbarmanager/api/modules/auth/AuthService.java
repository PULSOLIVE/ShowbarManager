package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.modules.auth.dto.LoginRequest;
import com.showbarmanager.api.modules.auth.dto.LoginResponse;
import com.showbarmanager.api.modules.users.Role;
import com.showbarmanager.api.modules.users.User;
import com.showbarmanager.api.modules.users.UserRepository;
import com.showbarmanager.api.security.AuthLoggingService;
import com.showbarmanager.api.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthLoggingService authLoggingService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthLoggingService authLoggingService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authLoggingService = authLoggingService;
    }

    public LoginResponse login(LoginRequest request, String ip) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            authLoggingService.loginFailure(request.getEmail(), ip, "USER_NOT_FOUND");
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            authLoggingService.loginFailure(request.getEmail(), ip, "INVALID_PASSWORD");
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }

        if (!user.getActive()) {
            authLoggingService.loginFailure(request.getEmail(), ip, "USER_INACTIVE");
            throw new BadCredentialsException("Usuário inativo.");
        }

        String token = jwtService.generateToken(user);

        authLoggingService.loginSuccess(
                user.getEmail(),
                user.getTenant() != null ? user.getTenant().getId().toString() : null,
                ip
        );

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setTenantId(user.getTenant() != null ? user.getTenant().getId() : null);
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMasterUser(user.getMasterUser());
        response.setDeveloperUser(user.getDeveloperUser());
        response.setRoles(
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );

        return response;
    }
}