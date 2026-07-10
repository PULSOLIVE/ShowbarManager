CREATE TABLE internationalizations (
    id UUID PRIMARY KEY,

    code VARCHAR(20) NOT NULL UNIQUE,

    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(120) NOT NULL,

    language_code VARCHAR(20) NOT NULL,
    language_name VARCHAR(120) NOT NULL,

    currency_code VARCHAR(3) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,

    timezone VARCHAR(80) NOT NULL,
    timezone_label VARCHAR(120) NOT NULL,

    date_format VARCHAR(30) NOT NULL DEFAULT 'dd/MM/yyyy',
    time_format VARCHAR(20) NOT NULL DEFAULT 'HH:mm',

    flag_emoji VARCHAR(10),
    flag_icon_url VARCHAR(255),

    active BOOLEAN NOT NULL DEFAULT TRUE,
    system_default BOOLEAN NOT NULL DEFAULT FALSE,
    priority INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE UNIQUE INDEX uk_internationalizations_country_language
ON internationalizations(country_code, language_code);

INSERT INTO internationalizations (
    id,
    code,
    country_code,
    country_name,
    language_code,
    language_name,
    currency_code,
    currency_symbol,
    timezone,
    timezone_label,
    date_format,
    time_format,
    flag_emoji,
    flag_icon_url,
    active,
    system_default,
    priority,
    created_at,
    updated_at
)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'PT_PT',
    'PT',
    'Portugal',
    'pt-PT',
    'Português (Portugal)',
    'EUR',
    '€',
    'Europe/Lisbon',
    'Europa/Lisboa',
    'dd/MM/yyyy',
    'HH:mm',
    '🇵🇹',
    null,
    true,
    true,
    1,
    CURRENT_TIMESTAMP,
    null
),
(
    '22222222-2222-2222-2222-222222222222',
    'BR_PT',
    'BR',
    'Brasil',
    'pt-BR',
    'Português (Brasil)',
    'BRL',
    'R$',
    'America/Sao_Paulo',
    'América/São Paulo',
    'dd/MM/yyyy',
    'HH:mm',
    '🇧🇷',
    null,
    true,
    false,
    2,
    CURRENT_TIMESTAMP,
    null
),
(
    '33333333-3333-3333-3333-333333333333',
    'ES_ES',
    'ES',
    'Espanha',
    'es-ES',
    'Español (España)',
    'EUR',
    '€',
    'Europe/Madrid',
    'Europa/Madrid',
    'dd/MM/yyyy',
    'HH:mm',
    '🇪🇸',
    null,
    true,
    false,
    3,
    CURRENT_TIMESTAMP,
    null
),
(
    '44444444-4444-4444-4444-444444444444',
    'US_EN',
    'US',
    'Estados Unidos',
    'en-US',
    'English (United States)',
    'USD',
    '$',
    'America/New_York',
    'América/Nova Iorque',
    'MM/dd/yyyy',
    'hh:mm a',
    '🇺🇸',
    null,
    true,
    false,
    4,
    CURRENT_TIMESTAMP,
    null
);