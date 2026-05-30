import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AdminLayout } from "../layouts/admin/AdminLayout"
import { DashboardPage } from "../pages/dashboard/DashboardPage"
import { LoginPage } from "../pages/auth/LoginPage"
import { TenantsPage } from "../pages/tenants/TenantsPage"
import { UsersPage } from "../pages/users/UsersPage"
import { SettingsPage } from "../pages/settings/SettingsPage"
import { SettingsProfilesPage } from "../pages/settings/SettingsProfilesPage"
import { SettingsPermissionsPage } from "../pages/settings/SettingsPermissionsPage"
import { SettingsSecurityPage } from "../pages/settings/SettingsSecurityPage"
import { SettingsSessionsPage } from "../pages/settings/SettingsSessionsPage"
import { SettingsAuditPage } from "../pages/settings/SettingsAuditPage"
import { SettingsTenantsPage } from "../pages/settings/SettingsTenantsPage"
import { SettingsBrandingPage } from "../pages/settings/SettingsBrandingPage"
import { SettingsCountriesPage } from "../pages/settings/SettingsCountriesPage"
import { SettingsIntegrationsPage } from "../pages/settings/SettingsIntegrationsPage"
import { SettingsNetworkPage } from "../pages/settings/SettingsNetworkPage"
import { SettingsHardwarePage } from "../pages/settings/SettingsHardwarePage"
import { SettingsPoliciesPage } from "../pages/settings/SettingsPoliciesPage"
import { ProtectedRoute } from "./ProtectedRoute"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="users" element={<UsersPage />} />

            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/profiles" element={<SettingsProfilesPage />} />
            <Route path="settings/permissions" element={<SettingsPermissionsPage />} />
            <Route path="settings/security" element={<SettingsSecurityPage />} />
            <Route path="settings/sessions" element={<SettingsSessionsPage />} />
            <Route path="settings/audit" element={<SettingsAuditPage />} />
            <Route path="settings/tenants" element={<SettingsTenantsPage />} />
            <Route path="settings/branding" element={<SettingsBrandingPage />} />
            <Route path="settings/countries" element={<SettingsCountriesPage />} />
            <Route path="settings/integrations" element={<SettingsIntegrationsPage />} />
            <Route path="settings/network" element={<SettingsNetworkPage />} />
            <Route path="settings/hardware" element={<SettingsHardwarePage />} />
            <Route path="settings/policies" element={<SettingsPoliciesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}