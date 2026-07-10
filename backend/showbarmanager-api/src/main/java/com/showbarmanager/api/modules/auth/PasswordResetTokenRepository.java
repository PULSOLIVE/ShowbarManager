package com.showbarmanager.api.modules.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    @Query("""
            SELECT token
            FROM PasswordResetToken token
            WHERE token.resetToken = :resetToken
              AND token.identifier = :identifier
              AND token.channel = :channel
              AND token.otpCode = :otpCode
              AND token.used = false
              AND token.expiresAt > :now
            """)
    Optional<PasswordResetToken> findValidToken(
            String resetToken,
            String identifier,
            String channel,
            String otpCode,
            LocalDateTime now
    );

    @Modifying
    @Query("""
            UPDATE PasswordResetToken token
            SET token.used = true,
                token.usedAt = :now
            WHERE token.user.id = :userId
              AND token.used = false
            """)
    void markActiveTokensAsUsed(UUID userId, LocalDateTime now);
}