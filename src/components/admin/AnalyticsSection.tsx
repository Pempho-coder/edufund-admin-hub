import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const barData = [
  { name: "Merit Scholarship", apps: 24 },
  { name: "STEM Grant", apps: 18 },
  { name: "Need-Based Aid", apps: 31 },
  { name: "Research Fund", apps: 12 },
  { name: "Sports Bursary", apps: 9 },
];

const lineData = [
  { month: "Jan", apps: 12 },
  { month: "Feb", apps: 19 },
  { month: "Mar", apps: 28 },
  { month: "Apr", apps: 35 },
  { month: "May", apps: 42 },
  { month: "Jun", apps: 38 },
];

const pieData = [
  { name: "Pending", value: 43, color: "hsl(38,92%,50%)" },
  { name: "Approved", value: 67, color: "hsl(152,69%,31%)" },
  { name: "Rejected", value: 14, color: "hsl(0,72%,51%)" },
];

export function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bar Chart */}
      <div
        className="bg-card rounded-lg border border-border p-5 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Applications per Opportunity
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(220,13%,91%)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="apps" fill="hsl(152,69%,31%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div
        className="bg-card rounded-lg border border-border p-5 animate-fade-in-up"
        style={{ animationDelay: "300ms" }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Applications Over Time
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215,14%,46%)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(220,13%,91%)",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="apps"
              stroke="hsl(152,69%,31%)"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(152,69%,31%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div
        className="bg-card rounded-lg border border-border p-5 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Application Status
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(220,13%,91%)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
