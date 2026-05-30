package com.showbarmanager.api.modules.settings.profiles;

import com.showbarmanager.api.exceptions.BusinessException;
import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import com.showbarmanager.api.modules.settings.profiles.dto.CreateProfileRequest;
import com.showbarmanager.api.modules.settings.profiles.dto.ProfileResponse;
import com.showbarmanager.api.modules.settings.profiles.dto.UpdateProfileRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileResponse create(CreateProfileRequest request) {
        String normalizedCode = normalizeCode(request.getCode());

        if (profileRepository.existsByCode(normalizedCode)) {
            throw new BusinessException("Já existe um perfil com este código.");
        }

        Profile profile = new Profile();
        profile.setCode(normalizedCode);
        profile.setName(request.getName());
        profile.setDescription(request.getDescription());
        profile.setActive(request.getActive() != null ? request.getActive() : true);
        profile.setSystemProfile(request.getSystemProfile() != null ? request.getSystemProfile() : false);
        profile.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        Profile savedProfile = profileRepository.save(profile);

        return toResponse(savedProfile);
    }

    public List<ProfileResponse> findAll() {
        return profileRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProfileResponse findById(UUID id) {
        Profile profile = findProfileById(id);

        return toResponse(profile);
    }

    public ProfileResponse update(UUID id, UpdateProfileRequest request) {
        Profile profile = findProfileById(id);

        profile.setName(request.getName());
        profile.setDescription(request.getDescription());

        if (request.getActive() != null) {
            profile.setActive(request.getActive());
        }

        if (request.getSystemProfile() != null) {
            profile.setSystemProfile(request.getSystemProfile());
        }

        if (request.getPriority() != null) {
            profile.setPriority(request.getPriority());
        }

        Profile savedProfile = profileRepository.save(profile);

        return toResponse(savedProfile);
    }

    public void delete(UUID id) {
        Profile profile = findProfileById(id);

        if (Boolean.TRUE.equals(profile.getSystemProfile())) {
            throw new BusinessException("Perfil de sistema não pode ser excluído.");
        }

        profileRepository.delete(profile);
    }

    private Profile findProfileById(UUID id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado."));
    }

    private String normalizeCode(String code) {
        return code == null ? null : code.trim().toUpperCase();
    }

    private ProfileResponse toResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();

        response.setId(profile.getId());
        response.setCode(profile.getCode());
        response.setName(profile.getName());
        response.setDescription(profile.getDescription());
        response.setActive(profile.getActive());
        response.setSystemProfile(profile.getSystemProfile());
        response.setPriority(profile.getPriority());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());

        return response;
    }
}