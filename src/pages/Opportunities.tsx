import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { Button } from "@/components/ui/button";
import { OpportunitiesStats } from "@/components/opportunities/OpportunitiesStats";
import { OpportunitiesFilters } from "@/components/opportunities/OpportunitiesFilters";
import { OpportunitiesTable } from "@/components/opportunities/OpportunitiesTable";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { FeaturedOpportunities } from "@/components/opportunities/FeaturedOpportunities";
import { OpportunityFormModal } from "@/components/opportunities/OpportunityFormModal";
import { OpportunityDetailsModal } from "@/components/opportunities/OpportunityDetailsModal";
import { DeleteOpportunityDialog } from "@/components/opportunities/DeleteOpportunityDialog";
import { mockOpportunities, type Opportunity } from "@/components/opportunities/opportunitiesData";
import { toast } from "@/hooks/use-toast";

const Opportunities = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Opportunity | null>(null);
  const [viewTarget, setViewTarget] = useState<Opportunity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);

  const hasActiveFilters = search !== "" || category !== "all" || status !== "all";

  const filtered = useMemo(() => {
    let result = [...opportunities];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) => o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q)
      );
    }
    if (category !== "all") result = result.filter((o) => o.category === category);
    if (status !== "all") result = result.filter((o) => o.status === status);

    switch (sort) {
      case "oldest": result.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated)); break;
      case "deadline": result.sort((a, b) => a.deadline.localeCompare(b.deadline)); break;
      case "amount-high": result.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount)); break;
      case "amount-low": result.sort((a, b) => parseAmount(a.amount) - parseAmount(b.amount)); break;
      default: result.sort((a, b) => b.dateCreated.localeCompare(a.dateCreated));
    }
    return result;
  }, [opportunities, search, category, status, sort]);

  const clearFilters = () => { setSearch(""); setCategory("all"); setStatus("all"); setSort("newest"); };

  const handleView = (opp: Opportunity) => setViewTarget(opp);
  const handleEdit = (opp: Opportunity) => { setEditTarget(opp); setFormOpen(true); };
  const handleDelete = (opp: Opportunity) => setDeleteTarget(opp);

  const handleSave = (data: Partial<Opportunity>) => {
    if (editTarget) {
      setOpportunities((prev) => prev.map((o) => (o.id === editTarget.id ? { ...o, ...data } as Opportunity : o)));
      toast({ title: "Opportunity updated", description: `"${data.title}" has been updated successfully.` });
    } else {
      const newOpp: Opportunity = {
        id: String(Date.now()),
        title: data.title || "",
        organization: data.organization || "",
        category: (data.category as Opportunity["category"]) || "scholarship",
        fundingType: data.fundingType || "",
        amount: data.amount || "",
        deadline: data.deadline || "",
        status: (data.status as Opportunity["status"]) || "draft",
        dateCreated: new Date().toISOString().split("T")[0],
        description: data.description || "",
        eligibility: data.eligibility || "",
        requiredDocuments: data.requiredDocuments || "",
        applicationInstructions: data.applicationInstructions || "",
        featured: data.featured || false,
      };
      setOpportunities((prev) => [newOpp, ...prev]);
      toast({ title: "Opportunity created", description: `"${newOpp.title}" has been added successfully.` });
    }
    setEditTarget(null);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setOpportunities((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      toast({ title: "Opportunity deleted", description: `"${deleteTarget.title}" has been removed.`, variant: "destructive" });
      setDeleteTarget(null);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-background">
        {mobileOpen && (
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <AdminSidebar />
        </div>
        <div className="hidden lg:block shrink-0">
          <AdminSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopNav onMenuToggle={() => setMobileOpen((o) => !o)} />

          <main className="flex-1 p-4 lg:p-6 space-y-5 overflow-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Manage Opportunities
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Create, update, and manage funding opportunities available to students.
                </p>
              </div>
              <Button asChild className="h-10 text-sm gap-2 rounded-xl shadow-lg shadow-primary/15 px-5">
                <Link to="/opportunities/create">
                  <Plus className="w-4 h-4" />
                  Add Opportunity
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <OpportunitiesStats />

            {/* Featured */}
            <FeaturedOpportunities opportunities={opportunities} onView={handleView} />

            {/* Filters & View Toggle */}
            <OpportunitiesFilters
              search={search} onSearchChange={setSearch}
              category={category} onCategoryChange={setCategory}
              status={status} onStatusChange={setStatus}
              sort={sort} onSortChange={setSort}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Content */}
            {viewMode === "card" ? (
              filtered.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-3">
                  {filtered.map((opp, i) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      index={i}
                    />
                  ))}
                </div>
              )
            ) : (
              <OpportunitiesTable opportunities={filtered} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </main>
        </div>

        {/* Modals */}
        <OpportunityFormModal open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditTarget(null); }} opportunity={editTarget} onSave={handleSave} />
        <OpportunityDetailsModal open={!!viewTarget} onOpenChange={(o) => { if (!o) setViewTarget(null); }} opportunity={viewTarget} onEdit={handleEdit} />
        <DeleteOpportunityDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }} opportunity={deleteTarget} onConfirm={confirmDelete} />
      </div>
    </TooltipProvider>
  );
};

function EmptyState() {
  return (
    <div className="bg-card/70 backdrop-blur-xl rounded-2xl border border-border/50 p-16 text-center animate-fade-in-up shadow-sm" style={{ animationDelay: "400ms" }}>
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

function parseAmount(amount: string): number {
  return parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
}

export default Opportunities;
