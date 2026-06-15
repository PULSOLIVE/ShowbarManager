ALTER TABLE branding_settings
ADD COLUMN IF NOT EXISTS setting_key VARCHAR(100) NOT NULL DEFAULT 'default';

UPDATE branding_settings
SET setting_key = 'default'
WHERE setting_key IS NULL OR setting_key = '';

CREATE UNIQUE INDEX IF NOT EXISTS uk_branding_settings_setting_key
ON branding_settings(setting_key);