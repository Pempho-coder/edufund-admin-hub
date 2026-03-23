import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";

const applications = [
  { name: "Grace Banda", initials: "GB", opportunity: "Merit Scholarship", status: "Pending", date: "Mar 21, 2026", color: "bg-emerald-100 text-primary" },
  { name: "Joseph Mwale", initials: "JM", opportunity: "STEM Grant", status: "Approved", date: "Mar 20, 2026", color: "bg-blue-100 text-edu-blue" },
  { name: "Chimwemwe Phiri", initials: "CP", opportunity: "Need-Based Aid", status: "Rejected", date: "Mar 19, 2026", color: "bg-amber-100 text-edu-amber" },
  { name: "Tadala Nyirenda", initials: "TN", opportunity: "Research Fund", status: "Pending", date: "Mar 18, 2026", color: "bg-rose-100 text-edu-red" },
  { name: "Blessings Kamanga", initials: "BK", opportunity: "Sports Bursary", status: "Approved", date: "Mar 17, 2026", color: "bg-violet-100 text-violet-600" },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-edu-amber-light text-edu-amber",
  Approved: "bg-edu-green-light text-primary",
  Rejected: "bg-edu-red-light text-edu-red",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  Approved: CheckCircle,
  Rejected: XCircle,
};

export function RecentApplicationsTable() {
  return (
    <div className="bg-card rounded-xl border border-border animate-fade-in-up overflow-hidden" style={{ animationDelay: "600ms" }}>
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Recent Applications</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Latest submissions across all opportunities</p>
        </div>
        <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5">
          View All →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left">Student</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left">Opportunity</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left">Status</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left">Date</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => {
              const StatusIcon = statusIcons[app.status];
              return (
                <tr key={i} className="border-b last:border-b-0 border-border hover:bg-accent/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${app.color} text-[11px] font-bold flex items-center justify-center`}>
                        {app.initials}
                      </div>
                      <span className="font-medium text-foreground text-[13px]">{app.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{app.opportunity}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusStyles[app.status]}`}>
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground tabular-nums">{app.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="More">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
