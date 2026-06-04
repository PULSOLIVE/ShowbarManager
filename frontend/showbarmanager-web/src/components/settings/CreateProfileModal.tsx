import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  X,
} from "lucide-react"
import { PermissionService } from "../../services/permission.service"
import { ProfileService } from "../../services/profile.service"
import type { CreateProfileRequest } from "../../types/profile.types"

interface CreateProfileModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function normalizeProfileCode(value: string) {
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

function generateProfileCodeFromName(value: string) {
  return normalizeProfileCode(value)
}

export function CreateProfileModal({
  open,
  onClose,
  onCreated,
}: CreateProfileModalProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [active, setActive] = useState(true)
  const [systemProfile, setSystemProfile] = useState(false)
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: permissions = [] } = useQuery({
    queryKey: ["profile-create-modal-permissions"],
    queryFn: PermissionService.findAll,
    enabled: open,
  })

  const permissionOptions = useMemo(() => {
    return permissions
      .filter((permission) => permission.active)
      .sort((a, b) => {
        const moduleCompare = a.module.localeCompare(b.module)

        if (moduleCompare !== 0) {
          return moduleCompare
        }

        return a.action.localeCompare(b.action)
      })
  }, [permissions])

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
    setDescription("")
    setPriority(0)
    setActive(true)
    setSystemProfile(false)
    setPermissionIds([])
    setCodeManuallyEdited(false)
    setLoading(false)
    setError(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function handleNameChange(value: string) {
    setName(value)

    if (!codeManuallyEdited) {
      setCode(generateProfileCodeFromName(value))
    }
  }

  function handleCodeChange(value: string) {
    setCodeManuallyEdited(true)
    setCode(normalizeProfileCode(value))
  }

  function togglePermission(permissionId: string) {
    setPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((item) => item !== permissionId)
        : [...current, permissionId]
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const normalizedCode = normalizeProfileCode(code)

    if (!normalizedCode) {
      setError("Informe um código válido para o perfil.")
      setLoading(false)
      return
    }

    if (!name.trim()) {
      setError("Informe o nome do perfil.")
      setLoading(false)
      return
    }

    try {
      const payload: CreateProfileRequest = {
        code: normalizedCode,
        name: name.trim(),
        description: description.trim(),
        active,
        systemProfile,
        priority,
        permissionIds,
      }

      await ProfileService.create(payload)

      onCreated()
      handleClose()
    } catch {
      setError("Não foi possível criar o perfil. Verifique os dados.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              Novo perfil
            </span>

            <h2 className="text-xl font-bold mt-1">
              Criar perfil
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre um perfil de acesso para governança, grupos e permissões.
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
              <ShieldCheck size={15} className="text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Identificação do perfil
                </p>

                <p className="text-xs text-muted">
                  O código será usado como referência técnica no RBAC.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nome do perfil">
                <input
                  className="field-input"
                  placeholder="Ex: Suporte Nível 1"
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  required
                />
              </Field>

              <Field label="Código técnico">
                <input
                  className="field-input"
                  placeholder="Ex: SUPPORT_N1"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  required
                />
              </Field>
            </div>

            <p className="text-[11px] text-muted mt-2">
              Sugestão: use códigos curtos e padronizados, como ADMIN_MASTER,
              SUPPORT_N1, FINANCIAL_MANAGER ou EVENT_ADMIN.
            </p>
          </section>

          <section className="surface-muted rounded-2xl p-3">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
              <Field label="Descrição">
                <textarea
                  className="field-input min-h-24 resize-none"
                  placeholder="Descreva a finalidade e o nível de acesso deste perfil."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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
          </section>

          <SelectionPanel
            title="Permissões vinculadas"
            description="Selecione as permissões herdadas por este perfil."
            emptyLabel="Nenhuma permissão ativa encontrada."
            items={permissionOptions.map((permission) => ({
              id: permission.id,
              code: permission.code,
              label: `${permission.module} · ${permission.action}`,
            }))}
            selectedIds={permissionIds}
            onToggle={togglePermission}
          />

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleField
              label="Perfil ativo"
              description="Permite uso imediato no sistema."
              active={active}
              onToggle={() => setActive((value) => !value)}
            />

            <ToggleField
              label="Perfil de sistema"
              description="Protegido para regras estruturais."
              active={systemProfile}
              onToggle={() => setSystemProfile((value) => !value)}
            />
          </section>

          {systemProfile && (
            <Notice
              type="warning"
              message="Perfis de sistema devem ser usados apenas para regras estruturais do ERP. Evite marcar perfis comuns como sistema."
            />
          )}

          {!active && (
            <Notice
              type="info"
              message="Este perfil será criado como inativo e não deverá ser usado em novos vínculos até ser ativado."
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
              {loading ? "Criando perfil..." : "Criar perfil"}
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

function SelectionPanel({
  title,
  description,
  emptyLabel,
  items,
  selectedIds,
  onToggle,
}: {
  title: string
  description: string
  emptyLabel: string
  items: Array<{
    id: string
    code: string
    label: string
  }>
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <section className="surface-muted rounded-2xl p-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="text-xs text-muted mt-0.5">
            {description}
          </p>
        </div>

        <span className="text-xs text-primary font-semibold">
          {selectedIds.length}
        </span>
      </div>

      <div className="max-h-36 overflow-y-auto app-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
        {items.length > 0 ? (
          items.map((item) => {
            const selected = selectedIds.includes(item.id)

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className={[
                  "text-left rounded-xl border px-3 py-2 transition text-xs",
                  selected
                    ? "bg-primary text-white border-primary font-semibold"
                    : "bg-card border-border text-muted hover:text-text hover:border-primary/60",
                ].join(" ")}
              >
                <span className="flex items-center gap-1.5">
                  <KeyRound size={12} />
                  {item.label}
                </span>

                <span
                  className={
                    selected
                      ? "block mt-1 text-white/75"
                      : "block mt-1 text-muted"
                  }
                >
                  {item.code}
                </span>
              </button>
            )
          })
        ) : (
          <span className="text-xs text-muted">
            {emptyLabel}
          </span>
        )}
      </div>
    </section>
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