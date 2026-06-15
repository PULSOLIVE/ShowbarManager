CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS country_fiscal_rules (
    id UUID PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL UNIQUE,
    country_name VARCHAR(120) NOT NULL,
    tax_name VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS country_fiscal_rule_fields (
    country_fiscal_rule_id UUID NOT NULL,
    field_name VARCHAR(120) NOT NULL,
    CONSTRAINT fk_country_fiscal_rule_fields_rule
        FOREIGN KEY (country_fiscal_rule_id)
        REFERENCES country_fiscal_rules(id)
        ON DELETE CASCADE
);

INSERT INTO country_fiscal_rules (
    id,
    country_code,
    country_name,
    tax_name,
    description,
    active,
    priority,
    created_at,
    updated_at
)
VALUES
(gen_random_uuid(), 'PT', 'Portugal', 'IVA / SAF-T PT', 'Regras fiscais portuguesas, faturação e validações locais.', true, 1, NOW(), NULL),
(gen_random_uuid(), 'BR', 'Brasil', 'NFS-e / RPS', 'Documentos, meios de pagamento e regras fiscais brasileiras.', true, 2, NOW(), NULL)
ON CONFLICT (country_code) DO UPDATE SET
    country_name = EXCLUDED.country_name,
    tax_name = EXCLUDED.tax_name,
    description = EXCLUDED.description,
    active = EXCLUDED.active,
    priority = EXCLUDED.priority,
    updated_at = NOW();

DELETE FROM country_fiscal_rule_fields
WHERE country_fiscal_rule_id IN (
    SELECT id FROM country_fiscal_rules WHERE country_code IN ('PT', 'BR')
);

INSERT INTO country_fiscal_rule_fields (
    country_fiscal_rule_id,
    field_name
)
SELECT id, field_name
FROM country_fiscal_rules
CROSS JOIN LATERAL (
    VALUES
        ('NIF/NIPC'),
        ('IBAN/NIB'),
        ('ATCUD'),
        ('QR Code Fiscal')
) AS fields(field_name)
WHERE country_code = 'PT';

INSERT INTO country_fiscal_rule_fields (
    country_fiscal_rule_id,
    field_name
)
SELECT id, field_name
FROM country_fiscal_rules
CROSS JOIN LATERAL (
    VALUES
        ('CPF/CNPJ'),
        ('PIX'),
        ('Boleto'),
        ('Inscrição Municipal')
) AS fields(field_name)
WHERE country_code = 'BR';