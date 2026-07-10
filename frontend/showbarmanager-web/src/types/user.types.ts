export interface User {
  id: string
  tenantId: string | null
  name: string
  email: string
  active: boolean
  masterUser: boolean
  developerUser: boolean
  roles: string[]
  profiles?: string[]
  permissions?: string[]
  effectivePermissions?: string[]
  profileIds?: string[]
  permissionIds?: string[]
  languageCode?: string | null
  createdAt: string
  updatedAt: string | null
}

export interface CreateUserRequest {
  tenantId: string
  name: string
  email: string
  password: string
  role: string
  profileIds?: string[]
  permissionIds?: string[]
  languageCode?: string | null
}

export interface UpdateUserRequest {
  name: string
  email: string
  role: string
  active: boolean
  profileIds?: string[]
  permissionIds?: string[]
  languageCode?: string | null
}