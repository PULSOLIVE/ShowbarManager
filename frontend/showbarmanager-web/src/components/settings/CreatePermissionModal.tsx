import { useEffect, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { AlertTriangle, CheckCircle2, KeyRound, X } from "lucide-react"
import { PermissionService } from "../../services/permission.service"
import type { CreatePermissionRequest } from "../../types/permission.types"

interface CreatePermissionModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function normalizePermissionCode(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase()
}

function buildPermissionCode(module: string, action: string) {
  const normalizedModule = normalizePermissionCode(module)
  const normalizedAction = normalizePermissionCode(action)

  if (!normalizedModule || !normalizedAction) {
    return ""
  }

  return `${normalizedModule}_${normalizedAction}`
}

export function CreatePermissionModal({
  open,
  onClose,
  onCreated,
}: CreatePermissionModalProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [module, setModule] = useState("")
  const [action, setAction] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [active, setActive] = useState(true)
  const [systemPermission, setSystemPermission] = useState(false)
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    resetForm()
  }, [open])

  if (!open) {
    return null
  }

  function resetForm() {
    setCode("")
    setName("")
    setModule("")
    setAction("")
    setDescription("")
    setPriority(0)
    setActive(true)
    setSystemPermission(false)
    setCodeManuallyEdited(false)
    setLoading(false)
    setError(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function syncCode(nextModule: string, nextAction: string) {
    if (codeManuallyEdited) {
      return
    }

    setCode(buildPermissionCode(nextModule, nextAction))
  }

  function handleCodeChange(value: string) {
    setCodeManuallyEdited(true)
    setCode(normalizePermissionCode(value))
  }

  function handleModuleChange(value: string) {
    const normalizedModule = normalizePermissionCode(value)

    setModule(normalizedModule)
    syncCode(normalizedModule, action)
  }

  function handleActionChange(value: string) {
    const normalizedAction = normalizePermissionCode(value)

    setAction(normalizedAction)
    syncCode(module, normalizedAction)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const normalizedCode = normalizePermissionCode(code)
    const normalizedModule = normalizePermissionCode(module)
    const normalizedAction = normalizePermissionCode(action)

    if (!name.trim()) {
      setError("Informe o nome da permissão.")
      setLoading(false)
      return
    }

    if (!normalizedCode || !normalizedModule || !normalizedAction) {
      setError("Informe código, módulo e ação válidos.")
      setLoading(false)
      return
    }

    try {
      const payload: CreatePermissionRequest = {
        code: normalizedCode,
        name: name.trim(),
        module: normalizedModule,
        action: normalizedAction,
        description: description.trim(),
        active,
        systemPermission,
        priority,
      }

      await PermissionService.create(payload)

      onCreated()
      handleClose()
    } catch {
      setError("Não foi possível criar a permissão. Verifique os dados.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              Nova permissão
            </span>

            <h2 className="text-xl font-bold mt-1">
              Criar permissão
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre uma permissão para controle ACL e regras de RBAC.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
            title="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <section className="surface-muted rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound size={15} className="text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Identificação da permissão
                </p>

                <p className="text-xs text-muted">
                  O código técnico pode ser gerado por módulo + ação.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nome">
                <input
                  className="field-input"
                  placeholder="Ex: Criar usuários"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>

              <Field label="Código técnico">
                <input
                  className="field-input"
                  placeholder="Ex: USERS_CREATE"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  required
                />
              </Field>
            </div>

            <p className="text-[11px] text-muted mt-2">
              Sugestão: use códigos padronizados, como USERS_CREATE,
              USERS_UPDATE, TENANTS_DELETE ou SETTINGS_VIEW.
            </p>
          </section>

          <section className="surface-muted rounded-2xl p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Módulo">
                <input
                  className="field-input"
                  placeholder="Ex: USERS"
                  value={module}
                  onChange={(event) => handleModuleChange(event.target.value)}
                  required
                />
              </Field>

              <Field label="Ação">
                <input
                  className="field-input"
                  placeholder="Ex: CREATE"
                  value={action}
                  onChange={(event) => handleActionChange(event.target.value)}
                  required
                />
              </Field>

              <Field label="Prioridade">
                <input
                  className="field-input"
                  type="number"
                  placeholder="0"
                  value={priority}
                  onChange={(event) => setPriority(Number(event.target.value))}
                />
              </Field>
            </div>

            <div className="mt-3">
              <Field label="Descrição">
                <textarea
                  className="field-input min-h-24 resize-none"
                  placeholder="Descrição da permissão"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleField
              label="Permissão ativa"
              description="Permite uso imediato no sistema."
              active={active}
              onToggle={() => setActive((value) => !value)}
            />

            <ToggleField
              label="Permissão de sistema"
              description="Protegida para regras estruturais."
              active={systemPermission}
              onToggle={() => setSystemPermission((value) => !value)}
            />
          </section>

          {systemPermission && (
            <Notice
              type="warning"
              message="Permissões de sistema devem ser usadas apenas para regras estruturais do ERP. Evite marcar permissões comuns como sistema."
            />
          )}

          {!active && (
            <Notice
              type="info"
              message="Esta permissão será criada como inativa e não deverá ser vinculada a perfis até ser ativada."
            />
          )}

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto bg-background border border-border text-muted font-semibold px-5 py-2.5 rounded-full hover:border-danger hover:text-danger transition text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Criando permissão..." : "Criar permissão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">
        {label}
      </span>

      {children}
    </label>
  )
}

function ToggleField({
  label,
  description,
  active,
  onToggle,
}: {
  label: string
  description: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 surface-muted rounded-2xl px-4 py-3">
      <span>
        <span className="block text-sm font-medium">
          {label}
        </span>

        <span className="block text-xs text-muted mt-0.5">
          {description}
        </span>
      </span>

      <button
        type="button"
        onClick={onToggle}
        className={[
          "relative w-12 h-7 rounded-full transition-all shrink-0",
          active ? "bg-primary" : "bg-zinc-700",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
            active ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </label>
  )
}

function Notice({
  type,
  message,
}: {
  type: "info" | "warning"
  message: string
}) {
  const Icon = type === "warning" ? AlertTriangle : CheckCircle2

  return (
    <div
      className={[
        "rounded-2xl px-4 py-3 text-sm border flex items-start gap-2",
        type === "warning"
          ? "bg-warning/10 border-warning/30 text-warning"
          : "bg-primarySoft border-primary/20 text-primary",
      ].join(" ")}
    >
      <Icon size={16} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  )
}