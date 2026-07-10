CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO internationalizations (
    id, code, country_code, country_name, language_code, language_name,
    currency_code, currency_symbol, timezone, timezone_label,
    date_format, time_format, flag_emoji, flag_icon_url,
    active, system_default, priority, created_at, updated_at
)
VALUES
(gen_random_uuid(), 'IE_EN', 'IE', 'Irlanda', 'en-GB', 'English (United Kingdom)', 'EUR', '€', 'Europe/Dublin', '(UTC+00/+01) Europa/Dublin', 'dd/MM/yyyy', 'HH:mm', '🇮🇪', NULL, true, false, 32, NOW(), NULL),
(gen_random_uuid(), 'MT_EN', 'MT', 'Malta', 'en-GB', 'English (United Kingdom)', 'EUR', '€', 'Europe/Malta', '(UTC+01/+02) Europa/Malta', 'dd/MM/yyyy', 'HH:mm', '🇲🇹', NULL, true, false, 33, NOW(), NULL),

(gen_random_uuid(), 'CA_FR', 'CA', 'Canadá', 'fr-CA', 'Français (Canada)', 'CAD', '$', 'America/Toronto', '(UTC-05/-04) América/Toronto', 'yyyy-MM-dd', 'HH:mm', '🇨🇦', NULL, true, false, 51, NOW(), NULL),
(gen_random_uuid(), 'BE_FR', 'BE', 'Bélgica', 'fr-FR', 'Français', 'EUR', '€', 'Europe/Brussels', '(UTC+01/+02) Europa/Bruxelas', 'dd/MM/yyyy', 'HH:mm', '🇧🇪', NULL, true, false, 52, NOW(), NULL),
(gen_random_uuid(), 'CH_FR', 'CH', 'Suíça', 'fr-FR', 'Français', 'CHF', 'CHF', 'Europe/Zurich', '(UTC+01/+02) Europa/Zurique', 'dd.MM.yyyy', 'HH:mm', '🇨🇭', NULL, true, false, 53, NOW(), NULL),
(gen_random_uuid(), 'LU_FR', 'LU', 'Luxemburgo', 'fr-FR', 'Français', 'EUR', '€', 'Europe/Luxembourg', '(UTC+01/+02) Europa/Luxemburgo', 'dd/MM/yyyy', 'HH:mm', '🇱🇺', NULL, true, false, 54, NOW(), NULL),

(gen_random_uuid(), 'AT_DE', 'AT', 'Áustria', 'de-DE', 'Deutsch', 'EUR', '€', 'Europe/Vienna', '(UTC+01/+02) Europa/Viena', 'dd.MM.yyyy', 'HH:mm', '🇦🇹', NULL, true, false, 61, NOW(), NULL),
(gen_random_uuid(), 'CH_DE', 'CH', 'Suíça', 'de-DE', 'Deutsch', 'CHF', 'CHF', 'Europe/Zurich', '(UTC+01/+02) Europa/Zurique', 'dd.MM.yyyy', 'HH:mm', '🇨🇭', NULL, true, false, 62, NOW(), NULL),

(gen_random_uuid(), 'IT_IT', 'IT', 'Itália', 'it-IT', 'Italiano', 'EUR', '€', 'Europe/Rome', '(UTC+01/+02) Europa/Roma', 'dd/MM/yyyy', 'HH:mm', '🇮🇹', NULL, true, false, 70, NOW(), NULL),
(gen_random_uuid(), 'CH_IT', 'CH', 'Suíça', 'it-IT', 'Italiano', 'CHF', 'CHF', 'Europe/Zurich', '(UTC+01/+02) Europa/Zurique', 'dd.MM.yyyy', 'HH:mm', '🇨🇭', NULL, true, false, 71, NOW(), NULL),

(gen_random_uuid(), 'RU_RU', 'RU', 'Rússia', 'ru-RU', 'Русский / Russo', 'RUB', '₽', 'Europe/Moscow', '(UTC+03) Europa/Moscovo', 'dd.MM.yyyy', 'HH:mm', '🇷🇺', NULL, true, false, 80, NOW(), NULL),
(gen_random_uuid(), 'UA_UK', 'UA', 'Ucrânia', 'uk-UA', 'Українська / Ucraniano', 'UAH', '₴', 'Europe/Kyiv', '(UTC+02/+03) Europa/Kyiv', 'dd.MM.yyyy', 'HH:mm', '🇺🇦', NULL, true, false, 81, NOW(), NULL),

(gen_random_uuid(), 'TW_ZH', 'TW', 'Taiwan', 'zh-CN', '中文 / Mandarim', 'TWD', 'NT$', 'Asia/Taipei', '(UTC+08) Ásia/Taipei', 'yyyy/MM/dd', 'HH:mm', '🇹🇼', NULL, true, false, 91, NOW(), NULL),
(gen_random_uuid(), 'SG_ZH', 'SG', 'Singapura', 'zh-CN', '中文 / Mandarim', 'SGD', '$', 'Asia/Singapore', '(UTC+08) Ásia/Singapura', 'dd/MM/yyyy', 'HH:mm', '🇸🇬', NULL, true, false, 92, NOW(), NULL),
(gen_random_uuid(), 'KR_KO', 'KR', 'Coreia do Sul', 'ko-KR', '한국어 / Coreano', 'KRW', '₩', 'Asia/Seoul', '(UTC+09) Ásia/Seul', 'yyyy.MM.dd', 'HH:mm', '🇰🇷', NULL, true, false, 94, NOW(), NULL),

(gen_random_uuid(), 'IN_HI', 'IN', 'Índia', 'hi-IN', 'हिन्दी / Hindi', 'INR', '₹', 'Asia/Kolkata', '(UTC+05:30) Ásia/Kolkata', 'dd/MM/yyyy', 'HH:mm', '🇮🇳', NULL, true, false, 100, NOW(), NULL),
(gen_random_uuid(), 'BD_BN', 'BD', 'Bangladesh', 'bn-BD', 'বাংলা / Bengali', 'BDT', '৳', 'Asia/Dhaka', '(UTC+06) Ásia/Dhaka', 'dd/MM/yyyy', 'HH:mm', '🇧🇩', NULL, true, false, 101, NOW(), NULL),
(gen_random_uuid(), 'ID_ID', 'ID', 'Indonésia', 'id-ID', 'Bahasa Indonesia / Indonésio', 'IDR', 'Rp', 'Asia/Jakarta', '(UTC+07) Ásia/Jakarta', 'dd/MM/yyyy', 'HH:mm', '🇮🇩', NULL, true, false, 102, NOW(), NULL),
(gen_random_uuid(), 'TL_ID', 'TL', 'Timor-Leste', 'id-ID', 'Bahasa Indonesia / Indonésio', 'USD', '$', 'Asia/Dili', '(UTC+09) Ásia/Díli', 'dd/MM/yyyy', 'HH:mm', '🇹🇱', NULL, true, false, 103, NOW(), NULL),

(gen_random_uuid(), 'AE_AR', 'AE', 'Emirados Árabes Unidos', 'ar-AE', 'العربية / Árabe', 'AED', 'د.إ', 'Asia/Dubai', '(UTC+04) Ásia/Dubai', 'dd/MM/yyyy', 'HH:mm', '🇦🇪', NULL, true, false, 110, NOW(), NULL),
(gen_random_uuid(), 'EG_AR', 'EG', 'Egito', 'ar-AE', 'العربية / Árabe', 'EGP', '£', 'Africa/Cairo', '(UTC+02/+03) África/Cairo', 'dd/MM/yyyy', 'HH:mm', '🇪🇬', NULL, true, false, 111, NOW(), NULL),
(gen_random_uuid(), 'DZ_AR', 'DZ', 'Argélia', 'ar-AE', 'العربية / Árabe', 'DZD', 'دج', 'Africa/Algiers', '(UTC+01) África/Argel', 'dd/MM/yyyy', 'HH:mm', '🇩🇿', NULL, true, false, 112, NOW(), NULL),
(gen_random_uuid(), 'MA_AR', 'MA', 'Marrocos', 'ar-AE', 'العربية / Árabe', 'MAD', 'د.م.', 'Africa/Casablanca', '(UTC+01) África/Casablanca', 'dd/MM/yyyy', 'HH:mm', '🇲🇦', NULL, true, false, 113, NOW(), NULL),
(gen_random_uuid(), 'SD_AR', 'SD', 'Sudão', 'ar-AE', 'العربية / Árabe', 'SDG', 'ج.س.', 'Africa/Khartoum', '(UTC+02) África/Cartum', 'dd/MM/yyyy', 'HH:mm', '🇸🇩', NULL, true, false, 114, NOW(), NULL),
(gen_random_uuid(), 'TN_AR', 'TN', 'Tunísia', 'ar-AE', 'العربية / Árabe', 'TND', 'د.ت', 'Africa/Tunis', '(UTC+01) África/Tunes', 'dd/MM/yyyy', 'HH:mm', '🇹🇳', NULL, true, false, 115, NOW(), NULL),

(gen_random_uuid(), 'GR_EL', 'GR', 'Grécia', 'el-GR', 'Ελληνικά / Grego', 'EUR', '€', 'Europe/Athens', '(UTC+02/+03) Europa/Atenas', 'dd/MM/yyyy', 'HH:mm', '🇬🇷', NULL, true, false, 120, NOW(), NULL),
(gen_random_uuid(), 'CY_EL', 'CY', 'Chipre', 'el-GR', 'Ελληνικά / Grego', 'EUR', '€', 'Asia/Nicosia', '(UTC+02/+03) Ásia/Nicósia', 'dd/MM/yyyy', 'HH:mm', '🇨🇾', NULL, true, false, 121, NOW(), NULL),
(gen_random_uuid(), 'NL_NL', 'NL', 'Países Baixos', 'nl-NL', 'Nederlands / Holandês', 'EUR', '€', 'Europe/Amsterdam', '(UTC+01/+02) Europa/Amesterdão', 'dd-MM-yyyy', 'HH:mm', '🇳🇱', NULL, true, false, 122, NOW(), NULL),
(gen_random_uuid(), 'BE_NL', 'BE', 'Bélgica', 'nl-NL', 'Nederlands / Holandês', 'EUR', '€', 'Europe/Brussels', '(UTC+01/+02) Europa/Bruxelas', 'dd/MM/yyyy', 'HH:mm', '🇧🇪', NULL, true, false, 123, NOW(), NULL),
(gen_random_uuid(), 'DK_DA', 'DK', 'Dinamarca', 'da-DK', 'Dansk / Dinamarquês', 'DKK', 'kr', 'Europe/Copenhagen', '(UTC+01/+02) Europa/Copenhaga', 'dd.MM.yyyy', 'HH:mm', '🇩🇰', NULL, true, false, 124, NOW(), NULL),
(gen_random_uuid(), 'BG_BG', 'BG', 'Bulgária', 'bg-BG', 'Български / Búlgaro', 'BGN', 'лв', 'Europe/Sofia', '(UTC+02/+03) Europa/Sófia', 'dd.MM.yyyy', 'HH:mm', '🇧🇬', NULL, true, false, 125, NOW(), NULL)
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
    priority = EXCLUDED.priority,
    updated_at = NOW();