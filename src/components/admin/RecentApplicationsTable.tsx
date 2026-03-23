const applications = [
  { name: "Grace Banda", opportunity: "Merit Scholarship", status: "Pending", date: "Mar 21, 2026" },
  { name: "Joseph Mwale", opportunity: "STEM Grant", status: "Approved", date: "Mar 20, 2026" },
  { name: "Chimwemwe Phiri", opportunity: "Need-Based Aid", status: "Rejected", date: "Mar 19, 2026" },
  { name: "Tadala Nyirenda", opportunity: "Research Fund", status: "Pending", date: "Mar 18, 2026" },
  { name: "Blessings Kamanga", opportunity: "Sports Bursary", status: "Approved", date: "Mar 17, 2026" },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-edu-amber-light text-edu-amber",
  Approved: "bg-edu-green-light text-primary",
  Rejected: "bg-edu-red-light text-edu-red",
};

export function RecentApplicationsTable() {
  return (
    <div
      className="bg-card rounded-lg border border-border animate-fade-in-up"
      style={{ animationDelay: "600ms" }}
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Applications
        </h3>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Student</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Opportunity</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => (
              <tr
                key={i}
                className="border-b last:border-b-0 border-border hover:bg-accent/40 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-foreground">{app.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{app.opportunity}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[app.status]}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground tabular-nums">{app.date}</td>
                <td className="px-5 py-3">
                  <button className="text-xs font-medium text-primary hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
