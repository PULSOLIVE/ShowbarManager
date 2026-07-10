import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type {
  CreateInternationalizationRequest,
  Internationalization,
  UpdateInternationalizationRequest,
} from "../types/internationalization.types"

export const InternationalizationService = {
  async list(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization"
    )

    return response.data.data
  },

  async listActive(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization/active"
    )

    return response.data.data
  },

  async listActiveCountries(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization/countries"
    )

    return response.data.data
  },

  async listActiveLanguages(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization/languages"
    )

    return response.data.data
  },

  async listActiveByCountryCode(
    countryCode: string
  ): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      `/settings/internationalization/country/${countryCode}`
    )

    return response.data.data
  },

  async create(
    payload: CreateInternationalizationRequest
  ): Promise<Internationalization> {
    const response = await apiClient.post<ApiResponse<Internationalization>>(
      "/settings/internationalization",
      payload
    )

    return response.data.data
  },

  async update(
    id: string,
    payload: UpdateInternationalizationRequest
  ): Promise<Internationalization> {
    const response = await apiClient.put<ApiResponse<Internationalization>>(
      `/settings/internationalization/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/settings/internationalization/${id}`
    )
  },
}