package com.showbarmanager.api.modules.settings.branding;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.branding.dto.BrandingAssetResponse;
import com.showbarmanager.api.modules.settings.branding.dto.BrandingSettingsResponse;
import com.showbarmanager.api.modules.settings.branding.dto.UpdateBrandingSettingsRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

@Service
public class BrandingService {

    private static final String DEFAULT_SETTING_KEY = "DEFAULT";
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

    private static final Set<String> ALLOWED_ASSET_KEYS = Set.of(
            "sidebarLogoUrl",
            "sidebarCollapsedLogoUrl",
            "darkLogoUrl",
            "lightLogoUrl",
            "reportLogoUrl",
            "mobileLogoUrl",
            "faviconUrl",
            "darkSidebarLogoUrl",
            "darkSidebarCollapsedLogoUrl",
            "darkReportLogoUrl",
            "darkMobileLogoUrl",
            "darkFaviconUrl",
            "darkLoginLogoUrl",
            "lightSidebarLogoUrl",
            "lightSidebarCollapsedLogoUrl",
            "lightReportLogoUrl",
            "lightMobileLogoUrl",
            "lightFaviconUrl",
            "lightLoginLogoUrl"
    );

    private final BrandingSettingsRepository settingsRepository;
    private final BrandingAssetRepository assetRepository;

    public BrandingService(
            BrandingSettingsRepository settingsRepository,
            BrandingAssetRepository assetRepository
    ) {
        this.settingsRepository = settingsRepository;
        this.assetRepository = assetRepository;
    }

    public BrandingSettingsResponse getSettings() {
        BrandingSettings settings = settingsRepository
                .findBySettingKey(DEFAULT_SETTING_KEY)
                .orElseGet(this::createDefaultSettings);

        return toSettingsResponse(settings);
    }

    public BrandingSettingsResponse updateSettings(UpdateBrandingSettingsRequest request) {
        BrandingSettings settings = settingsRepository
                .findBySettingKey(DEFAULT_SETTING_KEY)
                .orElseGet(this::createDefaultSettings);

        settings.setPublicName(normalize(request.getPublicName()));

        settings.setDarkPrimaryColor(normalize(request.getDarkPrimaryColor()));
        settings.setDarkSecondaryColor(normalize(request.getDarkSecondaryColor()));
        settings.setDarkBackgroundColor(normalize(request.getDarkBackgroundColor()));
        settings.setDarkCardColor(normalize(request.getDarkCardColor()));
        settings.setDarkCardSoftColor(normalize(request.getDarkCardSoftColor()));
        settings.setDarkSurfaceColor(normalize(request.getDarkSurfaceColor()));
        settings.setDarkTextColor(normalize(request.getDarkTextColor()));
        settings.setDarkMutedColor(normalize(request.getDarkMutedColor()));
        settings.setDarkBorderColor(normalize(request.getDarkBorderColor()));
        settings.setDarkSuccessColor(normalize(request.getDarkSuccessColor()));
        settings.setDarkWarningColor(normalize(request.getDarkWarningColor()));
        settings.setDarkDangerColor(normalize(request.getDarkDangerColor()));

        settings.setLightPrimaryColor(normalize(request.getLightPrimaryColor()));
        settings.setLightSecondaryColor(normalize(request.getLightSecondaryColor()));
        settings.setLightBackgroundColor(normalize(request.getLightBackgroundColor()));
        settings.setLightCardColor(normalize(request.getLightCardColor()));
        settings.setLightCardSoftColor(normalize(request.getLightCardSoftColor()));
        settings.setLightSurfaceColor(normalize(request.getLightSurfaceColor()));
        settings.setLightTextColor(normalize(request.getLightTextColor()));
        settings.setLightMutedColor(normalize(request.getLightMutedColor()));
        settings.setLightBorderColor(normalize(request.getLightBorderColor()));
        settings.setLightSuccessColor(normalize(request.getLightSuccessColor()));
        settings.setLightWarningColor(normalize(request.getLightWarningColor()));
        settings.setLightDangerColor(normalize(request.getLightDangerColor()));

        settings.setActive(request.getActive() != null ? request.getActive() : true);

        return toSettingsResponse(settingsRepository.save(settings));
    }

    public List<BrandingAssetResponse> listAssets() {
        return assetRepository.findAll()
                .stream()
                .map(asset -> toAssetResponse(asset, false))
                .toList();
    }

    public List<BrandingAssetResponse> listPublicAssets() {
        return assetRepository.findAllByActiveTrue()
                .stream()
                .map(asset -> toAssetResponse(asset, true))
                .toList();
    }

    public BrandingAssetResponse uploadAsset(String assetKey, MultipartFile file) {
        validateAssetKey(assetKey);

        if (file == null || file.isEmpty()) {
            throw new BusinessException("Nenhum ficheiro enviado.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("O ficheiro deve ter no máximo 2 MB.");
        }

        String contentType = normalizeContentType(file.getContentType());

        if (!isAllowedContentType(contentType)) {
            throw new BusinessException("Formato inválido. Use PNG, SVG, WEBP ou ICO.");
        }

        BrandingAsset asset = assetRepository
                .findByAssetKey(assetKey)
                .orElseGet(BrandingAsset::new);

        try {
            asset.setAssetKey(assetKey);
            asset.setFileName(safeFileName(file.getOriginalFilename(), assetKey));
            asset.setContentType(contentType);
            asset.setFileSize(file.getSize());
            asset.setContent(file.getBytes());
            asset.setActive(true);

            return toAssetResponse(assetRepository.save(asset), false);
        } catch (IOException exception) {
            throw new BusinessException("Não foi possível processar o ficheiro enviado.");
        }
    }

    public byte[] getAssetContent(String assetKey) {
        return getActiveAsset(assetKey).getContent();
    }

    public String getAssetContentType(String assetKey) {
        return getActiveAsset(assetKey).getContentType();
    }

    public byte[] getPublicAssetContent(String assetKey) {
        return getActiveAsset(assetKey).getContent();
    }

    public String getPublicAssetContentType(String assetKey) {
        return getActiveAsset(assetKey).getContentType();
    }

    public BrandingAssetResponse activateAsset(String assetKey) {
        validateAssetKey(assetKey);

        BrandingAsset asset = findAsset(assetKey);
        asset.setActive(true);

        return toAssetResponse(assetRepository.save(asset), false);
    }

    public BrandingAssetResponse deactivateAsset(String assetKey) {
        validateAssetKey(assetKey);

        BrandingAsset asset = findAsset(assetKey);
        asset.setActive(false);

        return toAssetResponse(assetRepository.save(asset), false);
    }

    public void deleteAsset(String assetKey) {
        validateAssetKey(assetKey);

        BrandingAsset asset = findAsset(assetKey);
        assetRepository.delete(asset);
    }

    private BrandingAsset getActiveAsset(String assetKey) {
        validateAssetKey(assetKey);

        return assetRepository
                .findByAssetKeyAndActiveTrue(assetKey)
                .orElseThrow(() -> new ResourceNotFoundException("Asset de branding não encontrado."));
    }

    private BrandingAsset findAsset(String assetKey) {
        validateAssetKey(assetKey);

        return assetRepository.findByAssetKey(assetKey)
                .orElseThrow(() -> new ResourceNotFoundException("Asset de branding não encontrado."));
    }

    private BrandingSettings createDefaultSettings() {
        BrandingSettings settings = new BrandingSettings();

        settings.setSettingKey(DEFAULT_SETTING_KEY);
        settings.setPublicName("ShowbarManager");

        settings.setDarkPrimaryColor("#3B82F6");
        settings.setDarkSecondaryColor("#38BDF8");
        settings.setDarkBackgroundColor("#07111F");
        settings.setDarkCardColor("#0D1728");
        settings.setDarkCardSoftColor("#111D31");
        settings.setDarkSurfaceColor("#14223A");
        settings.setDarkTextColor("#E5EDF7");
        settings.setDarkMutedColor("#8EA0B8");
        settings.setDarkBorderColor("#203047");
        settings.setDarkSuccessColor("#22C55E");
        settings.setDarkWarningColor("#F59E0B");
        settings.setDarkDangerColor("#EF4444");

        settings.setLightPrimaryColor("#2563EB");
        settings.setLightSecondaryColor("#0284C7");
        settings.setLightBackgroundColor("#EDF5FF");
        settings.setLightCardColor("#FFFFFF");
        settings.setLightCardSoftColor("#F7FBFF");
        settings.setLightSurfaceColor("#E6F0FF");
        settings.setLightTextColor("#081526");
        settings.setLightMutedColor("#5D7189");
        settings.setLightBorderColor("#C4D7ED");
        settings.setLightSuccessColor("#16A34A");
        settings.setLightWarningColor("#D97706");
        settings.setLightDangerColor("#DC2626");

        settings.setActive(true);

        return settingsRepository.save(settings);
    }

    private void validateAssetKey(String assetKey) {
        if (assetKey == null || !ALLOWED_ASSET_KEYS.contains(assetKey)) {
            throw new BusinessException("Tipo de asset de branding inválido.");
        }
    }

    private boolean isAllowedContentType(String contentType) {
        return contentType != null && List.of(
                "image/png",
                "image/svg+xml",
                "image/webp",
                "image/x-icon",
                "image/vnd.microsoft.icon"
        ).contains(contentType);
    }

    private String normalizeContentType(String contentType) {
        return contentType == null ? null : contentType.trim().toLowerCase();
    }

    private String safeFileName(String originalFileName, String fallback) {
        String fileName = originalFileName == null || originalFileName.isBlank()
                ? fallback
                : originalFileName.trim();

        return fileName
                .replace("\\", "")
                .replace("/", "")
                .replace("..", "")
                .replace("\u0000", "");
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private BrandingSettingsResponse toSettingsResponse(BrandingSettings settings) {
        BrandingSettingsResponse response = new BrandingSettingsResponse();

        response.setId(settings.getId());
        response.setPublicName(settings.getPublicName());

        response.setDarkPrimaryColor(settings.getDarkPrimaryColor());
        response.setDarkSecondaryColor(settings.getDarkSecondaryColor());
        response.setDarkBackgroundColor(settings.getDarkBackgroundColor());
        response.setDarkCardColor(settings.getDarkCardColor());
        response.setDarkCardSoftColor(settings.getDarkCardSoftColor());
        response.setDarkSurfaceColor(settings.getDarkSurfaceColor());
        response.setDarkTextColor(settings.getDarkTextColor());
        response.setDarkMutedColor(settings.getDarkMutedColor());
        response.setDarkBorderColor(settings.getDarkBorderColor());
        response.setDarkSuccessColor(settings.getDarkSuccessColor());
        response.setDarkWarningColor(settings.getDarkWarningColor());
        response.setDarkDangerColor(settings.getDarkDangerColor());

        response.setLightPrimaryColor(settings.getLightPrimaryColor());
        response.setLightSecondaryColor(settings.getLightSecondaryColor());
        response.setLightBackgroundColor(settings.getLightBackgroundColor());
        response.setLightCardColor(settings.getLightCardColor());
        response.setLightCardSoftColor(settings.getLightCardSoftColor());
        response.setLightSurfaceColor(settings.getLightSurfaceColor());
        response.setLightTextColor(settings.getLightTextColor());
        response.setLightMutedColor(settings.getLightMutedColor());
        response.setLightBorderColor(settings.getLightBorderColor());
        response.setLightSuccessColor(settings.getLightSuccessColor());
        response.setLightWarningColor(settings.getLightWarningColor());
        response.setLightDangerColor(settings.getLightDangerColor());

        response.setActive(settings.getActive());
        response.setCreatedAt(settings.getCreatedAt());
        response.setUpdatedAt(settings.getUpdatedAt());

        return response;
    }

    private BrandingAssetResponse toAssetResponse(BrandingAsset asset, boolean publicUrl) {
        BrandingAssetResponse response = new BrandingAssetResponse();
        String encodedAssetKey = URLEncoder.encode(asset.getAssetKey(), StandardCharsets.UTF_8);

        String baseUrl = publicUrl
                ? "/api/v1/public/branding/assets/"
                : "/api/v1/settings/branding/assets/";

        response.setId(asset.getId());
        response.setAssetKey(asset.getAssetKey());
        response.setFileName(asset.getFileName());
        response.setContentType(asset.getContentType());
        response.setFileSize(asset.getFileSize());
        response.setFileUrl(baseUrl + encodedAssetKey + "/file");
        response.setActive(asset.getActive());
        response.setCreatedAt(asset.getCreatedAt());
        response.setUpdatedAt(asset.getUpdatedAt());

        return response;
    }
}