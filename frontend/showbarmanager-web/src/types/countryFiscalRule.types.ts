export interface CountryFiscalRule {
  id: string
  countryCode: string
  countryName: string
  taxName: string
  description: string
  fields: string[]
  active: boolean
  priority: number
  createdAt: string
  updatedAt: string | null
}

export interface CreateCountryFiscalRuleRequest {
  countryCode: string
  countryName: string
  taxName: string
  description: string
  fields: string[]
  active: boolean
  priority: number
}

export interface UpdateCountryFiscalRuleRequest {
  countryCode: string
  countryName: string
  taxName: string
  description: string
  fields: string[]
  active: boolean
  priority: number
}