import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, CheckCircle2, RefreshCw, X,
} from "lucide-react";
import {
  applicationsLast30Days, topOpportunities, matchDistribution, facultyCoverage,
  gapInsights, GapInsight,
} from "@/data/adminMockData";
import { useState } from "react";
import {
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, BarChart, Bar, LabelList,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminReports() {
  const [insights, setInsights] = useState<GapInsight[]>(gapInsights);

  const summary = [
    { label: "Total Opportunities", value: TOTAL_OPPORTUNITIES, icon: Briefcase, color: "text-primary", bg: "bg-edu-green-light" },
    { label: "Total Students", value: TOTAL_STUDENTS, icon: Users, color: "text-edu-blue", bg: "bg-edu-blue-light" },
    { label: "Total Applications", value: TOTAL_APPLICATIONS, icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Forwarded", value: FORWARDED_COUNT, icon: Send, color: "text-primary", bg: "bg-edu-green-light" },
    { label: "Avg Match Score", value: "71%", icon: Target, color: "text-edu-amber", bg: "bg-edu-amber-light" },
    { label: "Profile Completion", value: "64%", icon: UserCheck, color: "text-edu-blue", bg: "bg-edu-blue-light" },
  ];

  const resolveInsight = (id: string) => {
    setInsights((arr) => arr.filter((i) => i.id !== id));
    toast.success("Gap marked as resolved");
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports &amp; Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Platform performance and funding gap analysis
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Last updated: Today at 00:00</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {summary.map((s) => (
            <Card key={s.label} className="p-5 rounded-2xl shadow-sm border-border/60">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-bold mt-2 tabular-nums">{s.value}</p>
                </div>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                  <s.icon className={cn("w-4 h-4", s.color)} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gap Detection */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-edu-amber" />
              <h2 className="text-xl font-bold">Opportunity Gaps</h2>
            </div>
            <span className="text-xs text-muted-foreground">Auto-detected — updates daily</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Student groups currently underserved by available funding. Resolve gaps by adding targeted opportunities.
          </p>
          <div className="space-y-3">
            {insights.length === 0 ? (
              <Card className="rounded-2xl border-border/60 shadow-sm p-5 bg-edu-green-light/40">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <p className="text-sm font-semibold text-primary">
                    All gaps resolved — every student group is adequately served by current funding.
                  </p>
                </div>
              </Card>
            ) : insights.map((i) => {
              const sev = {
                critical: { border: "border-l-edu-red", pill: "bg-edu-red-light text-edu-red", label: "Critical" },
                high: { border: "border-l-edu-amber", pill: "bg-edu-amber-light text-edu-amber", label: "High" },
                medium: { border: "border-l-edu-blue", pill: "bg-edu-blue-light text-edu-blue", label: "Medium" },
              }[i.severity];
              return (
                <Card key={i.id} className={cn("p-5 rounded-2xl shadow-sm border-border/60 border-l-4", sev.border)}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-[15px]">{i.title}</h3>
                    <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full", sev.pill)}>
                      {sev.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{i.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                    <span className="text-xs text-muted-foreground">Detected {i.detectedAgo}</span>
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => resolveInsight(i.id)}>
                      Mark Resolved
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Charts */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Application Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-5 rounded-2xl shadow-sm border-border/60">
              <h3 className="text-sm font-semibold mb-4">Applications — last 30 days</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={applicationsLast30Days}>
                  <defs>
                    <linearGradient id="appsArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval={4} axisLine={false} tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12, border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))", fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#appsArea)" dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 rounded-2xl shadow-sm border-border/60">
              <h3 className="text-sm font-semibold mb-4">Top 5 opportunities by applications</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topOpportunities} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="short" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v: number, _n, p) => [`${v} applications`, p.payload.name]}
                    contentStyle={{
                      borderRadius: 12, border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))", fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="count" position="top" style={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>

        {/* Match Distribution */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-bold">Match Score Distribution</h2>
            <p className="text-sm text-muted-foreground">How well students match opportunities</p>
          </div>
          <Card className="p-6 rounded-2xl shadow-sm border-border/60">
            <div className="space-y-3">
              {matchDistribution.map((d) => {
                const max = Math.max(...matchDistribution.map((x) => x.count));
                const pct = (d.count / max) * 100;
                return (
                  <div key={d.range} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-muted-foreground tabular-nums">{d.range}</span>
                    <div className="flex-1 h-5 rounded-full bg-edu-green-light overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-24 text-right text-sm font-bold text-primary tabular-nums">{d.count} students</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Faculty Coverage */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Funding Coverage by Faculty</h2>
          <Card className="rounded-2xl shadow-sm border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Faculty</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Students</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Eligible Opps</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Ratio</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {facultyCoverage.map((f) => {
                  const pill = f.status === "well"
                    ? "bg-edu-green-light text-primary"
                    : f.status === "limited"
                    ? "bg-edu-amber-light text-edu-amber"
                    : "bg-edu-red-light text-edu-red";
                  const label = f.status === "well" ? "Well Served" : f.status === "limited" ? "Limited" : "Underserved";
                  return (
                    <tr key={f.faculty}>
                      <td className="px-4 py-3 font-semibold">{f.faculty}</td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{f.students}</td>
                      <td className="px-4 py-3 tabular-nums">{f.eligible}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.ratio} students</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold", pill)}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}
