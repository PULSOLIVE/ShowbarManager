export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  active: boolean
  masterUser: boolean
  developerUser: boolean
  roles: string[]
  createdAt: string
  updatedAt: string | null
}

export interface CreateUserRequest {
  tenantId: string
  name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserRequest {
  name: string
  email: string
  role: string
  active: boolean
}