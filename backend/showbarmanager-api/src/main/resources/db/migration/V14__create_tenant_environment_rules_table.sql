CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenant_environment_rules (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL,
    rule_key VARCHAR(80) NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 0,
    system_rule BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

INSERT INTO tenant_environment_rules (
    id,
    name,
    description,
    rule_key,
    enabled,
    priority,
    system_rule,
    created_at,
    updated_at
)
VALUES
(gen_random_uuid(), 'Ambiente ativo obrigatório', 'Garante que apenas ambientes ativos possam operar no sistema.', 'ENVIRONMENT_ACTIVE_REQUIRED', true, 1, true, NOW(), NULL),
(gen_random_uuid(), 'Empresa vinculada obrigatória', 'Impede ambientes sem empresa, cliente ou organização vinculada.', 'COMPANY_REQUIRED', true, 2, true, NOW(), NULL),
(gen_random_uuid(), 'País obrigatório por ambiente', 'Define o país base para fiscal, moeda, idioma e regras locais.', 'COUNTRY_REQUIRED', true, 3, true, NOW(), NULL),
(gen_random_uuid(), 'Moeda obrigatória por ambiente', 'Garante consistência financeira por país, tenant e operação.', 'CURRENCY_REQUIRED', true, 4, true, NOW(), NULL),
(gen_random_uuid(), 'Idioma padrão obrigatório', 'Define o idioma padrão do ambiente antes da preferência individual do usuário.', 'DEFAULT_LANGUAGE_REQUIRED', true, 5, true, NOW(), NULL),
(gen_random_uuid(), 'Fuso horário obrigatório', 'Evita inconsistências em agenda, eventos, relatórios, auditoria e bilheteria.', 'TIMEZONE_REQUIRED', true, 6, true, NOW(), NULL),
(gen_random_uuid(), 'Slug único obrigatório', 'Garante identificador único para URLs, integrações e isolamento lógico.', 'UNIQUE_SLUG_REQUIRED', true, 7, true, NOW(), NULL),
(gen_random_uuid(), 'Isolamento de dados por ambiente', 'Impede que dados de um ambiente sejam acessados por outro tenant.', 'DATA_ISOLATION_REQUIRED', true, 8, true, NOW(), NULL),
(gen_random_uuid(), 'Acesso global somente autorizado', 'Controla acesso administrativo, suporte técnico e superusuários.', 'GLOBAL_ACCESS_RESTRICTED', true, 9, true, NOW(), NULL),
(gen_random_uuid(), 'Auditoria obrigatória em ações críticas', 'Registra alterações em ambiente, usuários, permissões, fiscal e financeiro.', 'CRITICAL_ACTION_AUDIT_REQUIRED', true, 10, true, NOW(), NULL)
ON CONFLICT (rule_key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    enabled = EXCLUDED.enabled,
    priority = EXCLUDED.priority,
    system_rule = EXCLUDED.system_rule,
    updated_at = NOW();