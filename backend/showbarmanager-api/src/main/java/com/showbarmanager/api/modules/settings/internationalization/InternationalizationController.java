package com.showbarmanager.api.modules.settings.internationalization;

import com.showbarmanager.api.modules.settings.internationalization.dto.CreateInternationalizationRequest;
import com.showbarmanager.api.modules.settings.internationalization.dto.InternationalizationResponse;
import com.showbarmanager.api.modules.settings.internationalization.dto.UpdateInternationalizationRequest;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings/internationalization")
public class InternationalizationController {

    private final InternationalizationService internationalizationService;

    public InternationalizationController(
            InternationalizationService internationalizationService
    ) {
        this.internationalizationService = internationalizationService;
    }

    @PostMapping
    public ApiResponse<InternationalizationResponse> create(
            @Valid @RequestBody CreateInternationalizationRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Configuração internacional criada com sucesso",
                internationalizationService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<InternationalizationResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Configurações internacionais listadas com sucesso",
                internationalizationService.findAll()
        );
    }

    @GetMapping("/active")
    public ApiResponse<List<InternationalizationResponse>> findActive() {
        return new ApiResponse<>(
                true,
                "Configurações internacionais ativas listadas com sucesso",
                internationalizationService.findActive()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<InternationalizationResponse> findById(
            @PathVariable UUID id
    ) {
        return new ApiResponse<>(
                true,
                "Configuração internacional encontrada com sucesso",
                internationalizationService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<InternationalizationResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateInternationalizationRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Configuração internacional atualizada com sucesso",
                internationalizationService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        internationalizationService.delete(id);

        return new ApiResponse<>(
                true,
                "Configuração internacional excluída com sucesso",
                null
        );
    }
}