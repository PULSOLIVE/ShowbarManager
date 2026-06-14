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
import { useTranslation } from "../../hooks/useTranslation"
import { DashboardService } from "../../services/dashboard.service"
import { HealthService } from "../../services/health.service"

export function DashboardPage() {
  const { t } = useTranslation()

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
    ? t("dashboard.checking")
    : healthError
      ? t("dashboard.offline")
      : t("dashboard.online")

  const apiStatusType = healthLoading
    ? "warning"
    : healthError
      ? "danger"
      : "success"

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Gauge size={16} />
              {t("dashboard.executiveOverview")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("dashboard.operationalPanel")}
            </h2>

            <p className="text-muted max-w-4xl mt-2 text-sm leading-relaxed">
              {t("dashboard.operationalDescription")}
            </p>
          </div>

          <div className="surface-muted rounded-2xl px-4 py-3 min-w-[240px]">
            <span className="text-[11px] text-muted uppercase tracking-wide">
              {t("dashboard.environment")}
            </span>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />

              <strong className="text-success text-sm leading-tight">
                {t("dashboard.localEnterpriseProduction")}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3">
        <MetricCard
          title={t("dashboard.apiStatus")}
          value={apiStatus}
          description={healthData || t("dashboard.monitoringBackend")}
          icon={Wifi}
          status={apiStatusType}
        />

        <MetricCard
          title={t("dashboard.environments")}
          value={statsLoading ? "..." : String(stats?.totalTenants || 0)}
          description={`${stats?.activeTenants || 0} ${t("dashboard.activeEnvironments")}`}
          icon={Building2}
          status="neutral"
        />

        <MetricCard
          title={t("dashboard.users")}
          value={statsLoading ? "..." : String(stats?.totalUsers || 0)}
          description={`${stats?.activeUsers || 0} ${t("dashboard.activeUsers")}`}
          icon={Users}
          status="neutral"
        />

        <MetricCard
          title={t("dashboard.security")}
          value="JWT + RBAC"
          description={t("dashboard.securityDescription")}
          icon={ShieldCheck}
          status="neutral"
        />
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-3 gap-3 items-stretch">
        <div className="2xl:col-span-2 surface-premium rounded-2xl p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
                <Activity size={16} />
                {t("dashboard.operationalSummary")}
              </span>

              <h3 className="text-xl font-bold mt-1">
                {t("dashboard.saasInfrastructure")}
              </h3>
            </div>

            <div className="icon-tile">
              <Layers3 size={20} strokeWidth={2} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <StatusBox
              title={t("dashboard.enterpriseBackend")}
              value="Spring Boot + JWT"
              status={t("dashboard.online")}
            />

            <StatusBox
              title={t("dashboard.database")}
              value="PostgreSQL 16"
              status={t("dashboard.operational")}
            />

            <StatusBox
              title={t("dashboard.cacheStorage")}
              value="Redis + MinIO"
              status={t("dashboard.synchronized")}
            />

            <StatusBox
              title={t("dashboard.enterpriseFrontend")}
              value="React + TypeScript"
              status={t("dashboard.active")}
            />
          </div>
        </div>

        <div className="surface-premium rounded-2xl p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
                <Crown size={16} />
                {t("dashboard.system")}
              </span>

              <h3 className="text-xl font-bold mt-1">
                {t("dashboard.erpCore")}
              </h3>
            </div>

            <div className="icon-tile">
              <Crown size={20} strokeWidth={2} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-3">
            <SmallBox title={t("dashboard.multiEnvironment")} value={t("common.enabled")} />
            <SmallBox title={t("dashboard.security")} value="JWT + RBAC" />
            <SmallBox title={t("dashboard.architecture")} value={t("dashboard.enterpriseSaas")} />
            <SmallBox title={t("dashboard.visualExperience")} value={t("dashboard.premiumErp")} />
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
    <div className="surface-muted rounded-2xl p-3 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs text-muted">
          {title}
        </p>

        <strong className="text-sm block mt-1 truncate">
          {value}
        </strong>
      </div>

      <span className="text-success font-semibold text-xs shrink-0">
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
    <div className="surface-muted rounded-2xl p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-sm text-primary block mt-1">
        {value}
      </strong>
    </div>
  )
}