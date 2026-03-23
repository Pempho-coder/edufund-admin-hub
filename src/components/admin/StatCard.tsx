import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: { value: string; up: boolean };
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="group bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:shadow-foreground/[0.03] hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`w-[18px] h-[18px] ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${trend.up ? "text-primary" : "text-edu-red"}`}>
            {trend.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{title}</p>
    </div>
  );
}
