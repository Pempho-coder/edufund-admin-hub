import { CircleDot } from "lucide-react";

export function WelcomeCard() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ lineHeight: 1.2 }}>
            Welcome back, Admin 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with Mzuni EduFund today.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground bg-secondary">
              Total Students: 1,247
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground bg-secondary">
              Active Opportunities: 18
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground bg-secondary">
              Pending Applications: 43
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-edu-green-light self-start">
          <CircleDot className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">System Active</span>
        </div>
      </div>
    </div>
  );
}
