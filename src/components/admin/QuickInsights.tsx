import { TrendingDown, CalendarClock, UserX, FileWarning } from "lucide-react";

const insights = [
  {
    icon: TrendingDown,
    title: "Low Applications",
    desc: "3 opportunities have fewer than 5 applicants",
    bg: "bg-edu-amber-light",
    color: "text-edu-amber",
  },
  {
    icon: CalendarClock,
    title: "Closing Soon",
    desc: "2 deadlines within the next 7 days",
    bg: "bg-edu-red-light",
    color: "text-edu-red",
  },
  {
    icon: UserX,
    title: "Incomplete Profiles",
    desc: "148 students haven't completed their profiles",
    bg: "bg-edu-blue-light",
    color: "text-edu-blue",
  },
  {
    icon: FileWarning,
    title: "Missing Documents",
    desc: "12 applications are missing required documents",
    bg: "bg-edu-yellow-light",
    color: "text-edu-yellow",
  },
];

export function QuickInsights() {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: "500ms" }}
    >
      <h3 className="text-base font-semibold text-foreground mb-3">
        Quick Insights
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg} mb-3`}
            >
              <item.icon className={`w-[18px] h-[18px] ${item.color}`} />
            </div>
            <p className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
