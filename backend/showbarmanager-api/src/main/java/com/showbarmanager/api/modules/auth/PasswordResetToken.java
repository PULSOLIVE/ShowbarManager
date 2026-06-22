package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.modules.users.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "identifier", nullable = false, length = 180)
    private String identifier;

    @Column(name = "channel", nullable = false, length = 20)
    private String channel;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Column(name = "reset_token", nullable = false, unique = true, length = 120)
    private String resetToken;

    @Column(nullable = false)
    private Boolean used = false;

    @Column(name = "ip_address", length = 80)
    private String ipAddress;

    @Column(name = "used_ip_address", length = 80)
    private String usedIpAddress;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }

        if (used == null) {
            used = false;
        }

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public String getIdentifier() { return identifier; }
    public String getChannel() { return channel; }
    public String getOtpCode() { return otpCode; }
    public String getResetToken() { return resetToken; }
    public Boolean getUsed() { return used; }
    public String getIpAddress() { return ipAddress; }
    public String getUsedIpAddress() { return usedIpAddress; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getUsedAt() { return usedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(UUID id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public void setChannel(String channel) { this.channel = channel; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public void setUsed(Boolean used) { this.used = used; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public void setUsedIpAddress(String usedIpAddress) { this.usedIpAddress = usedIpAddress; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
}