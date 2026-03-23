import { useState } from "react";
import { Users, TrendingUp, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { WelcomeCard } from "@/components/admin/WelcomeCard";
import { StatCard } from "@/components/admin/StatCard";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { QuickInsights } from "@/components/admin/QuickInsights";
import { RecentApplicationsTable } from "@/components/admin/RecentApplicationsTable";
import { AdminRightPanel } from "@/components/admin/AdminRightPanel";

const stats = [
  { title: "Total Students", value: "1,247", subtitle: "Registered on platform", icon: Users, iconBg: "bg-edu-green-light", iconColor: "text-primary", trend: { value: "8.2%", up: true } },
  { title: "Opportunities", value: "18", subtitle: "Currently active", icon: TrendingUp, iconBg: "bg-edu-blue-light", iconColor: "text-edu-blue", trend: { value: "3 new", up: true } },
  { title: "Applications", value: "124", subtitle: "All time", icon: FileText, iconBg: "bg-edu-amber-light", iconColor: "text-edu-amber", trend: { value: "12.5%", up: true } },
  { title: "Pending", value: "43", subtitle: "Awaiting review", icon: Clock, iconBg: "bg-edu-yellow-light", iconColor: "text-edu-yellow", trend: { value: "5 today", up: true } },
  { title: "Approved", value: "67", subtitle: "Successfully", icon: CheckCircle, iconBg: "bg-edu-green-light", iconColor: "text-primary", trend: { value: "54%", up: true } },
  { title: "Rejected", value: "14", subtitle: "Not eligible", icon: XCircle, iconBg: "bg-edu-red-light", iconColor: "text-edu-red", trend: { value: "2.1%", up: false } },
];

const Index = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav onMenuToggle={() => setMobileOpen((o) => !o)} />

        <div className="flex-1 flex overflow-auto">
          {/* Center content */}
          <main className="flex-1 p-4 lg:p-6 space-y-5 overflow-auto">
            <WelcomeCard />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {stats.map((s, i) => (
                <StatCard key={s.title} {...s} delay={100 + i * 60} />
              ))}
            </div>

            <AnalyticsSection />
            <QuickInsights />
            <RecentApplicationsTable />
          </main>

          {/* Right panel */}
          <div className="hidden xl:block py-6 pr-6">
            <AdminRightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
