import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  status?: "success" | "warning" | "danger" | "neutral"
}

const statusClasses = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-primary",
}

const iconTileClasses = {
  success: "icon-tile icon-tile-success",
  warning: "icon-tile icon-tile-warning",
  danger: "icon-tile icon-tile-danger",
  neutral: "icon-tile",
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  status = "neutral",
}: MetricCardProps) {
  return (
    <div className="surface-premium rounded-2xl p-4 min-h-[126px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong
            className={`block text-2xl leading-tight mt-1 truncate ${statusClasses[status]}`}
          >
            {value}
          </strong>
        </div>

        <div className={iconTileClasses[status]}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  )
}