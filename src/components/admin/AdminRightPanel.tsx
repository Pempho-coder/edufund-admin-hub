import {
  Upload,
  FileDown,
  Users,
  BarChart3,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

const activities = [
  {
    icon: FileText,
    title: "New application submitted",
    desc: "Grace Banda applied for Merit Scholarship",
    time: "2 min ago",
    badge: "new",
    badgeColor: "bg-edu-blue-light text-edu-blue",
  },
  {
    icon: Plus,
    title: "Opportunity created",
    desc: "STEM Grant 2026 was published",
    time: "1 hour ago",
    badge: "created",
    badgeColor: "bg-edu-green-light text-primary",
  },
  {
    icon: CheckCircle,
    title: "Application approved",
    desc: "Joseph Mwale — STEM Grant",
    time: "3 hours ago",
    badge: "approved",
    badgeColor: "bg-edu-green-light text-primary",
  },
  {
    icon: XCircle,
    title: "Application rejected",
    desc: "Chimwemwe Phiri — Need-Based Aid",
    time: "5 hours ago",
    badge: "rejected",
    badgeColor: "bg-edu-red-light text-edu-red",
  },
];

const quickActions = [
  {
    icon: Plus,
    label: "Add Opportunity",
    desc: "Create new funding",
    bg: "bg-edu-green-light",
    color: "text-primary",
  },
  {
    icon: FileDown,
    label: "Export Applications",
    desc: "Download CSV data",
    bg: "bg-edu-blue-light",
    color: "text-edu-blue",
  },
  {
    icon: Users,
    label: "View Students",
    desc: "Browse all students",
    bg: "bg-edu-amber-light",
    color: "text-edu-amber",
  },
  {
    icon: BarChart3,
    label: "View Reports",
    desc: "Analytics overview",
    bg: "bg-edu-red-light",
    color: "text-edu-red",
  },
];

export function AdminRightPanel() {
  return (
    <aside className="hidden xl:block w-[320px] shrink-0 space-y-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <a.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {a.title}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${a.badgeColor}`}
                  >
                    {a.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {a.desc}
                </p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  {a.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((qa) => (
            <button
              key={qa.label}
              className="flex flex-col items-center text-center p-4 rounded-lg border border-border hover:shadow-md transition-all hover:border-primary/20 active:scale-[0.97] group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${qa.bg} mb-2`}
              >
                <qa.icon className={`w-[18px] h-[18px] ${qa.color}`} />
              </div>
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {qa.label}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {qa.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
