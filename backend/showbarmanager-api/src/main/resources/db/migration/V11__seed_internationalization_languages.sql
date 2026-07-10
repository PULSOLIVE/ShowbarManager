UPDATE internationalizations
SET system_default = false
WHERE system_default = true
  AND NOT (country_code = 'PT' AND language_code = 'pt-PT');

INSERT INTO internationalizations (
    id, code, country_code, country_name, language_code, language_name,
    currency_code, currency_symbol, timezone, timezone_label,
    date_format, time_format, flag_emoji, flag_icon_url,
    active, system_default, priority, created_at, updated_at
)
VALUES
(gen_random_uuid(), 'PT_PT', 'PT', 'Portugal', 'pt-PT', 'Português (Portugal)', 'EUR', '€', 'Europe/Lisbon', '(UTC+00/+01) Europa/Lisboa', 'dd/MM/yyyy', 'HH:mm', '🇵🇹', NULL, true, true, 1, NOW(), NULL),
(gen_random_uuid(), 'BR_BR', 'BR', 'Brasil', 'pt-BR', 'Português (Brasil)', 'BRL', 'R$', 'America/Sao_Paulo', '(UTC-03) América/São Paulo', 'dd/MM/yyyy', 'HH:mm', '🇧🇷', NULL, true, false, 2, NOW(), NULL),
(gen_random_uuid(), 'US_EN', 'US', 'Estados Unidos', 'en-US', 'English (United States)', 'USD', '$', 'America/New_York', '(UTC-05/-04) América/Nova Iorque', 'MM/dd/yyyy', 'HH:mm', '🇺🇸', NULL, true, false, 3, NOW(), NULL),
(gen_random_uuid(), 'ES_ES', 'ES', 'Espanha', 'es-ES', 'Español (España)', 'EUR', '€', 'Europe/Madrid', '(UTC+01/+02) Europa/Madrid', 'dd/MM/yyyy', 'HH:mm', '🇪🇸', NULL, true, false, 4, NOW(), NULL),
(gen_random_uuid(), 'FR_FR', 'FR', 'França', 'fr-FR', 'Français', 'EUR', '€', 'Europe/Paris', '(UTC+01/+02) Europa/Paris', 'dd/MM/yyyy', 'HH:mm', '🇫🇷', NULL, true, false, 5, NOW(), NULL),
(gen_random_uuid(), 'DE_DE', 'DE', 'Alemanha', 'de-DE', 'Deutsch', 'EUR', '€', 'Europe/Berlin', '(UTC+01/+02) Europa/Berlim', 'dd.MM.yyyy', 'HH:mm', '🇩🇪', NULL, true, false, 6, NOW(), NULL),
(gen_random_uuid(), 'GB_EN', 'GB', 'Reino Unido', 'en-GB', 'English (United Kingdom)', 'GBP', '£', 'Europe/London', '(UTC+00/+01) Europa/Londres', 'dd/MM/yyyy', 'HH:mm', '🇬🇧', NULL, true, false, 7, NOW(), NULL),
(gen_random_uuid(), 'CA_EN', 'CA', 'Canadá', 'en-CA', 'English (Canada)', 'CAD', '$', 'America/Toronto', '(UTC-05/-04) América/Toronto', 'yyyy-MM-dd', 'HH:mm', '🇨🇦', NULL, true, false, 8, NOW(), NULL),
(gen_random_uuid(), 'AR_ES', 'AR', 'Argentina', 'es-AR', 'Español (Argentina)', 'ARS', '$', 'America/Argentina/Buenos_Aires', '(UTC-03) América/Argentina/Buenos Aires', 'dd/MM/yyyy', 'HH:mm', '🇦🇷', NULL, true, false, 9, NOW(), NULL),
(gen_random_uuid(), 'PY_ES', 'PY', 'Paraguai', 'es-PY', 'Español (Paraguay)', 'PYG', '₲', 'America/Asuncion', '(UTC-04/-03) América/Assunção', 'dd/MM/yyyy', 'HH:mm', '🇵🇾', NULL, true, false, 10, NOW(), NULL),
(gen_random_uuid(), 'CN_ZH', 'CN', 'China', 'zh-CN', '中文 / Mandarim', 'CNY', '¥', 'Asia/Shanghai', '(UTC+08) Ásia/Xangai', 'yyyy/MM/dd', 'HH:mm', '🇨🇳', NULL, true, false, 11, NOW(), NULL),
(gen_random_uuid(), 'JP_JA', 'JP', 'Japão', 'ja-JP', '日本語 / Japonês', 'JPY', '¥', 'Asia/Tokyo', '(UTC+09) Ásia/Tóquio', 'yyyy/MM/dd', 'HH:mm', '🇯🇵', NULL, true, false, 12, NOW(), NULL),
(gen_random_uuid(), 'SA_AR', 'SA', 'Arábia Saudita', 'ar-SA', 'العربية / Árabe', 'SAR', '﷼', 'Asia/Riyadh', '(UTC+03) Ásia/Riade', 'dd/MM/yyyy', 'HH:mm', '🇸🇦', NULL, true, false, 13, NOW(), NULL)
ON CONFLICT (country_code, language_code) DO UPDATE SET
    code = EXCLUDED.code,
    country_name = EXCLUDED.country_name,
    language_name = EXCLUDED.language_name,
    currency_code = EXCLUDED.currency_code,
    currency_symbol = EXCLUDED.currency_symbol,
    timezone = EXCLUDED.timezone,
    timezone_label = EXCLUDED.timezone_label,
    date_format = EXCLUDED.date_format,
    time_format = EXCLUDED.time_format,
    flag_emoji = EXCLUDED.flag_emoji,
    flag_icon_url = EXCLUDED.flag_icon_url,
    active = EXCLUDED.active,
    system_default = EXCLUDED.system_default,
    priority = EXCLUDED.priority,
    updated_at = NOW();