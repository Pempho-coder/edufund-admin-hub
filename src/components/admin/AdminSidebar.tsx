import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Users,
  FolderOpen,
  CalendarClock,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Opportunities", url: "/opportunities", icon: TrendingUp },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Students", url: "/students", icon: Users },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Deadlines", url: "/deadlines", icon: CalendarClock },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 5 },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="flex flex-col w-[270px] min-h-screen bg-card border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-md shadow-primary/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-foreground leading-tight tracking-tight">
            Mzuni EduFund
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium">Admin Portal</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-border" />

      {/* Nav items */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Menu
        </p>
        {mainItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground group"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-md shadow-primary/15"
          >
            <item.icon className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="w-5 h-5 rounded-full bg-edu-red text-white text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade card */}
      <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-foreground">Pro Analytics</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Unlock advanced insights and predictive reports.
        </p>
        <button className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:shadow-md hover:shadow-primary/20 transition-all active:scale-[0.97]">
          Upgrade Now
        </button>
      </div>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5">
        <div className="mx-2 h-px bg-border mb-2" />
        {bottomItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.title}</span>
          </NavLink>
        ))}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-edu-red transition-all duration-200 hover:bg-edu-red-light w-full active:scale-[0.97]">
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
