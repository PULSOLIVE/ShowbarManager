package com.showbarmanager.api.config;

import com.showbarmanager.api.multitenancy.TenantInterceptor;
import com.showbarmanager.api.security.PermissionAuthorizationInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final TenantInterceptor tenantInterceptor;
    private final PermissionAuthorizationInterceptor permissionAuthorizationInterceptor;

    public WebConfig(
            TenantInterceptor tenantInterceptor,
            PermissionAuthorizationInterceptor permissionAuthorizationInterceptor
    ) {
        this.tenantInterceptor = tenantInterceptor;
        this.permissionAuthorizationInterceptor = permissionAuthorizationInterceptor;
    }

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(tenantInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/v1/health",
                        "/api/v1/auth/**"
                );

        registry.addInterceptor(permissionAuthorizationInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/v1/health",
                        "/api/v1/auth/**"
                );
    }
}