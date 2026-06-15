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

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}