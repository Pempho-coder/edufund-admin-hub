import { CircleDot, ArrowUpRight } from "lucide-react";

export function WelcomeCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary to-emerald-800 p-6 md:p-8 animate-fade-in-up shadow-lg shadow-primary/10">
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/[0.03]" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <CircleDot className="w-2.5 h-2.5 text-emerald-300 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">System Online</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-3" style={{ lineHeight: 1.15 }}>
            Welcome back, Admin 👋
          </h2>
          <p className="text-sm text-emerald-100/80 mt-2 max-w-md">
            Here's what's happening with Mzuni EduFund today. You have <span className="font-semibold text-white">43 pending reviews</span> and <span className="font-semibold text-white">2 deadlines</span> this week.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { label: "Students", value: "1,247" },
              { label: "Opportunities", value: "18" },
              { label: "Pending", value: "43" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-medium text-white border border-white/10"
              >
                <span className="text-emerald-200/70">{tag.label}:</span>
                <span className="font-semibold">{tag.value}</span>
              </span>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 self-start px-5 py-2.5 rounded-lg bg-white text-primary text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.97] hover:-translate-y-0.5">
          Review Applications
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
