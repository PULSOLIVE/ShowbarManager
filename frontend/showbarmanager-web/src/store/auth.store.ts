import { create } from "zustand"
import type { LoginResponse } from "../types/auth.types"

interface AuthState {
  user: LoginResponse | null
  token: string | null
  isAuthenticated: boolean
  roles: string[]
  isMaster: boolean
  isDeveloper: boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  canManageTenants: () => boolean
  canManageUsers: () => boolean
  canViewSettings: () => boolean
  canCreate: () => boolean
  canEdit: () => boolean
  canDelete: () => boolean
  setAuth: (data: LoginResponse) => void
  restoreSession: () => void
  logout: () => void
}

function normalizeRoles(roles: string[] = []) {
  return roles.map((role) => role.replace("ROLE_", ""))
}

function buildPermissions(user: LoginResponse | null) {
  const roles = normalizeRoles(user?.roles || [])

  return {
    roles,
    isMaster: !!user?.masterUser || roles.includes("ADMIN_MASTER"),
    isDeveloper: !!user?.developerUser || roles.includes("DEVELOPER_MASTER"),
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("showbar_token"),
  isAuthenticated: !!localStorage.getItem("showbar_token"),
  roles: [],
  isMaster: false,
  isDeveloper: false,

  hasRole: (role) => get().roles.includes(role.replace("ROLE_", "")),

  hasAnyRole: (roles) =>
    roles.some((role) => get().roles.includes(role.replace("ROLE_", ""))),

  canManageTenants: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  canManageUsers: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  canViewSettings: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER"]),

  canCreate: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  canEdit: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  canDelete: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  setAuth: (data) => {
    const permissions = buildPermissions(data)

    localStorage.setItem("showbar_token", data.token)
    localStorage.setItem("showbar_tenant_id", data.tenantId)
    localStorage.setItem("showbar_user", JSON.stringify(data))

    set({
      user: data,
      token: data.token,
      isAuthenticated: true,
      ...permissions,
    })
  },

  restoreSession: () => {
    const token = localStorage.getItem("showbar_token")
    const storedUser = localStorage.getItem("showbar_user")

    if (token && storedUser) {
      const user = JSON.parse(storedUser) as LoginResponse
      const permissions = buildPermissions(user)

      set({
        token,
        user,
        isAuthenticated: true,
        ...permissions,
      })

      return
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      roles: [],
      isMaster: false,
      isDeveloper: false,
    })
  },

  logout: () => {
    localStorage.removeItem("showbar_token")
    localStorage.removeItem("showbar_tenant_id")
    localStorage.removeItem("showbar_user")

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      roles: [],
      isMaster: false,
      isDeveloper: false,
    })
  },
}))