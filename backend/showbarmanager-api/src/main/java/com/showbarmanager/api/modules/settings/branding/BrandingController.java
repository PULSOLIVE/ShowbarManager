package com.showbarmanager.api.modules.settings.branding;

import com.showbarmanager.api.modules.settings.branding.dto.BrandingAssetResponse;
import com.showbarmanager.api.modules.settings.branding.dto.BrandingSettingsResponse;
import com.showbarmanager.api.modules.settings.branding.dto.UpdateBrandingSettingsRequest;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/settings/branding")
public class BrandingController {

    private final BrandingService brandingService;

    public BrandingController(BrandingService brandingService) {
        this.brandingService = brandingService;
    }

    @GetMapping
    public ApiResponse<BrandingSettingsResponse> getSettings() {
        return new ApiResponse<>(
                true,
                "Branding carregado com sucesso",
                brandingService.getSettings()
        );
    }

    @PutMapping
    public ApiResponse<BrandingSettingsResponse> updateSettings(
            @Valid @RequestBody UpdateBrandingSettingsRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Branding atualizado com sucesso",
                brandingService.updateSettings(request)
        );
    }

    @GetMapping("/assets")
    public ApiResponse<List<BrandingAssetResponse>> listAssets() {
        return new ApiResponse<>(
                true,
                "Assets de branding listados com sucesso",
                brandingService.listAssets()
        );
    }

    @PostMapping(
            value = "/assets/{assetKey}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<BrandingAssetResponse> uploadAsset(
            @PathVariable String assetKey,
            @RequestParam("file") MultipartFile file
    ) {
        return new ApiResponse<>(
                true,
                "Asset enviado com sucesso",
                brandingService.uploadAsset(assetKey, file)
        );
    }

    @GetMapping("/assets/{assetKey}/file")
    public ResponseEntity<byte[]> getAssetFile(@PathVariable String assetKey) {
        String contentType = brandingService.getAssetContentType(assetKey);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .cacheControl(CacheControl.noCache())
                .body(brandingService.getAssetContent(assetKey));
    }

    @PatchMapping("/assets/{assetKey}/activate")
    public ApiResponse<BrandingAssetResponse> activateAsset(
            @PathVariable String assetKey
    ) {
        return new ApiResponse<>(
                true,
                "Asset ativado com sucesso",
                brandingService.activateAsset(assetKey)
        );
    }

    @PatchMapping("/assets/{assetKey}/deactivate")
    public ApiResponse<BrandingAssetResponse> deactivateAsset(
            @PathVariable String assetKey
    ) {
        return new ApiResponse<>(
                true,
                "Asset desativado com sucesso",
                brandingService.deactivateAsset(assetKey)
        );
    }

    @DeleteMapping("/assets/{assetKey}")
    public ApiResponse<Void> deleteAsset(@PathVariable String assetKey) {
        brandingService.deleteAsset(assetKey);

        return new ApiResponse<>(
                true,
                "Asset eliminado com sucesso",
                null
        );
    }
}

@RestController
@RequestMapping("/api/v1/public/branding")
class PublicBrandingController {

    private final BrandingService brandingService;

    PublicBrandingController(BrandingService brandingService) {
        this.brandingService = brandingService;
    }

    @GetMapping("/assets")
    public ApiResponse<List<BrandingAssetResponse>> listPublicAssets() {
        return new ApiResponse<>(
                true,
                "Assets públicos de branding listados com sucesso",
                brandingService.listPublicAssets()
        );
    }

    @GetMapping("/assets/{assetKey}/file")
    public ResponseEntity<byte[]> getPublicAssetFile(@PathVariable String assetKey) {
        String contentType = brandingService.getPublicAssetContentType(assetKey);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic())
                .body(brandingService.getPublicAssetContent(assetKey));
    }
}