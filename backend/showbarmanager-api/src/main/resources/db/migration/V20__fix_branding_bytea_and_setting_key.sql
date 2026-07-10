DELETE FROM branding_settings bs
WHERE bs.setting_key = 'default'
  AND EXISTS (
    SELECT 1
    FROM branding_settings existing
    WHERE existing.setting_key = 'DEFAULT'
  );

UPDATE branding_settings
SET setting_key = 'DEFAULT'
WHERE setting_key = 'default'
   OR setting_key IS NULL
   OR setting_key = '';

ALTER TABLE branding_settings
ALTER COLUMN setting_key SET DEFAULT 'DEFAULT';

ALTER TABLE branding_assets
ALTER COLUMN content TYPE bytea
USING content::bytea;