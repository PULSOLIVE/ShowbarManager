package com.showbarmanager.api.modules.settings.profiles;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    boolean existsByCode(String code);

    Optional<Profile> findByCode(String code);
}