import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type {
  CountryFiscalRule,
  CreateCountryFiscalRuleRequest,
  UpdateCountryFiscalRuleRequest,
} from "../types/countryFiscalRule.types"

export const CountryFiscalRuleService = {
  async list(): Promise<CountryFiscalRule[]> {
    const response = await apiClient.get<ApiResponse<CountryFiscalRule[]>>(
      "/settings/countries"
    )

    return response.data.data
  },

  async listActive(): Promise<CountryFiscalRule[]> {
    const response = await apiClient.get<ApiResponse<CountryFiscalRule[]>>(
      "/settings/countries/active"
    )

    return response.data.data
  },

  async findByCountryCode(countryCode: string): Promise<CountryFiscalRule> {
    const response = await apiClient.get<ApiResponse<CountryFiscalRule>>(
      `/settings/countries/country/${countryCode}`
    )

    return response.data.data
  },

  async create(
    payload: CreateCountryFiscalRuleRequest
  ): Promise<CountryFiscalRule> {
    const response = await apiClient.post<ApiResponse<CountryFiscalRule>>(
      "/settings/countries",
      payload
    )

    return response.data.data
  },

  async update(
    id: string,
    payload: UpdateCountryFiscalRuleRequest
  ): Promise<CountryFiscalRule> {
    const response = await apiClient.put<ApiResponse<CountryFiscalRule>>(
      `/settings/countries/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/settings/countries/${id}`)
  },
}