package com.showbarmanager.api.security;

import com.showbarmanager.api.modules.users.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.security.jwt.secret}")
    private String secret;

    @Value("${app.security.jwt.expiration}")
    private Long expiration;

    public String generateToken(User user) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiration);

        String tenantLanguage = user.getTenant() != null ? user.getTenant().getLanguage() : null;
        String resolvedLanguage = resolveLanguage(user.getLanguage(), tenantLanguage);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId() != null ? user.getId().toString() : null)
                .claim("tenantId", user.getTenant() != null ? user.getTenant().getId().toString() : null)
                .claim("language", user.getLanguage())
                .claim("tenantLanguage", tenantLanguage)
                .claim("resolvedLanguage", resolvedLanguage)
                .claim("masterUser", user.getMasterUser())
                .claim("developerUser", user.getDeveloperUser())
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, User user) {
        String username = extractUsername(token);

        return username.equals(user.getEmail()) && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token, String username) {
        String extractedUsername = extractUsername(token);

        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        return Keys.hmacShaKeyFor(keyBytes);
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