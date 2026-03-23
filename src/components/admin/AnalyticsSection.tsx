import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

const lineData = [
  { month: "Jan", apps: 12 },
  { month: "Feb", apps: 19 },
  { month: "Mar", apps: 28 },
  { month: "Apr", apps: 35 },
  { month: "May", apps: 42 },
  { month: "Jun", apps: 38 },
];

const barData = [
  { name: "Merit", apps: 24 },
  { name: "STEM", apps: 18 },
  { name: "Need-Based", apps: 31 },
  { name: "Research", apps: 12 },
  { name: "Sports", apps: 9 },
];

const pieData = [
  { name: "Submitted", value: 48, color: "hsl(213,72%,55%)" },
  { name: "Under Review", value: 43, color: "hsl(38,92%,50%)" },
  { name: "Forwarded", value: 33, color: "hsl(152,69%,31%)" },
];

const tooltipStyle = {
  borderRadius: 12,
  border: "none",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  fontSize: 12,
  padding: "8px 12px",
};

export function AnalyticsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">Analytics</h3>
        <div className="flex gap-1 p-0.5 rounded-lg bg-muted">
          {["7D", "1M", "3M", "1Y"].map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                i === 1
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[13px] font-semibold text-foreground">Applications Over Time</h4>
            <span className="text-[11px] font-semibold text-primary bg-edu-green-light px-2 py-0.5 rounded-full">+12.5%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">Monthly submissions trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152,69%,31%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(152,69%,31%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,93%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "hsl(152,69%,31%)", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="apps" stroke="hsl(152,69%,31%)" strokeWidth={2.5} fill="url(#greenGradient)" dot={{ r: 3.5, fill: "white", stroke: "hsl(152,69%,31%)", strokeWidth: 2 }} activeDot={{ r: 5, fill: "hsl(152,69%,31%)", stroke: "white", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[13px] font-semibold text-foreground">By Opportunity</h4>
            <span className="text-[11px] font-semibold text-edu-blue bg-edu-blue-light px-2 py-0.5 rounded-full">5 active</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">Application distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,93%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(152,69%,31%)", fillOpacity: 0.05 }} />
              <Bar dataKey="apps" fill="hsl(152,69%,31%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[13px] font-semibold text-foreground">Submission Status</h4>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">Current distribution</p>
          <div className="flex items-center gap-6">
            <div className="relative">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-foreground tabular-nums">124</span>
                <span className="text-[10px] text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {pieData.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-medium text-foreground">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground tabular-nums">{d.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(d.value / 124) * 100}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
