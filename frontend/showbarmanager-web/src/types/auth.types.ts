export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  userId: string
  tenantId: string | null
  name: string
  email: string
  roles: string[]
  permissions?: string[]
  effectivePermissions?: string[]
  masterUser: boolean
  developerUser: boolean
  languageCode?: string | null
  tenantLanguageCode?: string | null
  resolvedLanguageCode?: string | null
}

export type PasswordResetChannel = "email" | "sms"

export interface ForgotPasswordRequest {
  identifier: string
  channel: PasswordResetChannel
}

export interface ForgotPasswordResponse {
  resetToken?: string | null
  expiresInMinutes?: number | null
  maskedDestination?: string | null
}

export interface ResetPasswordRequest {
  identifier: string
  channel: PasswordResetChannel
  code: string
  newPassword: string
  confirmPassword: string
  resetToken?: string | null
}

export interface ResetPasswordResponse {
  success: boolean
  message?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}