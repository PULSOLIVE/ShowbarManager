import { apiClient } from "../api/apiClient"

import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
} from "../types/auth.types"

export const AuthService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    )

    return response.data.data
  },
}