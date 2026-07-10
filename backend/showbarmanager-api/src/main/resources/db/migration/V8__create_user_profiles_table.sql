CREATE TABLE user_profiles (
    user_id UUID NOT NULL,
    profile_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_user_profiles PRIMARY KEY (user_id, profile_id),

    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_profiles_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id
    ON user_profiles (user_id);

CREATE INDEX idx_user_profiles_profile_id
    ON user_profiles (profile_id);