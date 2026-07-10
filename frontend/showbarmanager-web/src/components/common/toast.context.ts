import { createContext, useContext } from "react"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastInput {
  type?: ToastType
  message: string
  durationMs?: number
}

export interface ToastContextValue {
  showToast: (toast: ToastInput) => void
  success: (message: string, durationMs?: number) => void
  error: (message: string, durationMs?: number) => void
  warning: (message: string, durationMs?: number) => void
  info: (message: string, durationMs?: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}