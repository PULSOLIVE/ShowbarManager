INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'ADMIN_MASTER', 'Acesso global completo ao sistema.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN_MASTER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'DEVELOPER_MASTER', 'Acesso técnico master para desenvolvimento e manutenção.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'DEVELOPER_MASTER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'SUPPORT_N1', 'Suporte nível 1 para atendimento inicial.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SUPPORT_N1');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'SUPPORT_N2', 'Suporte nível 2 para análise intermediária.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SUPPORT_N2');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'SUPPORT_N3', 'Suporte nível 3 para incidentes avançados.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SUPPORT_N3');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'COMPLIANCE', 'Responsável por conformidade, LGPD/RGPD e políticas.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'COMPLIANCE');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'AUDITOR', 'Acesso a auditoria, logs e relatórios.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'AUDITOR');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'TENANT_ADMIN', 'Administrador do tenant.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'TENANT_ADMIN');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'EVENT_ADMIN', 'Administrador do evento.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'EVENT_ADMIN');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'FINANCIAL_MANAGER', 'Gestor financeiro.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'FINANCIAL_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'TICKET_MANAGER', 'Gestor de bilheteria.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'TICKET_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'SECURITY_MANAGER', 'Gestor de segurança.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SECURITY_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'HEALTH_MANAGER', 'Gestor de saúde.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'HEALTH_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'LOGISTICS_MANAGER', 'Gestor de logística.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'LOGISTICS_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'BAR_MANAGER', 'Gestor de bar.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'BAR_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'TECHNICAL_MANAGER', 'Gestor técnico.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'TECHNICAL_MANAGER');

INSERT INTO roles (id, name, description, created_at)
SELECT gen_random_uuid(), 'OPERATOR', 'Operador com acesso limitado conforme permissões.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'OPERATOR');