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
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Opportunities", url: "/opportunities", icon: TrendingUp },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Students", url: "/students", icon: Users },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Deadlines", url: "/deadlines", icon: CalendarClock },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[280px] min-h-screen bg-card border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground leading-tight">
            Mzuni EduFund
          </h1>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {mainItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.title}</span>
          </NavLink>
        ))}
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-edu-red transition-colors hover:bg-edu-red-light w-full">
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
