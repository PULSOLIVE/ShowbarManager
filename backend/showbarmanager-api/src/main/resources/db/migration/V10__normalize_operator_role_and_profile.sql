INSERT INTO roles (
    id,
    name,
    description,
    created_at
)
SELECT
    gen_random_uuid(),
    'OPERATOR',
    'Operador do sistema',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE name = 'OPERATOR'
);

UPDATE roles
SET description = 'Operador do sistema'
WHERE name = 'OPERATOR';

UPDATE profiles
SET
    name = 'Operador',
    description = 'Perfil operacional padrão do sistema.',
    active = TRUE
WHERE code = 'OPERATOR';

INSERT INTO profiles (
    id,
    code,
    name,
    description,
    active,
    system_profile,
    priority,
    created_at
)
SELECT
    gen_random_uuid(),
    'OPERATOR',
    'Operador',
    'Perfil operacional padrão do sistema.',
    TRUE,
    TRUE,
    999,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE code = 'OPERATOR'
);

INSERT INTO user_roles (
    user_id,
    role_id
)
SELECT
    ur.user_id,
    operator_role.id
FROM user_roles ur
INNER JOIN roles old_role ON old_role.id = ur.role_id
INNER JOIN roles operator_role ON operator_role.name = 'OPERATOR'
WHERE old_role.name = 'OPERATIONAL'
AND NOT EXISTS (
    SELECT 1
    FROM user_roles existing
    WHERE existing.user_id = ur.user_id
    AND existing.role_id = operator_role.id
);

INSERT INTO user_profiles (
    user_id,
    profile_id,
    created_at
)
SELECT
    ur.user_id,
    operator_profile.id,
    CURRENT_TIMESTAMP
FROM user_roles ur
INNER JOIN roles role ON role.id = ur.role_id
INNER JOIN profiles operator_profile ON operator_profile.code = 'OPERATOR'
WHERE role.name = 'OPERATOR'
AND NOT EXISTS (
    SELECT 1
    FROM user_profiles existing
    WHERE existing.user_id = ur.user_id
    AND existing.profile_id = operator_profile.id
);