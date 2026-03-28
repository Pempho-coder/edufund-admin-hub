import {
  Calendar,
  Users,
  Star,
  Pencil,
  Trash2,
  BadgeCheck,
  Clock,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Opportunity } from "./opportunitiesData";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onView: (opp: Opportunity) => void;
  onEdit: (opp: Opportunity) => void;
  onDelete: (opp: Opportunity) => void;
  index: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Open",
    className: "bg-edu-green-light text-primary border-primary/20",
  },
  draft: {
    label: "Draft",
    className: "bg-edu-amber-light text-edu-amber border-edu-amber/20",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const categoryConfig: Record<string, { label: string; className: string }> = {
  scholarship: {
    label: "Scholarship",
    className: "bg-edu-blue-light text-edu-blue border-edu-blue/20",
  },
  bursary: {
    label: "Bursary",
    className: "bg-edu-green-light text-primary border-primary/20",
  },
  grant: {
    label: "Grant",
    className: "bg-purple-50 text-purple-600 border-purple-200",
  },
  loan: {
    label: "Loan",
    className: "bg-edu-amber-light text-edu-amber border-edu-amber/20",
  },
  research: {
    label: "Research",
    className: "bg-edu-red-light text-edu-red border-edu-red/20",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isClosingSoon(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
}

export function OpportunityCard({
  opportunity: opp,
  onView,
  onEdit,
  onDelete,
  index,
}: OpportunityCardProps) {
  const closingSoon = isClosingSoon(opp.deadline);
  const cat = categoryConfig[opp.category];
  const stat = statusConfig[opp.status];

  return (
    <div
      onClick={() => onView(opp)}
      className="group relative bg-card rounded-2xl border border-border/60 p-5 hover:shadow-xl hover:shadow-foreground/[0.04] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${100 + index * 50}ms` }}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* LEFT — Title & org */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {opp.title}
            </h3>
            {opp.featured && (
              <Star className="w-3.5 h-3.5 text-edu-yellow fill-edu-yellow shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{opp.organization}</p>
          <div className="flex items-center gap-1.5 pt-0.5">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold border ${cat.className} rounded-full px-2.5 py-0.5`}
            >
              {cat.label}
            </Badge>
            {opp.fundingType && (
              <Badge
                variant="outline"
                className="text-[10px] font-medium text-muted-foreground border-border rounded-full px-2.5 py-0.5"
              >
                {opp.fundingType}
              </Badge>
            )}
          </div>
        </div>

        {/* MIDDLE — Amount, deadline, applicants */}
        <div className="flex items-center gap-6 lg:gap-8 flex-wrap text-sm">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground tabular-nums text-[13px]">
              {opp.amount}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span
              className={`text-[13px] tabular-nums ${closingSoon ? "text-edu-amber font-medium" : "text-muted-foreground"}`}
            >
              {formatDate(opp.deadline)}
            </span>
            {closingSoon && (
              <Badge className="text-[9px] font-bold bg-edu-amber/10 text-edu-amber border-edu-amber/20 rounded-full px-1.5 py-0">
                <Clock className="w-2.5 h-2.5 mr-0.5" />
                Soon
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground tabular-nums">
              {Math.floor(Math.random() * 80 + 10)} applicants
            </span>
          </div>
        </div>

        {/* RIGHT — Status & actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold border ${stat.className} rounded-full px-2.5 py-0.5`}
            >
              {stat.label}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-5 h-5 rounded-full bg-edu-green-light flex items-center justify-center">
                  <BadgeCheck className="w-3 h-3 text-primary" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Verified
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Subtle divider */}
          <div className="hidden lg:block w-px h-6 bg-border" />

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-edu-blue hover:bg-edu-blue-light rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => onEdit(opp)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Edit
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-edu-red-light rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => onDelete(opp)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Delete
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
