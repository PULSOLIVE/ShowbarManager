export interface Profile {
  id: string
  code: string
  name: string
  description: string
  active: boolean
  systemProfile: boolean
  priority: number
  permissionIds?: string[]
  createdAt: string
  updatedAt: string | null
}

export interface CreateProfileRequest {
  code: string
  name: string
  description: string
  active: boolean
  systemProfile: boolean
  priority: number
  permissionIds?: string[]
}

export interface UpdateProfileRequest {
  name: string
  description: string
  active: boolean
  systemProfile: boolean
  priority: number
  permissionIds?: string[]
}