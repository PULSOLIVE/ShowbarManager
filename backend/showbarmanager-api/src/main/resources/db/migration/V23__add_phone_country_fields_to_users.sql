ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone_country_code VARCHAR(2);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone_dial_code VARCHAR(8);
