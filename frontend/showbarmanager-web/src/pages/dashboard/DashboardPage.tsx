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
    <div className="space-y-6">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Gauge size={16} />
            Visão Geral Enterprise
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Painel Operacional
          </h2>

          <p className="text-muted max-w-4xl mt-2 text-sm xl:text-base leading-relaxed">
            Monitoramento operacional do ecossistema ShowbarManager ERP,
            incluindo infraestrutura, inquilinos, usuários, autenticação,
            disponibilidade e operação SaaS multiempresa.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl px-5 py-4 min-w-[260px]">
          <span className="text-xs text-muted uppercase tracking-wide">
            Ambiente
          </span>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-3 h-3 rounded-full bg-neon shadow-neon" />

            <strong className="text-neon leading-tight">
              Produção Empresarial Local
            </strong>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
        <MetricCard
          title="Status da API"
          value={apiStatus}
          description={
            healthData || "Monitorando disponibilidade do backend"
          }
          icon={Wifi}
          status={apiStatusType}
        />

        <MetricCard
          title="Inquilinos"
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

      <section className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
        <div className="2xl:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
                <Activity size={16} />
                Resumo operacional
              </span>

              <h3 className="text-2xl font-bold mt-1">
                Infraestrutura SaaS
              </h3>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
              <Layers3 className="text-neon" size={22} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">
                  Backend Enterprise
                </p>

                <strong className="text-base">
                  Spring Boot + JWT
                </strong>
              </div>

              <span className="text-neon font-semibold text-sm">
                Online
              </span>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">
                  Banco de Dados
                </p>

                <strong className="text-base">
                  PostgreSQL 16
                </strong>
              </div>

              <span className="text-neon font-semibold text-sm">
                Operacional
              </span>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">
                  Cache e Storage
                </p>

                <strong className="text-base">
                  Redis + MinIO
                </strong>
              </div>

              <span className="text-neon font-semibold text-sm">
                Sincronizado
              </span>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">
                  Frontend Enterprise
                </p>

                <strong className="text-base">
                  React + TypeScript
                </strong>
              </div>

              <span className="text-neon font-semibold text-sm">
                Ativo
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
                <Crown size={16} />
                Sistema
              </span>

              <h3 className="text-2xl font-bold mt-1">
                Núcleo ERP
              </h3>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
              <Crown className="text-neon" size={22} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-4">
            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                Multi-tenant
              </p>

              <strong className="text-base text-neon">
                Ativado
              </strong>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                Segurança
              </p>

              <strong className="text-base text-neon">
                JWT + ACL
              </strong>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                Arquitetura
              </p>

              <strong className="text-base text-neon">
                Enterprise SaaS
              </strong>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                UX/UI
              </p>

              <strong className="text-base text-neon">
                Premium Dark Neon
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}