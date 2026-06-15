package com.showbarmanager.api.modules.settings.branding;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface BrandingSettingsRepository extends JpaRepository<BrandingSettings, UUID> {
    Optional<BrandingSettings> findBySettingKey(String settingKey);
}
