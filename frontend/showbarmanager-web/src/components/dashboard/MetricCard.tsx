import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  status?: "success" | "warning" | "danger" | "neutral"
}

const statusClasses = {
  success: "text-neon",
  warning: "text-yellow-300",
  danger: "text-red-300",
  neutral: "text-muted",
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  status = "neutral",
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 min-h-[126px] hover:border-neon/70 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className={`block text-2xl leading-tight mt-1 truncate ${statusClasses[status]}`}>
            {value}
          </strong>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0">
          <Icon size={18} className={statusClasses[status]} />
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  )
}