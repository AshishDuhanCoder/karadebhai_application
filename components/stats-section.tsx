import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: CheckCircle,
      value: "2,847",
      label: "Issues Resolved",
      color: "text-primary",
    },
    {
      icon: Users,
      value: "15,234",
      label: "Active Citizens",
      color: "text-secondary",
    },
    {
      icon: Clock,
      value: "2.3 days",
      label: "Avg Response Time",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      value: "94%",
      label: "Resolution Rate",
      color: "text-primary",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
        <p className="text-muted-foreground">See how our community is making a difference together.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <h4 className="font-semibold text-primary mb-2">Recent Success Story</h4>
        <p className="text-sm text-muted-foreground">
          "Thanks to community reports, we fixed 23 potholes on Main Street last week, improving safety for all
          residents and commuters."
        </p>
        <p className="text-xs text-primary mt-2 font-medium">- City Public Works Department</p>
      </div>
    </div>
  )
}
