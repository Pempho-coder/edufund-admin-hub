import { TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";

const stats = [
  {
    title: "Total",
    value: "24",
    icon: TrendingUp,
    iconClassName: "text-primary bg-edu-green-light",
  },
  {
    title: "Open",
    value: "16",
    icon: CheckCircle2,
    iconClassName: "text-primary bg-edu-green-light",
  },
  {
    title: "Closing Soon",
    value: "3",
    icon: Clock,
    iconClassName: "text-edu-amber bg-edu-amber-light",
  },
  {
    title: "Closed",
    value: "5",
    icon: XCircle,
    iconClassName: "text-muted-foreground bg-muted",
  },
];

export function OpportunitiesStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      {stats.map((s) => (
        <div
          key={s.title}
          className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/50 p-4 flex items-center gap-3.5 shadow-sm"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconClassName}`}
          >
            <s.icon className="w-[18px] h-[18px]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums leading-none">
              {s.value}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              {s.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
