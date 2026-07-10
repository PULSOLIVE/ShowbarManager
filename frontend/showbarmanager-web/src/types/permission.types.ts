export interface Permission {
  id: string
  code: string
  name: string
  module: string
  action: string
  description: string
  active: boolean
  systemPermission: boolean
  priority: number
  createdAt: string
  updatedAt: string | null
}

export interface CreatePermissionRequest {
  code: string
  name: string
  module: string
  action: string
  description: string
  active: boolean
  systemPermission: boolean
  priority: number
}

export interface UpdatePermissionRequest {
  name: string
  module: string
  action: string
  description: string
  active: boolean
  systemPermission: boolean
  priority: number
}