import {
  FileDown,
  Users,
  BarChart3,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  ArrowRight,
} from "lucide-react";

const activities = [
  {
    icon: FileText,
    title: "New application submitted",
    desc: "Grace Banda — Merit Scholarship",
    time: "2 min ago",
    badge: "new",
    badgeColor: "bg-edu-blue-light text-edu-blue",
    iconBg: "bg-edu-blue-light",
    iconColor: "text-edu-blue",
  },
  {
    icon: Plus,
    title: "Opportunity created",
    desc: "STEM Grant 2026 published",
    time: "1 hour ago",
    badge: "created",
    badgeColor: "bg-edu-green-light text-primary",
    iconBg: "bg-edu-green-light",
    iconColor: "text-primary",
  },
  {
    icon: CheckCircle,
    title: "Application approved",
    desc: "Joseph Mwale — STEM Grant",
    time: "3 hours ago",
    badge: "approved",
    badgeColor: "bg-edu-green-light text-primary",
    iconBg: "bg-edu-green-light",
    iconColor: "text-primary",
  },
  {
    icon: XCircle,
    title: "Application rejected",
    desc: "Chimwemwe Phiri — Need-Based Aid",
    time: "5 hours ago",
    badge: "rejected",
    badgeColor: "bg-edu-red-light text-edu-red",
    iconBg: "bg-edu-red-light",
    iconColor: "text-edu-red",
  },
];

const quickActions = [
  {
    icon: Plus,
    label: "Add Opportunity",
    desc: "Create new funding",
    bg: "bg-gradient-to-br from-primary/10 to-primary/5",
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    icon: FileDown,
    label: "Export Data",
    desc: "Download CSV",
    bg: "bg-gradient-to-br from-edu-blue/10 to-edu-blue/5",
    iconBg: "bg-edu-blue",
    iconColor: "text-white",
  },
  {
    icon: Users,
    label: "View Students",
    desc: "Browse all",
    bg: "bg-gradient-to-br from-edu-amber/10 to-edu-amber/5",
    iconBg: "bg-edu-amber",
    iconColor: "text-white",
  },
  {
    icon: BarChart3,
    label: "Reports",
    desc: "Full analytics",
    bg: "bg-gradient-to-br from-edu-red/10 to-edu-red/5",
    iconBg: "bg-edu-red",
    iconColor: "text-white",
  },
];

export function AdminRightPanel() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
          <button className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">View All</button>
        </div>
        <div className="space-y-3">
          {activities.map((a, i) => (
            <div key={i} className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-accent/40 transition-colors cursor-pointer group">
              <div className={`w-8 h-8 rounded-lg ${a.iconBg} flex items-center justify-center shrink-0`}>
                <a.icon className={`w-3.5 h-3.5 ${a.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-medium text-foreground truncate">{a.title}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${a.badgeColor}`}>
                    {a.badge}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{a.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-[13px] font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((qa) => (
            <button
              key={qa.label}
              className={`flex flex-col items-center text-center p-4 rounded-xl ${qa.bg} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.96] group border border-transparent hover:border-border`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${qa.iconBg} mb-2.5 shadow-sm group-hover:shadow-md transition-shadow`}>
                <qa.icon className={`w-4 h-4 ${qa.iconColor}`} />
              </div>
              <p className="text-[11px] font-bold text-foreground">{qa.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{qa.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
