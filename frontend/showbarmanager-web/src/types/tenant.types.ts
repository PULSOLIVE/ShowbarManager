export interface Tenant {
  id: string
  name: string
  slug: string
  country: string
  currency: string
  language: string
  timezone: string
  active: boolean
  createdAt: string
  updatedAt: string | null
}

export interface CreateTenantRequest {
  name: string
  slug: string
  country: string
  currency: string
  language: string
  timezone: string
  active: boolean
}

export interface UpdateTenantRequest {
  name: string
  slug: string
  country: string
  currency: string
  language: string
  timezone: string
  active: boolean
}