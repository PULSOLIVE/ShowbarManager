import { useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import { ToastContext } from "./toast.context"
import type { ToastType } from "./toast.context"

interface Toast {
  id: string
  type: ToastType
  message: string
  durationMs: number
}

const defaultDurationMs = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((input: { type?: ToastType; message: string; durationMs?: number }) => {
    const id = crypto.randomUUID()
    const durationMs = input.durationMs ?? defaultDurationMs

    setToasts((current) => [
      ...current,
      {
        id,
        type: input.type ?? "info",
        message: input.message,
        durationMs,
      },
    ])

    window.setTimeout(() => dismissToast(id), durationMs)
  }, [dismissToast])

  const value = useMemo(() => ({
    showToast,
    success: (message: string, durationMs?: number) => showToast({ type: "success", message, durationMs }),
    error: (message: string, durationMs?: number) => showToast({ type: "error", message, durationMs }),
    warning: (message: string, durationMs?: number) => showToast({ type: "warning", message, durationMs }),
    info: (message: string, durationMs?: number) => showToast({ type: "info", message, durationMs }),
  }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-32px))] flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const config = getToastConfig(toast.type)
  const Icon = config.icon

  return (
    <div className={["pointer-events-auto overflow-hidden rounded-xl shadow-card backdrop-blur-md", config.container].join(" ")}>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.iconBox].join(" ")}>
          <Icon size={17} />
        </span>

        <p className="min-w-0 flex-1 text-sm text-text">
          {toast.message}
        </p>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-text transition"
          aria-label="Fechar mensagem"
        >
          <X size={15} />
        </button>
      </div>

      <div className="h-1 bg-white/5">
        <div
          className={["h-full origin-left animate-toast-progress", config.progress].join(" ")}
          style={{ animationDuration: `${toast.durationMs}ms` }}
        />
      </div>
    </div>
  )
}

function getToastConfig(type: ToastType) {
  if (type === "success") {
    return {
      icon: CheckCircle2,
      container: "border border-success/45 bg-success/15",
      iconBox: "bg-success text-white",
      progress: "bg-success",
    }
  }

  if (type === "error") {
    return {
      icon: XCircle,
      container: "border border-danger/45 bg-danger/15",
      iconBox: "bg-danger text-white",
      progress: "bg-danger",
    }
  }

  if (type === "warning") {
    return {
      icon: AlertTriangle,
      container: "border border-warning/45 bg-warning/15",
      iconBox: "bg-warning text-background",
      progress: "bg-warning",
    }
  }

  return {
    icon: Info,
    container: "border border-primary/45 bg-primary/15",
    iconBox: "bg-primary text-white",
    progress: "bg-primary",
  }
}