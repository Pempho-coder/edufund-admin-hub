import { Search, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpportunitiesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
}

export function OpportunitiesFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
}: OpportunitiesFiltersProps) {
  return (
    <div
      className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/50 p-4 animate-fade-in-up shadow-sm"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 text-sm bg-background/60 rounded-full border-border/50 focus-visible:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px] h-10 text-sm bg-background/60 rounded-xl border-border/50">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="scholarship">Scholarship</SelectItem>
              <SelectItem value="bursary">Bursary</SelectItem>
              <SelectItem value="grant">Grant</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[130px] h-10 text-sm bg-background/60 rounded-xl border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Open</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px] h-10 text-sm bg-background/60 rounded-xl border-border/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="amount-high">Amount (High)</SelectItem>
              <SelectItem value="amount-low">Amount (Low)</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-10 text-xs gap-1.5 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}

          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-0.5 bg-muted/60 rounded-xl p-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-lg transition-all ${viewMode === "card" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              onClick={() => onViewModeChange("card")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-lg transition-all ${viewMode === "table" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              onClick={() => onViewModeChange("table")}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
