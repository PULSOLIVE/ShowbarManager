package com.showbarmanager.api.modules.settings.branding;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface BrandingAssetRepository extends JpaRepository<BrandingAsset, UUID> {
    Optional<BrandingAsset> findByAssetKey(String assetKey);
    Optional<BrandingAsset> findByAssetKeyAndActiveTrue(String assetKey);
}
