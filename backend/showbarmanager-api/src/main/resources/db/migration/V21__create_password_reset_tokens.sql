ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(40);

CREATE UNIQUE INDEX IF NOT EXISTS uk_users_phone
ON users(phone)
WHERE phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    identifier VARCHAR(180) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    reset_token VARCHAR(120) NOT NULL UNIQUE,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(80),
    used_ip_address VARCHAR(80),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
ON password_reset_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_reset_token
ON password_reset_tokens(reset_token);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_identifier_channel
ON password_reset_tokens(identifier, channel);