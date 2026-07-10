import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
  Building2,
  CheckCircle2,
  Edit,
  Eye,
  Globe2,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react"
import { CreateTenantEnvironmentRuleModal } from "../../components/settings/CreateTenantEnvironmentRuleModal"
import { DeleteTenantEnvironmentRuleModal } from "../../components/settings/DeleteTenantEnvironmentRuleModal"
import { EditTenantEnvironmentRuleModal } from "../../components/settings/EditTenantEnvironmentRuleModal"
import { TenantEnvironmentRuleService } from "../../services/tenantEnvironmentRule.service"
import type { TenantEnvironmentRule } from "../../types/tenantEnvironmentRule.types"

const tenantSettings = [
  {
    title: "Isolamento por ambiente",
    description: "Separação lógica de dados por empresa, cliente e ambiente.",
    status: "Ativo",
    icon: ShieldCheck,
  },
  {
    title: "Acesso entre ambientes",
    description: "Acesso global controlado somente para usuários autorizados.",
    status: "Restrito",
    icon: Globe2,
  },
  {
    title: "Modo suporte",
    description: "Visualização técnica temporária para suporte e auditoria.",
    status: "Planejado",
    icon: Eye,
  },
]

export function SettingsTenantsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<TenantEnvironmentRule | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tenant-environment-rules"],
    queryFn: TenantEnvironmentRuleService.list,
  })

  const activeRulesCount = useMemo(() => {
    return data.filter((rule) => rule.enabled).length
  }, [data])

  const filteredRules = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return data
      .filter((rule) => {
        const status = rule.enabled ? "ativo" : "inativo"

        const matchesSearch =
          !searchTerm ||
          rule.ruleKey.toLowerCase().includes(searchTerm) ||
          rule.name.toLowerCase().includes(searchTerm) ||
          rule.description.toLowerCase().includes(searchTerm) ||
          status.includes(searchTerm)

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && rule.enabled) ||
          (statusFilter === "inactive" && !rule.enabled)

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority
        return a.name.localeCompare(b.name)
      })
  }, [data, search, statusFilter])

  async function handleRefresh() {
    setSuccessMessage(null)

    try {
      await refetch()
      setSuccessMessage("Lista atualizada com sucesso.")

      window.setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch {
      alert("Não foi possível atualizar as regras de ambiente.")
    }
  }

  function handleEdit(rule: TenantEnvironmentRule) {
    setSelectedRule(rule)
    setEditOpen(true)
  }

  function handleDelete(rule: TenantEnvironmentRule) {
    setSelectedRule(rule)
    setDeleteOpen(true)
  }

  async function handleToggleActive(rule: TenantEnvironmentRule) {
    try {
      setToggleLoadingId(rule.id)

      await TenantEnvironmentRuleService.update(rule.id, {
        name: rule.name,
        description: rule.description,
        ruleKey: rule.ruleKey,
        enabled: !rule.enabled,
        priority: rule.priority,
        systemRule: rule.systemRule,
      })

      await refetch()
    } catch {
      alert("Não foi possível alterar o status da regra.")
    } finally {
      setToggleLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Building2 size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Multi Ambientes
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              Governança de ambientes, multiempresa, isolamento de dados,
              acesso global e regras operacionais por ambiente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm"
            >
              <Plus size={15} />
              Nova regra
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
              {isFetching ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </div>
      </section>

      {successMessage && (
        <div className="surface-muted rounded-2xl px-4 py-3 text-sm text-success">
          {successMessage}
        </div>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {tenantSettings.map((item) => (
          <TenantCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        <SummaryCard title="Total de regras" value={String(data.length)} />
        <SummaryCard title="Regras ativas" value={String(activeRulesCount)} />
        <SummaryCard title="Filtradas" value={String(filteredRules.length)} />
      </section>

      <section className="surface-premium rounded-2xl p-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Regras de ambiente
            </h3>

            <p className="text-sm text-muted mt-1">
              Parâmetros globais para ambientes e empresas vinculadas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 w-full sm:min-w-[280px]">
              <Search size={15} className="text-muted shrink-0" />

              <input
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
                placeholder="Buscar regra..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="bg-background border border-border rounded-full px-4 py-2 outline-none text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="surface-muted rounded-2xl p-4 text-muted text-sm">
            Carregando regras de ambiente...
          </div>
        )}

        {isError && (
          <div className="surface-muted rounded-2xl p-4 text-sm text-danger">
            Não foi possível carregar as regras. Verifique se a API está online e se a sessão está ativa.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-2.5">
            {filteredRules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                toggleLoading={toggleLoadingId === rule.id}
                onEdit={() => handleEdit(rule)}
                onDelete={() => handleDelete(rule)}
                onToggleActive={() => {
                  handleToggleActive(rule).catch(() => {
                    alert("Erro inesperado ao alterar status da regra.")
                  })
                }}
              />
            ))}

            {filteredRules.length === 0 && (
              <div className="surface-muted rounded-2xl p-8 text-center text-muted">
                Nenhuma regra de ambiente encontrada.
              </div>
            )}
          </div>
        )}
      </section>

      <CreateTenantEnvironmentRuleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert("Regra criada, mas não foi possível atualizar a lista.")
          })
        }}
      />

      <EditTenantEnvironmentRuleModal
        open={editOpen}
        rule={selectedRule}
        onClose={() => {
          setEditOpen(false)
          setSelectedRule(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert("Regra atualizada, mas não foi possível atualizar a lista.")
          })
        }}
      />

      <DeleteTenantEnvironmentRuleModal
        open={deleteOpen}
        rule={selectedRule}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedRule(null)
        }}
        onDeleted={() => {
          refetch().catch(() => {
            alert("Regra excluída, mas não foi possível atualizar a lista.")
          })
        }}
      />
    </div>
  )
}

function TenantCard({
  title,
  description,
  status,
  icon: Icon,
}: {
  title: string
  description: string
  status: string
  icon: LucideIcon
}) {
  return (
    <div className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="icon-tile">
          <Icon size={19} />
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
          <CheckCircle2 size={12} />
          {status}
        </span>
      </div>

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-sm text-muted mt-2 line-clamp-2">
        {description}
      </p>
    </div>
  )
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="surface-premium rounded-2xl p-3 hover:border-primary/50 transition">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-xl text-primary block mt-1 truncate">
        {value}
      </strong>
    </div>
  )
}

function RuleRow({
  rule,
  toggleLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  rule: TenantEnvironmentRule
  toggleLoading: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}) {
  return (
    <div className="surface-muted rounded-2xl p-3 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-sm block truncate">
            {rule.name}
          </strong>

          {rule.enabled ? (
            <span className="inline-flex items-center gap-1 text-success text-xs">
              <CheckCircle2 size={12} />
              Ativa
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-danger text-xs">
              <XCircle size={12} />
              Inativa
            </span>
          )}
        </div>

        <p className="text-xs text-muted mt-1 line-clamp-2">
          {rule.description}
        </p>

        <p className="text-[11px] text-muted mt-1">
          {rule.ruleKey} · {rule.enabled ? "Ativo" : "Inativo"} · Prioridade {rule.priority}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onToggleActive}
          disabled={toggleLoading}
          className="h-8 rounded-full bg-background border border-border px-3 flex items-center justify-center hover:border-primary hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          title={rule.enabled ? "Desativar" : "Ativar"}
        >
          {rule.enabled ? "Desativar" : "Ativar"}
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
          title="Editar"
        >
          <Edit size={14} />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}