package com.showbarmanager.api.modules.users;

import com.showbarmanager.api.modules.settings.permissions.Permission;
import com.showbarmanager.api.modules.settings.profiles.Profile;
import com.showbarmanager.api.modules.tenants.Tenant;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 10)
    private String language;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "master_user", nullable = false)
    private Boolean masterUser = false;

    @Column(name = "developer_user", nullable = false)
    private Boolean developerUser = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_profiles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "profile_id")
    )
    private Set<Profile> profiles = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_permissions",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User() {
    }

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();

        if (this.active == null) this.active = true;
        if (this.masterUser == null) this.masterUser = false;
        if (this.developerUser == null) this.developerUser = false;
        if (this.roles == null) this.roles = new HashSet<>();
        if (this.profiles == null) this.profiles = new HashSet<>();
        if (this.permissions == null) this.permissions = new HashSet<>();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();

        if (this.roles == null) this.roles = new HashSet<>();
        if (this.profiles == null) this.profiles = new HashSet<>();
        if (this.permissions == null) this.permissions = new HashSet<>();
    }

    public UUID getId() { return id; }
    public Tenant getTenant() { return tenant; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getLanguage() { return language; }
    public Boolean getActive() { return active; }
    public Boolean getMasterUser() { return masterUser; }
    public Boolean getDeveloperUser() { return developerUser; }
    public Set<Role> getRoles() { return roles; }
    public Set<Profile> getProfiles() { return profiles; }
    public Set<Permission> getPermissions() { return permissions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(UUID id) { this.id = id; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setLanguage(String language) { this.language = language; }
    public void setActive(Boolean active) { this.active = active; }
    public void setMasterUser(Boolean masterUser) { this.masterUser = masterUser; }
    public void setDeveloperUser(Boolean developerUser) { this.developerUser = developerUser; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    public void setProfiles(Set<Profile> profiles) { this.profiles = profiles; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}