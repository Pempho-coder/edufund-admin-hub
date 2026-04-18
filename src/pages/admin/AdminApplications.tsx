import { useNavigate } from "react-router-dom";
import { Search, Send, FileText, Clock, Eye, FileSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminStore } from "@/hooks/useAdminStore";
import {
  getOpportunityTitles,
  getStudent,
  AWAITING_REVIEW_COUNT,
  UNDER_REVIEW_COUNT,
  FORWARDED_COUNT,
  TOTAL_APPLICATIONS,
} from "@/data/adminMockData";
import { CategoryBadge, MatchBadge, StatusBadge, StudentAvatar } from "@/components/admin/badges";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminApplications() {
  const apps = useAdminStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [oppFilter, setOppFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const opportunityTitles = useMemo(() => getOpportunityTitles(), []);

  const filtered = useMemo(() => {
    let r = [...apps];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((a) => {
        const stu = getStudent(a.studentId);
        return (
          a.opportunityTitle.toLowerCase().includes(q) ||
          (stu && stu.fullName.toLowerCase().includes(q))
        );
      });
    }
    if (statusFilter !== "all") r = r.filter((a) => a.status === statusFilter);
    if (oppFilter !== "all") r = r.filter((a) => a.opportunityTitle === oppFilter);

    switch (sort) {
      case "oldest": r.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt)); break;
      case "match-high": r.sort((a, b) => b.matchScore - a.matchScore); break;
      case "match-low": r.sort((a, b) => a.matchScore - b.matchScore); break;
      default: r.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    }
    return r;
  }, [apps, search, statusFilter, oppFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const stats = [
    { label: "Total Applications", value: TOTAL_APPLICATIONS, sub: "Across all opportunities", icon: FileText, color: "text-edu-blue", bg: "bg-edu-blue-light", urgent: false },
    { label: "Awaiting Review", value: AWAITING_REVIEW_COUNT, sub: "Not yet opened", icon: Clock, color: "text-edu-amber", bg: "bg-edu-amber-light", urgent: true },
    { label: "Under Review", value: UNDER_REVIEW_COUNT, sub: "Currently being reviewed", icon: Eye, color: "text-purple-600", bg: "bg-purple-100", urgent: false },
    { label: "Forwarded", value: FORWARDED_COUNT, sub: "Sent to organisations", icon: Send, color: "text-primary", bg: "bg-edu-green-light", urgent: false },
  ];

  const handleView = (id: string) => navigate(`/admin/applications/${id}`);

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-[1400px] mx-auto animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review, track, and forward student applications.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <Card
              key={s.label}
              className={cn(
                "p-5 rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow",
                s.urgent && "border-l-4 border-l-edu-amber"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p
                    className={cn(
                      "text-3xl font-bold mt-2 tabular-nums",
                      s.urgent && "animate-soft-pulse"
                    )}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                  <s.icon className={cn("w-5 h-5", s.color)} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter bar */}
        <Card className="p-3 rounded-2xl border-border/60 shadow-sm sticky top-16 z-20 bg-card/90 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search student or opportunity..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[170px] rounded-xl"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="forwarded">Forwarded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={oppFilter} onValueChange={(v) => { setOppFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[220px] rounded-xl"><SelectValue placeholder="All Opportunities" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opportunities</SelectItem>
                {opportunityTitles.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[170px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="match-high">Highest Match</SelectItem>
                <SelectItem value="match-low">Lowest Match</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-xs text-muted-foreground">
              Showing {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center">
              <FileSearch className="w-12 h-12 text-muted-foreground/50" />
              <p className="mt-4 text-base font-semibold">No applications found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="text-xs uppercase tracking-wider">Student</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Opportunity</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-center">Match</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Submitted</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((a) => {
                    const stu = getStudent(a.studentId);
                    const unread = a.status === "submitted" && !a.openedAt;
                    return (
                      <TableRow
                        key={a.id}
                        className={cn("group", unread && "border-l-4 border-l-edu-blue/60")}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <StudentAvatar name={stu?.fullName ?? "—"} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{stu?.fullName}</p>
                              <p className="text-xs text-muted-foreground truncate">{stu?.faculty}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-semibold truncate max-w-[240px]">
                            {a.opportunityTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{a.organisation}</span>
                            <CategoryBadge category={a.category} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center"><MatchBadge score={a.matchScore} /></TableCell>
                        <TableCell>
                          <p className="text-[13px] font-semibold">{a.submittedAt.split(",")[0]}</p>
                          <p className="text-xs text-muted-foreground">{a.submittedAt.split(",")[1]?.trim()}</p>
                        </TableCell>
                        <TableCell><StatusBadge status={a.status} pulse={unread} /></TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(a.id)}
                            className="rounded-xl border-primary/30 text-primary hover:bg-edu-green-light hover:text-primary"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  Page {safePage} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === safePage ? "default" : "outline"}
                      className={cn("rounded-lg w-9", p === safePage && "bg-primary")}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
