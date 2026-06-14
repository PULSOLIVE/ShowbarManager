export interface TenantEnvironmentRule {
  id: string
  name: string
  description: string
  ruleKey: string
  enabled: boolean
  priority: number
  systemRule: boolean
  createdAt: string
  updatedAt: string | null
}

export interface CreateTenantEnvironmentRuleRequest {
  name: string
  description: string
  ruleKey: string
  enabled: boolean
  priority: number
  systemRule: boolean
}

export interface UpdateTenantEnvironmentRuleRequest {
  name: string
  description: string
  ruleKey: string
  enabled: boolean
  priority: number
  systemRule: boolean
}