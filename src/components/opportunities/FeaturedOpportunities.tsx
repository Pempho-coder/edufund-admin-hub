import { Star, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Opportunity } from "./opportunitiesData";

interface FeaturedOpportunitiesProps {
  opportunities: Opportunity[];
  onView: (opp: Opportunity) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function FeaturedOpportunities({ opportunities, onView }: FeaturedOpportunitiesProps) {
  const featured = opportunities.filter((o) => o.featured && o.status === "active").slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-edu-yellow fill-edu-yellow" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Featured Opportunities
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {featured.map((opp) => (
          <div
            key={opp.id}
            onClick={() => onView(opp)}
            className="group relative bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] rounded-2xl border border-primary/10 p-5 cursor-pointer hover:shadow-lg hover:shadow-primary/[0.06] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 rounded-t-2xl" />
            <Badge className="text-[10px] font-semibold bg-edu-green-light text-primary border-primary/15 rounded-full px-2 py-0.5 mb-3">
              Featured
            </Badge>
            <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {opp.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">{opp.organization}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(opp.deadline)}
              </div>
              <span className="text-xs font-semibold text-primary">{opp.amount}</span>
            </div>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-primary/0 group-hover:text-primary/60 transition-all translate-x-1 group-hover:translate-x-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
