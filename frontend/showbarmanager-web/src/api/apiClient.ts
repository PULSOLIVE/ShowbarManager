import axios from "axios"
import { API_CONFIG } from "../config/api.config"

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("showbar_token")
  const tenantId = localStorage.getItem("showbar_tenant_id")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId) {
    config.headers["X-Tenant-Id"] = tenantId
  }

  return config
})