import { Eye, Pencil, Trash2, MoreHorizontal, Star } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Opportunity } from "./opportunitiesData";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  onView: (opp: Opportunity) => void;
  onEdit: (opp: Opportunity) => void;
  onDelete: (opp: Opportunity) => void;
}

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
      <div className="bg-card rounded-xl border border-border p-12 text-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Star className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No opportunities found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          No opportunities match your current filters. Try adjusting your search or create a new opportunity.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: "400ms" }}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Organization</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Category</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Amount</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Deadline</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Created</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow key={opp.id} className="group cursor-default">
              <TableCell>
                <div className="flex items-center gap-2">
                  {opp.featured && <Star className="w-3.5 h-3.5 text-edu-yellow fill-edu-yellow shrink-0" />}
                  <span className="text-sm font-medium text-foreground line-clamp-1">{opp.title}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-muted-foreground">{opp.organization}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge variant="outline" className="text-[11px] font-medium capitalize">
                  {categoryLabels[opp.category]}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-sm font-medium text-foreground tabular-nums">{opp.amount}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm text-muted-foreground tabular-nums">{formatDate(opp.deadline)}</span>
              </TableCell>
              <TableCell>
                <Badge className={`text-[11px] font-semibold capitalize border ${statusStyles[opp.status]}`} variant="outline">
                  {opp.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm text-muted-foreground tabular-nums">{formatDate(opp.dateCreated)}</span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onView(opp)} className="gap-2 text-sm">
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(opp)} className="gap-2 text-sm">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(opp)} className="gap-2 text-sm text-destructive focus:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
