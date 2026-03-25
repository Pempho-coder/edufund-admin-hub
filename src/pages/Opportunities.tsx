import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { Button } from "@/components/ui/button";
import { OpportunitiesStats } from "@/components/opportunities/OpportunitiesStats";
import { OpportunitiesFilters } from "@/components/opportunities/OpportunitiesFilters";
import { OpportunitiesTable } from "@/components/opportunities/OpportunitiesTable";
import { OpportunityFormModal } from "@/components/opportunities/OpportunityFormModal";
import { OpportunityDetailsModal } from "@/components/opportunities/OpportunityDetailsModal";
import { DeleteOpportunityDialog } from "@/components/opportunities/DeleteOpportunityDialog";
import { mockOpportunities, type Opportunity } from "@/components/opportunities/opportunitiesData";
import { toast } from "@/hooks/use-toast";

const Opportunities = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);

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
      result = result.filter((o) => o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q));
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
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Manage Opportunities</h2>
              <p className="text-sm text-muted-foreground mt-1">Create, update, and manage funding opportunities available to students.</p>
            </div>
            <Button asChild className="h-9 text-sm gap-2 shadow-md shadow-primary/15">
              <Link to="/opportunities/create"><Plus className="w-4 h-4" /> Add Opportunity</Link>
            </Button>
          </div>

          <OpportunitiesStats />

          <OpportunitiesFilters
            search={search} onSearchChange={setSearch}
            category={category} onCategoryChange={setCategory}
            status={status} onStatusChange={setStatus}
            sort={sort} onSortChange={setSort}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <OpportunitiesTable opportunities={filtered} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </main>
      </div>

      {/* Modals */}
      <OpportunityFormModal open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditTarget(null); }} opportunity={editTarget} onSave={handleSave} />
      <OpportunityDetailsModal open={!!viewTarget} onOpenChange={(o) => { if (!o) setViewTarget(null); }} opportunity={viewTarget} onEdit={handleEdit} />
      <DeleteOpportunityDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }} opportunity={deleteTarget} onConfirm={confirmDelete} />
    </div>
  );
};

function parseAmount(amount: string): number {
  return parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
}

export default Opportunities;
