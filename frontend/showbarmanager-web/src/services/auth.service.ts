import { apiClient } from "../api/apiClient"

import type {
  ApiResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth.types"

export const AuthService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    )

    return response.data.data
  },

  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
      "/auth/forgot-password",
      payload
    )

    return response.data.data
  },

  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ApiResponse<ResetPasswordResponse>>(
      "/auth/reset-password",
      payload
    )

    return response.data.data
  },
}