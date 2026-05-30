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
    <div className="bg-card border border-border rounded-2xl p-5 min-h-[150px] hover:border-neon/70 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className={`block text-3xl leading-tight mt-1 ${statusClasses[status]}`}>
            {value}
          </strong>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-border flex items-center justify-center shrink-0">
          <Icon size={19} className={statusClasses[status]} />
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  )
}