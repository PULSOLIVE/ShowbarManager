import { create } from "zustand"
import type { LoginResponse } from "../types/auth.types"

const TOKEN_KEY = "showbar_token"
const TENANT_ID_KEY = "showbar_tenant_id"
const USER_ID_KEY = "showbar_user_id"
const USER_KEY = "showbar_user"

interface AuthState {
  user: LoginResponse | null
  token: string | null
  tenantId: string | null
  userId: string | null
  isAuthenticated: boolean
  roles: string[]
  permissions: string[]
  isMaster: boolean
  isDeveloper: boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
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

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Mantém o estado em memória caso o navegador bloqueie o localStorage.
  }
}

function removeStorage(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Evita quebra caso o navegador bloqueie o localStorage.
  }
}

function normalizeRoles(roles: string[] = []) {
  return roles
    .map((role) => role.replace("ROLE_", "").trim().toUpperCase())
    .filter(Boolean)
}

function normalizePermissions(permissions: string[] = []) {
  return permissions
    .map((permission) => permission.trim().toUpperCase())
    .filter(Boolean)
}

function buildPermissions(user: LoginResponse | null) {
  const roles = normalizeRoles(user?.roles || [])
  const permissions = normalizePermissions([
    ...(user?.permissions || []),
    ...(user?.effectivePermissions || []),
  ])

  return {
    roles,
    permissions,
    isMaster: !!user?.masterUser || roles.includes("ADMIN_MASTER"),
    isDeveloper: !!user?.developerUser || roles.includes("DEVELOPER_MASTER"),
  }
}

function clearStorage() {
  removeStorage(TOKEN_KEY)
  removeStorage(TENANT_ID_KEY)
  removeStorage(USER_ID_KEY)
  removeStorage(USER_KEY)
}

function getInitialToken() {
  return readStorage(TOKEN_KEY)
}

function getInitialTenantId() {
  return readStorage(TENANT_ID_KEY)
}

function getInitialUserId() {
  return readStorage(USER_ID_KEY)
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: getInitialToken(),
  tenantId: getInitialTenantId(),
  userId: getInitialUserId(),
  isAuthenticated: !!getInitialToken(),
  roles: [],
  permissions: [],
  isMaster: false,
  isDeveloper: false,

  hasRole: (role) => {
    const normalizedRole = role.replace("ROLE_", "").trim().toUpperCase()
    return get().roles.includes(normalizedRole)
  },

  hasAnyRole: (roles) =>
    roles.some((role) => {
      const normalizedRole = role.replace("ROLE_", "").trim().toUpperCase()
      return get().roles.includes(normalizedRole)
    }),

  hasPermission: (permission) => {
    const state = get()

    if (state.isMaster || state.isDeveloper) {
      return true
    }

    return state.permissions.includes(permission.trim().toUpperCase())
  },

  hasAnyPermission: (permissions) => {
    const state = get()

    if (state.isMaster || state.isDeveloper) {
      return true
    }

    return permissions.some((permission) =>
      state.permissions.includes(permission.trim().toUpperCase())
    )
  },

  canManageTenants: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]) ||
    get().hasAnyPermission(["TENANTS_VIEW", "TENANTS_CREATE", "TENANTS_UPDATE"]),

  canManageUsers: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]) ||
    get().hasAnyPermission(["USERS_VIEW", "USERS_CREATE", "USERS_UPDATE"]),

  canViewSettings: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]) ||
    get().hasAnyPermission(["SETTINGS_VIEW"]),

  canCreate: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  canEdit: () =>
    get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"]),

  canDelete: () => get().hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER"]),

  setAuth: (data) => {
    const permissions = buildPermissions(data)

    writeStorage(TOKEN_KEY, data.token)

    if (data.tenantId) {
      writeStorage(TENANT_ID_KEY, data.tenantId)
    } else {
      removeStorage(TENANT_ID_KEY)
    }

    writeStorage(USER_ID_KEY, data.userId)
    writeStorage(USER_KEY, JSON.stringify(data))

    set({
      user: data,
      token: data.token,
      tenantId: data.tenantId,
      userId: data.userId,
      isAuthenticated: true,
      ...permissions,
    })
  },

  restoreSession: () => {
    const token = readStorage(TOKEN_KEY)
    const storedUser = readStorage(USER_KEY)

    if (!token || !storedUser) {
      clearStorage()

      set({
        user: null,
        token: null,
        tenantId: null,
        userId: null,
        isAuthenticated: false,
        roles: [],
        permissions: [],
        isMaster: false,
        isDeveloper: false,
      })

      return
    }

    try {
      const user = JSON.parse(storedUser) as LoginResponse
      const permissions = buildPermissions(user)

      set({
        token,
        user,
        tenantId: user.tenantId,
        userId: user.userId,
        isAuthenticated: true,
        ...permissions,
      })
    } catch {
      clearStorage()

      set({
        user: null,
        token: null,
        tenantId: null,
        userId: null,
        isAuthenticated: false,
        roles: [],
        permissions: [],
        isMaster: false,
        isDeveloper: false,
      })
    }
  },

  logout: () => {
    clearStorage()

    set({
      user: null,
      token: null,
      tenantId: null,
      userId: null,
      isAuthenticated: false,
      roles: [],
      permissions: [],
      isMaster: false,
      isDeveloper: false,
    })
  },
}))