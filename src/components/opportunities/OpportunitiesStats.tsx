import { TrendingUp, CheckCircle2, FileEdit, CalendarClock } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

const stats = [
  { title: "Total Opportunities", value: "24", subtitle: "All opportunities", icon: TrendingUp, iconBg: "bg-edu-blue-light", iconColor: "text-edu-blue", trend: { value: "3 new", up: true } },
  { title: "Active Opportunities", value: "16", subtitle: "Currently live", icon: CheckCircle2, iconBg: "bg-edu-green-light", iconColor: "text-primary", trend: { value: "2 this week", up: true } },
  { title: "Draft Opportunities", value: "5", subtitle: "Unpublished", icon: FileEdit, iconBg: "bg-edu-amber-light", iconColor: "text-edu-amber" },
  { title: "Closing Soon", value: "3", subtitle: "Within 7 days", icon: CalendarClock, iconBg: "bg-edu-red-light", iconColor: "text-edu-red", trend: { value: "urgent", up: false } },
];

export function OpportunitiesStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <StatCard key={s.title} {...s} delay={100 + i * 60} />
      ))}
    </div>
  );
}
