import { TrendingDown, CalendarClock, UserX, FileWarning, ArrowRight } from "lucide-react";

const insights = [
  {
    icon: TrendingDown,
    title: "Low Applications",
    value: "3",
    desc: "opportunities below 5 applicants",
    bg: "bg-edu-amber-light",
    color: "text-edu-amber",
    ring: "ring-edu-amber/20",
  },
  {
    icon: CalendarClock,
    title: "Closing Soon",
    value: "2",
    desc: "deadlines within 7 days",
    bg: "bg-edu-red-light",
    color: "text-edu-red",
    ring: "ring-edu-red/20",
  },
  {
    icon: UserX,
    title: "Incomplete Profiles",
    value: "148",
    desc: "students need attention",
    bg: "bg-edu-blue-light",
    color: "text-edu-blue",
    ring: "ring-edu-blue/20",
  },
  {
    icon: FileWarning,
    title: "Missing Documents",
    value: "12",
    desc: "applications require docs",
    bg: "bg-edu-yellow-light",
    color: "text-edu-yellow",
    ring: "ring-edu-yellow/20",
  },
];

export function QuickInsights() {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
      <h3 className="text-base font-semibold text-foreground mb-3">Quick Insights</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((item) => (
          <div
            key={item.title}
            className="group bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:shadow-foreground/[0.03] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ring-4 ${item.ring} transition-all duration-300`}>
                <item.icon className={`w-[18px] h-[18px] ${item.color}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
            <p className="text-xl font-bold text-foreground tabular-nums">{item.value}</p>
            <p className="text-[13px] font-medium text-foreground leading-tight mt-0.5">
              {item.title}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
