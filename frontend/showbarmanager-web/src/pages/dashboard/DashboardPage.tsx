import { useQuery } from "@tanstack/react-query"
import {
  Activity,
  Building2,
  Crown,
  Gauge,
  Layers3,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react"
import { MetricCard } from "../../components/dashboard/MetricCard"
import { DashboardService } from "../../services/dashboard.service"
import { HealthService } from "../../services/health.service"

export function DashboardPage() {
  const {
    data: healthData,
    isLoading: healthLoading,
    isError: healthError,
  } = useQuery({
    queryKey: ["api-health"],
    queryFn: HealthService.check,
  })

  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: DashboardService.getStats,
  })

  const apiStatus = healthLoading
    ? "Verificando"
    : healthError
      ? "Offline"
      : "Online"

  const apiStatusType = healthLoading
    ? "warning"
    : healthError
      ? "danger"
      : "success"

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Gauge size={16} />
            Visão Geral Enterprise
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Painel Operacional
          </h2>

          <p className="text-muted max-w-4xl mt-2 text-sm leading-relaxed">
            Monitoramento executivo do ecossistema ShowbarManager ERP:
            infraestrutura, ambientes, usuários, autenticação, disponibilidade
            e operação SaaS multiempresa.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl px-4 py-3 min-w-[240px]">
          <span className="text-[11px] text-muted uppercase tracking-wide">
            Ambiente
          </span>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-neon shadow-neon" />

            <strong className="text-neon text-sm leading-tight">
              Produção Empresarial Local
            </strong>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3">
        <MetricCard
          title="Status da API"
          value={apiStatus}
          description={healthData || "Monitorando disponibilidade do backend"}
          icon={Wifi}
          status={apiStatusType}
        />

        <MetricCard
          title="Ambientes"
          value={statsLoading ? "..." : String(stats?.totalTenants || 0)}
          description={`${stats?.activeTenants || 0} ambientes ativos`}
          icon={Building2}
          status="success"
        />

        <MetricCard
          title="Usuários"
          value={statsLoading ? "..." : String(stats?.totalUsers || 0)}
          description={`${stats?.activeUsers || 0} usuários ativos`}
          icon={Users}
          status="success"
        />

        <MetricCard
          title="Segurança"
          value="JWT"
          description="Autenticação protegida com Bearer Token"
          icon={ShieldCheck}
          status="success"
        />
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
        <div className="2xl:col-span-2 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
                <Activity size={16} />
                Resumo operacional
              </span>

              <h3 className="text-xl font-bold mt-1">
                Infraestrutura SaaS
              </h3>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
              <Layers3 className="text-neon" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <StatusBox
              title="Backend Enterprise"
              value="Spring Boot + JWT"
              status="Online"
            />

            <StatusBox
              title="Banco de Dados"
              value="PostgreSQL 16"
              status="Operacional"
            />

            <StatusBox
              title="Cache e Storage"
              value="Redis + MinIO"
              status="Sincronizado"
            />

            <StatusBox
              title="Frontend Enterprise"
              value="React + TypeScript"
              status="Ativo"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
                <Crown size={16} />
                Sistema
              </span>

              <h3 className="text-xl font-bold mt-1">
                Núcleo ERP
              </h3>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
              <Crown className="text-neon" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-3">
            <SmallBox title="Multi-tenant" value="Ativado" />
            <SmallBox title="Segurança" value="JWT + ACL" />
            <SmallBox title="Arquitetura" value="Enterprise SaaS" />
            <SmallBox title="UX/UI" value="Premium ERP" />
          </div>
        </div>
      </section>
    </div>
  )
}

function StatusBox({
  title,
  value,
  status,
}: {
  title: string
  value: string
  status: string
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-3 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs text-muted">
          {title}
        </p>

        <strong className="text-sm block mt-1 truncate">
          {value}
        </strong>
      </div>

      <span className="text-neon font-semibold text-xs shrink-0">
        {status}
      </span>
    </div>
  )
}

function SmallBox({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-sm text-neon block mt-1">
        {value}
      </strong>
    </div>
  )
}