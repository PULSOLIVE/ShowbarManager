package com.showbarmanager.api.modules.settings.profiles;

import com.showbarmanager.api.modules.settings.profiles.dto.CreateProfileRequest;
import com.showbarmanager.api.modules.settings.profiles.dto.ProfileResponse;
import com.showbarmanager.api.modules.settings.profiles.dto.UpdateProfileRequest;
import com.showbarmanager.api.responses.ApiResponse;
import com.showbarmanager.api.security.RequirePermission;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    @RequirePermission("PROFILES_CREATE")
    public ApiResponse<ProfileResponse> create(@Valid @RequestBody CreateProfileRequest request) {
        return new ApiResponse<>(
                true,
                "Perfil criado com sucesso",
                profileService.create(request)
        );
    }

    @GetMapping
    @RequirePermission("PROFILES_VIEW")
    public ApiResponse<List<ProfileResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Perfis listados com sucesso",
                profileService.findAll()
        );
    }

    @GetMapping("/{id}")
    @RequirePermission("PROFILES_VIEW")
    public ApiResponse<ProfileResponse> findById(@PathVariable UUID id) {
        return new ApiResponse<>(
                true,
                "Perfil encontrado com sucesso",
                profileService.findById(id)
        );
    }

    @PutMapping("/{id}")
    @RequirePermission("PROFILES_UPDATE")
    public ApiResponse<ProfileResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Perfil atualizado com sucesso",
                profileService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @RequirePermission("PROFILES_DELETE")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        profileService.delete(id);

        return new ApiResponse<>(
                true,
                "Perfil excluído com sucesso",
                null
        );
    }
}