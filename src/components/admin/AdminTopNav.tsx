import { Search, Bell, ChevronDown, Menu } from "lucide-react";

interface AdminTopNavProps {
  onMenuToggle?: () => void;
}

export function AdminTopNav({ onMenuToggle }: AdminTopNavProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search opportunities, students..."
            className="w-[320px] lg:w-[420px] h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-edu-red text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
            AD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-tight">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground">admin@mzuni.ac.mw</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  );
}
