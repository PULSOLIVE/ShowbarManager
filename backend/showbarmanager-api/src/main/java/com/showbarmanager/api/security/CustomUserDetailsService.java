package com.showbarmanager.api.security;

import com.showbarmanager.api.modules.users.User;
import com.showbarmanager.api.modules.users.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RbacAuthorityService rbacAuthorityService;

    public CustomUserDetailsService(
            UserRepository userRepository,
            RbacAuthorityService rbacAuthorityService
    ) {
        this.userRepository = userRepository;
        this.rbacAuthorityService = rbacAuthorityService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(rbacAuthorityService.buildAuthorities(user))
                .disabled(!user.getActive())
                .build();
    }
}