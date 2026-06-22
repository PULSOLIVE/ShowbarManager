package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.modules.auth.dto.ForgotPasswordRequest;
import com.showbarmanager.api.modules.auth.dto.ForgotPasswordResponse;
import com.showbarmanager.api.modules.auth.dto.LoginRequest;
import com.showbarmanager.api.modules.auth.dto.LoginResponse;
import com.showbarmanager.api.modules.auth.dto.ResetPasswordRequest;
import com.showbarmanager.api.modules.auth.dto.ResetPasswordResponse;
import com.showbarmanager.api.modules.users.Role;
import com.showbarmanager.api.modules.users.User;
import com.showbarmanager.api.modules.users.UserRepository;
import com.showbarmanager.api.security.AuthLoggingService;
import com.showbarmanager.api.security.JwtService;
import com.showbarmanager.api.security.RbacAuthorityService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final int OTP_EXPIRATION_MINUTES = 10;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthLoggingService authLoggingService;
    private final RbacAuthorityService rbacAuthorityService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordResetNotificationService passwordResetNotificationService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthLoggingService authLoggingService,
            RbacAuthorityService rbacAuthorityService,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordResetNotificationService passwordResetNotificationService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authLoggingService = authLoggingService;
        this.rbacAuthorityService = rbacAuthorityService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordResetNotificationService = passwordResetNotificationService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request, String ip) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user == null) {
            authLoggingService.loginFailure(normalizedEmail, ip, "USER_NOT_FOUND");
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            authLoggingService.loginFailure(normalizedEmail, ip, "INVALID_PASSWORD");
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }

        if (!Boolean.TRUE.equals(user.getActive())) {
            authLoggingService.loginFailure(normalizedEmail, ip, "USER_INACTIVE");
            throw new BadCredentialsException("Usuário inativo.");
        }

        String token = jwtService.generateToken(user);
        String tenantLanguage = user.getTenant() != null ? user.getTenant().getLanguage() : null;
        String resolvedLanguage = resolveLanguage(user.getLanguage(), tenantLanguage);

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
        response.setLanguage(user.getLanguage());
        response.setTenantLanguage(tenantLanguage);
        response.setResolvedLanguage(resolvedLanguage);
        response.setMasterUser(user.getMasterUser());
        response.setDeveloperUser(user.getDeveloperUser());
        response.setRoles(
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );
        response.setEffectivePermissions(
                rbacAuthorityService.resolveEffectivePermissionCodes(user)
        );

        return response;
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request, String ip) {
        String channel = normalizeChannel(request.getChannel());
        String identifier = normalizeIdentifier(request.getIdentifier(), channel);

        User user = findUserByIdentifier(identifier, channel);

        if (user == null || !Boolean.TRUE.equals(user.getActive())) {
            ForgotPasswordResponse response = new ForgotPasswordResponse();
            response.setResetToken(null);
            response.setExpiresInMinutes(OTP_EXPIRATION_MINUTES);
            response.setMaskedDestination(maskIdentifier(identifier, channel));
            return response;
        }

        passwordResetTokenRepository.markActiveTokensAsUsed(user.getId(), LocalDateTime.now());

        String code = generateOtpCode();
        String resetToken = UUID.randomUUID().toString();

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setIdentifier(identifier);
        token.setChannel(channel);
        token.setOtpCode(code);
        token.setResetToken(resetToken);
        token.setUsed(false);
        token.setIpAddress(ip);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES));

        passwordResetTokenRepository.save(token);

        passwordResetNotificationService.sendResetCode(
                user,
                channel,
                identifier,
                code,
                OTP_EXPIRATION_MINUTES
        );

        ForgotPasswordResponse response = new ForgotPasswordResponse();
        response.setResetToken(resetToken);
        response.setExpiresInMinutes(OTP_EXPIRATION_MINUTES);
        response.setMaskedDestination(maskIdentifier(identifier, channel));

        return response;
    }

    @Transactional
    public ResetPasswordResponse resetPassword(ResetPasswordRequest request, String ip) {
        String channel = normalizeChannel(request.getChannel());
        String identifier = normalizeIdentifier(request.getIdentifier(), channel);
        String code = request.getCode() != null ? request.getCode().trim() : "";

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("As senhas não coincidem.");
        }

        if (request.getNewPassword().length() < 6) {
            throw new BusinessException("A nova senha deve ter pelo menos 6 caracteres.");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository
                .findValidToken(
                        request.getResetToken(),
                        identifier,
                        channel,
                        code,
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new BusinessException("Código inválido, expirado ou já utilizado."));

        User user = resetToken.getUser();

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BusinessException("Usuário inativo.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetToken.setUsedAt(LocalDateTime.now());
        resetToken.setUsedIpAddress(ip);
        passwordResetTokenRepository.save(resetToken);

        ResetPasswordResponse response = new ResetPasswordResponse();
        response.setSuccess(true);
        response.setMessage("Senha redefinida com sucesso.");

        return response;
    }

    private User findUserByIdentifier(String identifier, String channel) {
        if ("sms".equals(channel)) {
            return userRepository.findByPhone(identifier).orElse(null);
        }

        return userRepository.findByEmail(identifier).orElse(null);
    }

    private String generateOtpCode() {
        int number = SECURE_RANDOM.nextInt(1_000_000);
        return String.format("%06d", number);
    }

    private String normalizeChannel(String channel) {
        if (channel == null) {
            return "email";
        }

        String normalized = channel.trim().toLowerCase(Locale.ROOT);

        if (!normalized.equals("email") && !normalized.equals("sms")) {
            throw new BusinessException("Canal de redefinição inválido.");
        }

        return normalized;
    }

    private String normalizeIdentifier(String identifier, String channel) {
        if (identifier == null || identifier.isBlank()) {
            throw new BusinessException("Informe o e-mail ou telemóvel.");
        }

        String normalized = identifier.trim();

        if ("email".equals(channel)) {
            return normalized.toLowerCase(Locale.ROOT);
        }

        return normalized.replace(" ", "").replace("-", "").replace("(", "").replace(")", "");
    }

    private String maskIdentifier(String identifier, String channel) {
        if ("sms".equals(channel)) {
            if (identifier.length() <= 4) {
                return "****";
            }

            return "****" + identifier.substring(identifier.length() - 4);
        }

        int atIndex = identifier.indexOf("@");

        if (atIndex <= 1) {
            return "***";
        }

        return identifier.charAt(0) + "***" + identifier.substring(atIndex);
    }

    private String resolveLanguage(String userLanguage, String tenantLanguage) {
        if (userLanguage != null && !userLanguage.isBlank()) {
            return userLanguage.trim();
        }

        if (tenantLanguage != null && !tenantLanguage.isBlank()) {
            return tenantLanguage.trim();
        }

        return "pt-PT";
    }
}