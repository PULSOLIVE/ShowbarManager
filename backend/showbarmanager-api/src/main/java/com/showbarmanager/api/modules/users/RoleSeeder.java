package com.showbarmanager.api.modules.users;

import com.showbarmanager.api.modules.settings.permissions.Permission;
import com.showbarmanager.api.modules.settings.permissions.PermissionRepository;
import com.showbarmanager.api.modules.settings.profiles.Profile;
import com.showbarmanager.api.modules.settings.profiles.ProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final ProfileRepository profileRepository;

    public RoleSeeder(
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            ProfileRepository profileRepository
    ) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedRoles();
        seedPermissions();
        seedProfiles();
        bindProfilePermissions();
    }

    private void seedRoles() {
        createRoleIfNotExists("ADMIN_MASTER", "Administrador master da plataforma");
        createRoleIfNotExists("DEVELOPER_MASTER", "Usuário desenvolvedor master");
        createRoleIfNotExists("TENANT_ADMIN", "Administrador do tenant");
        createRoleIfNotExists("PRODUCER", "Produtor de eventos");
        createRoleIfNotExists("FINANCIAL", "Usuário financeiro");
        createRoleIfNotExists("OPERATIONAL", "Usuário operacional");

        createRoleIfNotExists("SUPPORT_N1", "Suporte nível 1");
        createRoleIfNotExists("SUPPORT_N2", "Suporte nível 2");
        createRoleIfNotExists("SUPPORT_N3", "Suporte nível 3");
        createRoleIfNotExists("COMPLIANCE", "Compliance");
        createRoleIfNotExists("AUDITOR", "Auditor");
        createRoleIfNotExists("EVENT_ADMIN", "Administrador de evento");
        createRoleIfNotExists("FINANCIAL_MANAGER", "Gestor financeiro");
        createRoleIfNotExists("TICKET_MANAGER", "Gestor de bilheteria");
        createRoleIfNotExists("SECURITY_MANAGER", "Gestor de segurança");
        createRoleIfNotExists("HEALTH_MANAGER", "Gestor de saúde");
        createRoleIfNotExists("LOGISTICS_MANAGER", "Gestor de logística");
        createRoleIfNotExists("BAR_MANAGER", "Gestor de bar");
        createRoleIfNotExists("TECHNICAL_MANAGER", "Gestor técnico");
        createRoleIfNotExists("OPERATOR", "Operador");
    }

    private void seedPermissions() {
        createPermissionIfNotExists("USERS_VIEW", "Visualizar usuários", "USERS", "VIEW", true, 10);
        createPermissionIfNotExists("USERS_CREATE", "Criar usuários", "USERS", "CREATE", true, 20);
        createPermissionIfNotExists("USERS_UPDATE", "Alterar usuários", "USERS", "UPDATE", true, 30);
        createPermissionIfNotExists("USERS_DELETE", "Excluir usuários", "USERS", "DELETE", true, 40);

        createPermissionIfNotExists("PROFILES_VIEW", "Visualizar perfis", "PROFILES", "VIEW", true, 10);
        createPermissionIfNotExists("PROFILES_CREATE", "Criar perfis", "PROFILES", "CREATE", true, 20);
        createPermissionIfNotExists("PROFILES_UPDATE", "Alterar perfis", "PROFILES", "UPDATE", true, 30);
        createPermissionIfNotExists("PROFILES_DELETE", "Excluir perfis", "PROFILES", "DELETE", true, 40);

        createPermissionIfNotExists("PERMISSIONS_VIEW", "Visualizar permissões", "PERMISSIONS", "VIEW", true, 10);
        createPermissionIfNotExists("PERMISSIONS_CREATE", "Criar permissões", "PERMISSIONS", "CREATE", true, 20);
        createPermissionIfNotExists("PERMISSIONS_UPDATE", "Alterar permissões", "PERMISSIONS", "UPDATE", true, 30);
        createPermissionIfNotExists("PERMISSIONS_DELETE", "Excluir permissões", "PERMISSIONS", "DELETE", true, 40);

        createPermissionIfNotExists("TENANTS_VIEW", "Visualizar tenants", "TENANTS", "VIEW", true, 10);
        createPermissionIfNotExists("TENANTS_CREATE", "Criar tenants", "TENANTS", "CREATE", true, 20);
        createPermissionIfNotExists("TENANTS_UPDATE", "Alterar tenants", "TENANTS", "UPDATE", true, 30);
        createPermissionIfNotExists("TENANTS_DELETE", "Excluir tenants", "TENANTS", "DELETE", true, 40);

        createPermissionIfNotExists("SETTINGS_VIEW", "Visualizar configurações", "SETTINGS", "VIEW", true, 10);
        createPermissionIfNotExists("AUDIT_VIEW", "Visualizar auditoria", "AUDIT", "VIEW", true, 10);
        createPermissionIfNotExists("SECURITY_VIEW", "Visualizar segurança", "SECURITY", "VIEW", true, 10);
        createPermissionIfNotExists("SESSIONS_VIEW", "Visualizar sessões", "SESSIONS", "VIEW", true, 10);

        createPermissionIfNotExists("BRANDING_VIEW", "Visualizar branding", "BRANDING", "VIEW", true, 10);
        createPermissionIfNotExists("BRANDING_UPDATE", "Alterar branding", "BRANDING", "UPDATE", true, 20);

        createPermissionIfNotExists("INTERNATIONALIZATION_VIEW", "Visualizar internacionalização", "INTERNATIONALIZATION", "VIEW", true, 10);
        createPermissionIfNotExists("INTERNATIONALIZATION_CREATE", "Criar internacionalização", "INTERNATIONALIZATION", "CREATE", true, 20);
        createPermissionIfNotExists("INTERNATIONALIZATION_UPDATE", "Alterar internacionalização", "INTERNATIONALIZATION", "UPDATE", true, 30);
        createPermissionIfNotExists("INTERNATIONALIZATION_DELETE", "Excluir internacionalização", "INTERNATIONALIZATION", "DELETE", true, 40);

        createPermissionIfNotExists("NETWORK_VIEW", "Visualizar rede local", "NETWORK", "VIEW", true, 10);
        createPermissionIfNotExists("NETWORK_UPDATE", "Alterar rede local", "NETWORK", "UPDATE", true, 20);

        createPermissionIfNotExists("HARDWARE_VIEW", "Visualizar hardware", "HARDWARE", "VIEW", true, 10);
        createPermissionIfNotExists("HARDWARE_UPDATE", "Alterar hardware", "HARDWARE", "UPDATE", true, 20);

        createPermissionIfNotExists("INTEGRATIONS_VIEW", "Visualizar integrações", "INTEGRATIONS", "VIEW", true, 10);
        createPermissionIfNotExists("INTEGRATIONS_UPDATE", "Alterar integrações", "INTEGRATIONS", "UPDATE", true, 20);

        createPermissionIfNotExists("POLICIES_VIEW", "Visualizar políticas", "POLICIES", "VIEW", true, 10);
        createPermissionIfNotExists("POLICIES_UPDATE", "Alterar políticas", "POLICIES", "UPDATE", true, 20);
    }

    private void seedProfiles() {
        createProfileIfNotExists("ADMIN_MASTER", "Administrador Master", "Acesso administrativo total.", true, 1);
        createProfileIfNotExists("DEVELOPER_MASTER", "Desenvolvedor Master", "Acesso técnico total.", true, 2);
        createProfileIfNotExists("TENANT_ADMIN", "Administrador do Ambiente", "Administração do tenant.", true, 10);
        createProfileIfNotExists("SUPPORT_N1", "Suporte Nível 1", "Suporte operacional básico.", false, 20);
        createProfileIfNotExists("SUPPORT_N2", "Suporte Nível 2", "Suporte operacional intermediário.", false, 21);
        createProfileIfNotExists("SUPPORT_N3", "Suporte Nível 3", "Suporte avançado.", false, 22);
        createProfileIfNotExists("COMPLIANCE", "Compliance", "Governança e conformidade.", false, 30);
        createProfileIfNotExists("AUDITOR", "Auditor", "Auditoria e consulta.", false, 31);
        createProfileIfNotExists("EVENT_ADMIN", "Administrador de Evento", "Gestão administrativa de evento.", false, 40);
        createProfileIfNotExists("FINANCIAL_MANAGER", "Gestor Financeiro", "Gestão financeira.", false, 50);
        createProfileIfNotExists("TICKET_MANAGER", "Gestor de Bilheteria", "Gestão de bilheteria.", false, 60);
        createProfileIfNotExists("SECURITY_MANAGER", "Gestor de Segurança", "Gestão de segurança.", false, 70);
        createProfileIfNotExists("HEALTH_MANAGER", "Gestor de Saúde", "Gestão de saúde operacional.", false, 80);
        createProfileIfNotExists("LOGISTICS_MANAGER", "Gestor de Logística", "Gestão logística.", false, 90);
        createProfileIfNotExists("BAR_MANAGER", "Gestor de Bar", "Gestão de bar.", false, 100);
        createProfileIfNotExists("TECHNICAL_MANAGER", "Gestor Técnico", "Gestão técnica.", false, 110);
        createProfileIfNotExists("OPERATOR", "Operador", "Usuário operacional padrão.", false, 200);
    }

    private void bindProfilePermissions() {
        List<Permission> allPermissions = permissionRepository.findAll();

        bindPermissionsToProfile("ADMIN_MASTER", allPermissions);
        bindPermissionsToProfile("DEVELOPER_MASTER", allPermissions);

        bindPermissionsToProfile(
                "TENANT_ADMIN",
                findPermissionsByCodes(
                        "USERS_VIEW",
                        "USERS_CREATE",
                        "USERS_UPDATE",
                        "PROFILES_VIEW",
                        "PERMISSIONS_VIEW",
                        "TENANTS_VIEW",
                        "SETTINGS_VIEW",
                        "BRANDING_VIEW",
                        "INTERNATIONALIZATION_VIEW",
                        "NETWORK_VIEW",
                        "HARDWARE_VIEW",
                        "INTEGRATIONS_VIEW",
                        "POLICIES_VIEW"
                )
        );

        bindPermissionsToProfile(
                "SUPPORT_N1",
                findPermissionsByCodes(
                        "USERS_VIEW",
                        "PROFILES_VIEW",
                        "PERMISSIONS_VIEW",
                        "TENANTS_VIEW",
                        "SETTINGS_VIEW"
                )
        );

        bindPermissionsToProfile(
                "SUPPORT_N2",
                findPermissionsByCodes(
                        "USERS_VIEW",
                        "USERS_UPDATE",
                        "PROFILES_VIEW",
                        "PERMISSIONS_VIEW",
                        "TENANTS_VIEW",
                        "SETTINGS_VIEW"
                )
        );

        bindPermissionsToProfile(
                "SUPPORT_N3",
                findPermissionsByCodes(
                        "USERS_VIEW",
                        "USERS_CREATE",
                        "USERS_UPDATE",
                        "PROFILES_VIEW",
                        "PERMISSIONS_VIEW",
                        "TENANTS_VIEW",
                        "SETTINGS_VIEW",
                        "AUDIT_VIEW",
                        "SESSIONS_VIEW"
                )
        );

        bindPermissionsToProfile(
                "COMPLIANCE",
                findPermissionsByCodes(
                        "AUDIT_VIEW",
                        "SECURITY_VIEW",
                        "POLICIES_VIEW",
                        "PERMISSIONS_VIEW",
                        "PROFILES_VIEW",
                        "USERS_VIEW"
                )
        );

        bindPermissionsToProfile(
                "AUDITOR",
                findPermissionsByCodes(
                        "AUDIT_VIEW",
                        "USERS_VIEW",
                        "PROFILES_VIEW",
                        "PERMISSIONS_VIEW",
                        "TENANTS_VIEW"
                )
        );

        bindPermissionsToProfile(
                "OPERATOR",
                findPermissionsByCodes(
                        "SETTINGS_VIEW"
                )
        );
    }

    private void createRoleIfNotExists(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            roleRepository.save(role);
        }
    }

    private void createPermissionIfNotExists(
            String code,
            String name,
            String module,
            String action,
            Boolean systemPermission,
            Integer priority
    ) {
        if (!permissionRepository.existsByCode(code)) {
            Permission permission = new Permission();
            permission.setCode(code);
            permission.setName(name);
            permission.setModule(module);
            permission.setAction(action);
            permission.setDescription(name);
            permission.setActive(true);
            permission.setSystemPermission(systemPermission);
            permission.setPriority(priority);
            permissionRepository.save(permission);
        }
    }

    private void createProfileIfNotExists(
            String code,
            String name,
            String description,
            Boolean systemProfile,
            Integer priority
    ) {
        if (!profileRepository.existsByCode(code)) {
            Profile profile = new Profile();
            profile.setCode(code);
            profile.setName(name);
            profile.setDescription(description);
            profile.setActive(true);
            profile.setSystemProfile(systemProfile);
            profile.setPriority(priority);
            profileRepository.save(profile);
        }
    }

    private void bindPermissionsToProfile(String profileCode, List<Permission> permissions) {
        Profile profile = profileRepository.findByCode(profileCode).orElse(null);

        if (profile == null) {
            return;
        }

        profile.setPermissions(new HashSet<>(permissions));
        profileRepository.save(profile);
    }

    private List<Permission> findPermissionsByCodes(String... codes) {
        return List.of(codes)
                .stream()
                .map(code -> permissionRepository.findByCode(code).orElse(null))
                .filter(permission -> permission != null)
                .toList();
    }
}