package com.showbarmanager.api.modules.settings.countries;

import com.showbarmanager.api.modules.settings.countries.dto.CountryFiscalRuleResponse;
import com.showbarmanager.api.modules.settings.countries.dto.CreateCountryFiscalRuleRequest;
import com.showbarmanager.api.modules.settings.countries.dto.UpdateCountryFiscalRuleRequest;
import com.showbarmanager.api.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings/countries")
public class CountryFiscalRuleController {

    private final CountryFiscalRuleService countryFiscalRuleService;

    public CountryFiscalRuleController(
            CountryFiscalRuleService countryFiscalRuleService
    ) {
        this.countryFiscalRuleService = countryFiscalRuleService;
    }

    @PostMapping
    public ApiResponse<CountryFiscalRuleResponse> create(
            @Valid @RequestBody CreateCountryFiscalRuleRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Regra fiscal criada com sucesso",
                countryFiscalRuleService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<CountryFiscalRuleResponse>> findAll() {
        return new ApiResponse<>(
                true,
                "Regras fiscais listadas com sucesso",
                countryFiscalRuleService.findAll()
        );
    }

    @GetMapping("/active")
    public ApiResponse<List<CountryFiscalRuleResponse>> findActive() {
        return new ApiResponse<>(
                true,
                "Regras fiscais ativas listadas com sucesso",
                countryFiscalRuleService.findActive()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<CountryFiscalRuleResponse> findById(
            @PathVariable UUID id
    ) {
        return new ApiResponse<>(
                true,
                "Regra fiscal encontrada com sucesso",
                countryFiscalRuleService.findById(id)
        );
    }

    @GetMapping("/country/{countryCode}")
    public ApiResponse<CountryFiscalRuleResponse> findByCountryCode(
            @PathVariable String countryCode
    ) {
        return new ApiResponse<>(
                true,
                "Regra fiscal do país encontrada com sucesso",
                countryFiscalRuleService.findByCountryCode(countryCode)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<CountryFiscalRuleResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCountryFiscalRuleRequest request
    ) {
        return new ApiResponse<>(
                true,
                "Regra fiscal atualizada com sucesso",
                countryFiscalRuleService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        countryFiscalRuleService.delete(id);

        return new ApiResponse<>(
                true,
                "Regra fiscal excluída com sucesso",
                null
        );
    }
}