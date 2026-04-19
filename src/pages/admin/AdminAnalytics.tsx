import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  FileText,
  UserPlus,
  Briefcase,
  Send,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Range = "7d" | "30d" | "3m" | "all";

const volumeData: Record<Range, number[]> = {
  "7d": [6, 5, 4, 6, 3, 7, 4],
  "30d": [2, 3, 1, 4, 2, 5, 3, 6, 4, 7, 6, 8, 5, 9, 7, 11, 13, 15, 18, 14, 10, 8, 12, 7, 9, 6, 5, 4, 6, 3],
  "3m": [18, 24, 31, 19, 27, 35, 42, 28, 38, 45, 31, 27, 22],
  all: [8, 12, 19, 24, 31, 27, 38, 42, 35, 48, 39, 31],
};

const labelFor = (range: Range, i: number, len: number) => {
  if (range === "7d") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
  if (range === "30d") return `${i + 1}`;
  if (range === "3m") return `W${i + 1}`;
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12];
};

const statCards = [
  { Icon: FileText, color: "text-edu-blue", num: "127", label: "Total Applications", trend: 18, dir: "up", goodDown: false },
  { Icon: UserPlus, color: "text-primary", num: "47", label: "New Students", trend: 12, dir: "up", goodDown: false },
  { Icon: Briefcase, color: "text-edu-purple", num: "12", label: "Opportunities Published", trend: 3, dir: "down", goodDown: false },
  { Icon: Send, color: "text-primary", num: "38", label: "Forwarded Applications", trend: 22, dir: "up", goodDown: false },
  { Icon: Target, color: "text-edu-amber", num: "71%", label: "Average Match Score", trend: 4, dir: "up", goodDown: false },
  { Icon: Clock, color: "text-teal-600", num: "5.2", label: "Avg Days to Forward", sub: "From submission to forwarding", trend: 8, dir: "down", goodDown: true },
];

const statusData = [
  { name: "Submitted", value: 43, fill: "hsl(213,72%,55%)" },
  { name: "Under Review", value: 46, fill: "hsl(38,92%,50%)" },
  { name: "Forwarded", value: 38, fill: "hsl(152,69%,31%)" },
];

const registrations = [12, 8, 15, 6, 11, 9, 14, 7];

const topOpps = [
  { rank: 1, name: "Chancellor's Scholarship", count: 34 },
  { rank: 2, name: "MHANGO Foundation Bursary", count: 28 },
  { rank: 3, name: "STEM Excellence Grant", count: 19 },
  { rank: 4, name: "Women in Tech Scholarship", count: 16 },
  { rank: 5, name: "Community Development Grant", count: 14 },
];

const matchScoreDist = [
  { range: "90–100%", count: 18, pct: 5, fill: "hsl(152,69%,31%)" },
  { range: "75–89%", count: 47, pct: 14, fill: "hsl(152,69%,31%)" },
  { range: "50–74%", count: 38, pct: 11, fill: "hsl(152,69%,31%)" },
  { range: "25–49%", count: 16, pct: 5, fill: "hsl(38,92%,50%)" },
  { range: "0–24%", count: 8, pct: 2, fill: "hsl(0,72%,51%)" },
];

const profileDist = [
  { range: "90–100%", count: 62, pct: 18, fill: "hsl(152,69%,31%)" },
  { range: "70–89%", count: 89, pct: 26, fill: "hsl(152,69%,31%)" },
  { range: "50–69%", count: 71, pct: 21, fill: "hsl(38,92%,50%)" },
  { range: "30–49%", count: 58, pct: 17, fill: "hsl(0,72%,51%)" },
  { range: "0–29%", count: 60, pct: 18, fill: "hsl(0,72%,51%)" },
];

const faculties = [
  { name: "Sci & Tech", students: 89, apps: 47, avgMatch: 74, fwd: 18, rate: 38 },
  { name: "Business", students: 76, apps: 31, avgMatch: 61, fwd: 9, rate: 29 },
  { name: "Education", students: 67, apps: 8, avgMatch: 52, fwd: 2, rate: 25 },
  { name: "Health Sciences", students: 54, apps: 28, avgMatch: 79, fwd: 12, rate: 43 },
  { name: "Social Science", students: 54, apps: 13, avgMatch: 58, fwd: 4, rate: 31 },
];

const closingThisWeek = [
  { name: "MHANGO Foundation Bursary", urgency: "Today", tone: "red" as const },
  { name: "Community Development Grant", urgency: "2 days", tone: "red" as const },
  { name: "Academic Merit Award", urgency: "5 days", tone: "amber" as const },
  { name: "Student Welfare Loan", urgency: "7 days", tone: "amber" as const },
];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  fontSize: 12,
  padding: "8px 12px",
  background: "hsl(var(--card))",
};

export default function AdminAnalytics() {
  const [range, setRange] = useState<Range>("30d");

  const volume = useMemo(
    () => volumeData[range].map((count, i) => ({ label: labelFor(range, i, volumeData[range].length), count })),
    [range]
  );

  const totalStatus = statusData.reduce((s, d) => s + d.value, 0);

  const matchPill = (m: number) =>
    m >= 70
      ? "bg-edu-green-light text-primary"
      : m >= 50
      ? "bg-edu-amber-light text-edu-amber"
      : "bg-edu-red-light text-edu-red";

  const rateColor = (r: number) =>
    r >= 25 ? "text-primary" : r >= 10 ? "text-edu-amber" : "text-edu-red";

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-foreground tracking-tight">Analytics</h1>
            <p className="text-[15px] text-muted-foreground mt-1">
              Trends, performance, and platform insights
            </p>
          </div>
          <div className="flex gap-1.5 p-1 rounded-full bg-card border border-border">
            {(["7d", "30d", "3m", "all"] as Range[]).map((r) => {
              const labels: Record<Range, string> = {
                "7d": "7 days",
                "30d": "30 days",
                "3m": "3 months",
                all: "All time",
              };
              const active = range === r;
              return (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 1: Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((c) => {
            const isUp = c.dir === "up";
            const isGood = c.goodDown ? !isUp : isUp;
            const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={c.label}
                className="bg-card rounded-2xl shadow-sm border border-border p-5 min-h-[110px] flex flex-col"
              >
                <c.Icon className={`w-6 h-6 ${c.color}`} />
                <div className="mt-2 text-[32px] font-bold text-foreground leading-none tabular-nums">
                  {c.num}
                </div>
                <div className="text-[13px] text-muted-foreground mt-1">{c.label}</div>
                {c.sub && <div className="text-[11px] text-muted-foreground/70 italic">{c.sub}</div>}
                <div className="flex items-center justify-end gap-1.5 mt-auto pt-2">
                  <TrendIcon className={`w-3.5 h-3.5 ${isGood ? "text-primary" : "text-edu-red"}`} />
                  <span className={`text-[12px] font-bold ${isGood ? "text-primary" : "text-edu-red"}`}>
                    {isUp ? "↑" : "↓"} {c.trend}%
                  </span>
                  <span className="text-[11px] text-muted-foreground">vs last period</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Volume + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-card rounded-2xl shadow-sm border border-border p-5">
            <h3 className="text-[16px] font-semibold text-foreground">Application Volume</h3>
            <p className="text-[13px] text-muted-foreground mb-4">Daily applications submitted</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={volume} margin={{ left: -10, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152,69%,31%)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="hsl(152,69%,31%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(220,13%,93%)" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "hsl(215,14%,46%)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={range === "30d" ? 4 : 0}
                />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} applications`, ""]} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(152,69%,31%)"
                  strokeWidth={2}
                  fill="url(#volGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
            <h3 className="text-[16px] font-semibold text-foreground">Status Breakdown</h3>
            <p className="text-[13px] text-muted-foreground mb-2">Current application distribution</p>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {statusData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[26px] font-bold text-foreground tabular-nums">{totalStatus}</span>
                <span className="text-[12px] text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="mt-3 space-y-0">
              {statusData.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between text-[13px] text-muted-foreground py-1.5 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                    <span className="text-foreground">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums">
                    <span className="font-semibold text-foreground">{d.value}</span>
                    <span className="w-10 text-right">{Math.round((d.value / totalStatus) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Registrations + Top opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
            <h3 className="text-[16px] font-semibold text-foreground">Student Registrations</h3>
            <p className="text-[13px] text-muted-foreground mb-4">New students per week</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={registrations.map((c, i) => ({ week: `W${i + 1}`, count: c }))}
                margin={{ left: -10, right: 6, top: 18 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(220,13%,93%)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, _n, p) => [`${v} new students`, p.payload.week]}
                />
                <Bar dataKey="count" fill="hsl(152,69%,31%)" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  <LabelList position="top" style={{ fontSize: 11, fill: "hsl(215,14%,46%)" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
            <h3 className="text-[16px] font-semibold text-foreground">Most Applied Opportunities</h3>
            <p className="text-[13px] text-muted-foreground mb-4">Top 5 by application count</p>
            <div className="space-y-3">
              {topOpps.map((o) => {
                const pct = (o.count / topOpps[0].count) * 100;
                return (
                  <div key={o.rank} className="flex items-center gap-3">
                    <span className="w-4 text-[12px] text-muted-foreground tabular-nums">{o.rank}</span>
                    <span className="flex-1 text-[13px] font-semibold text-foreground truncate">{o.name}</span>
                    <div className="w-[40%] h-2 bg-edu-green-light rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[13px] font-bold text-primary tabular-nums">{o.count}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-right text-[12px] text-muted-foreground italic mt-4">
              Showing top 5 of 48 total opportunities
            </p>
          </div>
        </div>

        {/* Row 4: Quality Metrics */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
          <h3 className="text-[18px] font-semibold text-foreground mb-4">Quality Metrics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[14px] font-semibold text-foreground">Match Score Distribution</h4>
              <p className="text-[12px] text-muted-foreground mb-4">
                Across all student-opportunity pairs
              </p>
              <div className="space-y-2">
                {matchScoreDist.map((r) => (
                  <div key={r.range} className="flex items-center gap-2">
                    <span className="w-16 text-[12px] text-muted-foreground text-right">{r.range}</span>
                    <div className="flex-1 h-5 bg-edu-green-light rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${r.count}%`, background: r.fill }}
                      />
                    </div>
                    <span className="w-12 text-[12px] text-muted-foreground text-right tabular-nums">{r.count}</span>
                    <span className="w-10 text-[11px] text-muted-foreground text-right tabular-nums">{r.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-edu-green-light text-primary rounded-full px-3 py-1 text-[12px] font-medium">
                  Avg 71% match score
                </span>
                <span className="bg-edu-amber-light text-edu-amber rounded-full px-3 py-1 text-[12px] font-medium">
                  24 students below 50%
                </span>
              </div>
            </div>

            <div className="lg:pl-6 lg:border-l border-border">
              <h4 className="text-[14px] font-semibold text-foreground">Profile Completion</h4>
              <p className="text-[12px] text-muted-foreground mb-4">By percentage of fields completed</p>
              <div className="space-y-2">
                {profileDist.map((r) => (
                  <div key={r.range} className="flex items-center gap-2">
                    <span className="w-16 text-[12px] text-muted-foreground text-right">{r.range}</span>
                    <div className="flex-1 h-5 bg-edu-green-light rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${r.count}%`, background: r.fill }}
                      />
                    </div>
                    <span className="w-12 text-[12px] text-muted-foreground text-right tabular-nums">{r.count}</span>
                    <span className="w-10 text-[11px] text-muted-foreground text-right tabular-nums">{r.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-edu-amber-light border border-edu-amber/30 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-edu-amber shrink-0 mt-0.5" />
                <span className="text-[12px] text-edu-amber font-medium">
                  118 students below 50% complete — they receive fewer recommendations
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Faculty Performance */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-foreground">Performance by Faculty</h3>
            <span className="text-[12px] text-muted-foreground italic">Based on all-time data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Faculty", "Students", "Applications", "Avg Match", "Forwarded", "Fwd Rate"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${
                        i === 0 ? "text-left" : "text-center"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faculties.map((f, i) => (
                  <tr
                    key={f.name}
                    className={`border-b border-border hover:bg-muted/40 transition-colors ${
                      i % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-[14px] font-medium text-foreground">{f.name}</td>
                    <td className="px-4 py-3 text-center text-[14px] text-muted-foreground tabular-nums">{f.students}</td>
                    <td className="px-4 py-3 text-center text-[14px] text-muted-foreground tabular-nums">{f.apps}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${matchPill(f.avgMatch)}`}>
                        {f.avgMatch}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-[14px] text-muted-foreground tabular-nums">{f.fwd}</td>
                    <td className={`px-4 py-3 text-center text-[14px] font-bold tabular-nums ${rateColor(f.rate)}`}>
                      {f.rate}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted border-t-2 border-border">
                  <td className="px-4 py-3 text-[14px] font-bold text-foreground">Totals / Avg</td>
                  <td className="px-4 py-3 text-center text-[14px] font-bold text-foreground tabular-nums">340</td>
                  <td className="px-4 py-3 text-center text-[14px] font-bold text-foreground tabular-nums">127</td>
                  <td className="px-4 py-3 text-center text-[14px] font-bold text-foreground tabular-nums">67%</td>
                  <td className="px-4 py-3 text-center text-[14px] font-bold text-foreground tabular-nums">45</td>
                  <td className="px-4 py-3 text-center text-[14px] font-bold text-foreground tabular-nums">35%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground italic pt-2">
            Forwarding rate = applications forwarded ÷ total applications × 100
          </p>
        </div>

        {/* Row 6: Deadline Activity */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
          <h3 className="text-[18px] font-semibold text-foreground mb-4">Deadline Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="px-0 md:px-6 md:border-r border-border">
              <div className="text-[40px] font-bold text-edu-amber leading-none tabular-nums">4</div>
              <div className="text-[13px] text-muted-foreground mt-1">Closing this week</div>
              <div className="border-t border-border my-3" />
              <div className="space-y-0">
                {closingThisWeek.map((o) => (
                  <div key={o.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-[13px] font-semibold text-foreground truncate pr-2">{o.name}</span>
                    <span
                      className={`shrink-0 text-[11px] font-semibold rounded-full px-2 py-0.5 ${
                        o.tone === "red" ? "bg-edu-red-light text-edu-red" : "bg-edu-amber-light text-edu-amber"
                      }`}
                    >
                      {o.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-0 md:px-6 md:border-r border-border mt-6 md:mt-0">
              <div className="text-[40px] font-bold text-muted-foreground leading-none tabular-nums">7</div>
              <div className="text-[13px] text-muted-foreground mt-1">Closed in last 30 days</div>
              <div className="border-t border-border my-3" />
              <p className="text-[13px] text-muted-foreground italic">
                Average of 14 days between an opportunity being posted and receiving its first application
              </p>
            </div>

            <div className="px-0 md:px-6 mt-6 md:mt-0">
              <div className="flex items-baseline gap-2">
                <div className="text-[40px] font-bold text-primary leading-none tabular-nums">12</div>
                <div className="text-[13px] text-muted-foreground">days avg lead time</div>
              </div>
              <div className="border-t border-border my-3" />
              <span className="inline-flex items-center gap-1.5 bg-edu-green-light text-primary rounded-full px-3 py-1 text-[12px] font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" />
                ↓ improving vs last month
              </span>
              <p className="text-[13px] text-muted-foreground mt-3">
                Lead time = days from opportunity posted to first student application received
              </p>
            </div>
          </div>
        </div>

        {/* Trend neutral icon (unused but referenced for completeness) */}
        <Minus className="hidden" />
      </div>
    </AdminLayout>
  );
}
