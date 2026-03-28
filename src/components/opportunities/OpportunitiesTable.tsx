import { Pencil, Trash2, Star, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Opportunity } from "./opportunitiesData";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  onView: (opp: Opportunity) => void;
  onEdit: (opp: Opportunity) => void;
  onDelete: (opp: Opportunity) => void;
}

const statusLabels: Record<string, string> = {
  active: "Open",
  draft: "Draft",
  closed: "Closed",
};

const statusStyles: Record<string, string> = {
  active: "bg-edu-green-light text-primary border-primary/20",
  draft: "bg-edu-amber-light text-edu-amber border-edu-amber/20",
  closed: "bg-muted text-muted-foreground border-border",
};

const categoryLabels: Record<string, string> = {
  scholarship: "Scholarship",
  bursary: "Bursary",
  grant: "Grant",
  loan: "Loan",
  research: "Research",
};

export function OpportunitiesTable({ opportunities, onView, onEdit, onDelete }: OpportunitiesTableProps) {
  if (opportunities.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/60 p-16 text-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No opportunities yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          Get started by creating your first funding opportunity for students.
        </p>
        <Button asChild className="rounded-xl gap-2 shadow-lg shadow-primary/15">
          <Link to="/opportunities/create">
            <Plus className="w-4 h-4" />
            Create your first opportunity
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden animate-fade-in-up shadow-sm" style={{ animationDelay: "300ms" }}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/60">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4 pl-5">
              Opportunity
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4 hidden md:table-cell">
              Category
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4 hidden sm:table-cell">
              Applicants
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4 hidden lg:table-cell">
              Deadline
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4 hidden md:table-cell">
              Featured
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-4 text-right pr-5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow
              key={opp.id}
              className="group cursor-pointer hover:bg-muted/30 transition-colors border-border/40"
              onClick={() => onView(opp)}
            >
              {/* Opportunity — title + org */}
              <TableCell className="py-4 pl-5">
                <div>
                  <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {opp.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opp.organization}</p>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell className="py-4 hidden md:table-cell">
                <span className="text-sm text-muted-foreground">{categoryLabels[opp.category]}</span>
              </TableCell>

              {/* Applicants */}
              <TableCell className="py-4 hidden sm:table-cell">
                <span className="text-sm text-muted-foreground tabular-nums">{Math.floor(Math.random() * 80 + 5)}</span>
              </TableCell>

              {/* Deadline */}
              <TableCell className="py-4 hidden lg:table-cell">
                <span className="text-sm text-muted-foreground tabular-nums">{formatDate(opp.deadline)}</span>
              </TableCell>

              {/* Status */}
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={`text-[11px] font-semibold border rounded-full px-2.5 ${statusStyles[opp.status]}`}
                >
                  {statusLabels[opp.status]}
                </Badge>
              </TableCell>

              {/* Featured */}
              <TableCell className="py-4 hidden md:table-cell">
                {opp.featured ? (
                  <Badge variant="outline" className="text-[11px] font-semibold text-edu-amber border-edu-amber/20 bg-edu-amber-light rounded-full px-2.5 gap-1">
                    <Star className="w-3 h-3 fill-edu-amber" />
                    Featured
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell className="py-4 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs font-semibold rounded-lg gap-1.5 bg-edu-blue text-white hover:bg-edu-blue/90 shadow-sm"
                    onClick={() => onEdit(opp)}
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs font-semibold rounded-lg gap-1.5 shadow-sm"
                    onClick={() => onDelete(opp)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
