CREATE TABLE profile_permissions (
    profile_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_profile_permissions PRIMARY KEY (profile_id, permission_id),

    CONSTRAINT fk_profile_permissions_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profile_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_profile_permissions_profile_id
    ON profile_permissions (profile_id);

CREATE INDEX idx_profile_permissions_permission_id
    ON profile_permissions (permission_id);