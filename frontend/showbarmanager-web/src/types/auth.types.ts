export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  userId: string
  tenantId: string
  name: string
  email: string
  roles: string[]
  masterUser: boolean
  developerUser: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}