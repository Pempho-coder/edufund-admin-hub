import { Search, Bell, ChevronDown, Menu, Sun } from "lucide-react";

interface AdminTopNavProps {
  onMenuToggle?: () => void;
}

export function AdminTopNav({ onMenuToggle }: AdminTopNavProps) {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-accent transition-all active:scale-95"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search opportunities, students..."
            className="w-[280px] lg:w-[380px] h-10 pl-10 pr-4 rounded-xl border border-border bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-xl hover:bg-accent transition-all active:scale-95">
          <Sun className="w-[18px] h-[18px] text-muted-foreground" />
        </button>

        <button className="relative p-2.5 rounded-xl hover:bg-accent transition-all active:scale-95">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-edu-red text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-card">
            5
          </span>
        </button>

        <div className="w-px h-8 bg-border mx-1" />

        <button className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-accent transition-all active:scale-[0.98] group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
            AD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-semibold text-foreground leading-tight">
              Admin
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">admin@mzuni.ac.mw</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  );
}
