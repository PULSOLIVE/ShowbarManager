package com.showbarmanager.api.modules.users;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        createRoleIfNotExists("ADMIN_MASTER", "Administrador master da plataforma");
        createRoleIfNotExists("TENANT_ADMIN", "Administrador do tenant");
        createRoleIfNotExists("PRODUCER", "Produtor de eventos");
        createRoleIfNotExists("FINANCIAL", "Usuário financeiro");
        createRoleIfNotExists("OPERATIONAL", "Usuário operacional");
        createRoleIfNotExists("DEVELOPER_MASTER", "Usuário desenvolvedor master");
    }

    private void createRoleIfNotExists(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            roleRepository.save(role);
        }
    }
}