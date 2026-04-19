import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  Search,
  Download,
  Maximize2,
  FileText,
  CheckCircle2,
  Eye,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getApplications,
  getStudent,
  markAsForwarded,
  markAsViewed,
  type Application,
  type ApplicationStatus,
} from "@/data/adminMockData";
import { useAdminStore } from "@/hooks/useAdminStore";
import { CategoryBadge, MatchBadge, StudentAvatar } from "@/components/admin/badges";

type FilterKey = "all" | "needs_review" | "under_review" | "forwarded";

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_review", label: "Needs Review" },
  { key: "under_review", label: "Under Review" },
  { key: "forwarded", label: "Forwarded" },
];

const statusDot = (s: ApplicationStatus, opened: boolean) => {
  if (s === "forwarded") return { cls: "bg-primary", pulse: false };
  if (s === "under_review") return { cls: "bg-edu-amber", pulse: false };
  return { cls: "bg-edu-blue", pulse: !opened };
};

const matchPillCls = (score: number) =>
  score >= 75
    ? "bg-edu-green-light text-primary"
    : score >= 50
    ? "bg-edu-amber-light text-edu-amber"
    : "bg-edu-red-light text-edu-red";

export default function AdminReview() {
  useAdminStore();
  const apps = getApplications();
  const [filter, setFilter] = useState<FilterKey>("needs_review");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("a2");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = apps;
    if (filter === "needs_review") list = list.filter((a) => a.status === "submitted");
    if (filter === "under_review") list = list.filter((a) => a.status === "under_review");
    if (filter === "forwarded") list = list.filter((a) => a.status === "forwarded");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((a) => {
        const s = getStudent(a.studentId);
        return (
          a.opportunityTitle.toLowerCase().includes(q) ||
          (s?.fullName.toLowerCase().includes(q) ?? false)
        );
      });
    }
    return list;
  }, [apps, filter, query]);

  const selected = apps.find((a) => a.id === selectedId);

  // Auto-mark as viewed (Submitted -> Under Review) on open
  useEffect(() => {
    if (selected && selected.status === "submitted") {
      markAsViewed(selected.id);
    }
  }, [selectedId, selected]);

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-7rem)] -m-4 lg:-m-6">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-background border-b border-border/60">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-foreground">
                Review &amp; Forward
              </h1>
              <p className="text-[15px] text-muted-foreground mt-1">
                Review applications and forward to organisations
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="inline-flex p-1 bg-muted/60 rounded-full">
                {filterTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key)}
                    className={cn(
                      "px-4 h-8 rounded-full text-xs font-semibold transition-all",
                      filter === t.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="text-[13px] text-muted-foreground">
                Showing {filtered.length} application{filtered.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>

        {/* Two-panel */}
        <div className="flex-1 flex min-h-0">
          {/* LEFT */}
          <aside className="w-[35%] min-w-[320px] border-r border-border/60 bg-card flex flex-col">
            <div className="sticky top-0 z-10 bg-card border-b border-border/60 px-4 py-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">Applications</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search student or opportunity..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 h-9 rounded-xl bg-muted/40 border-border/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <EmptyState filter={filter} query={query} />
              ) : (
                filtered.map((a) => {
                  const s = getStudent(a.studentId);
                  if (!s) return null;
                  const isSel = a.id === selectedId;
                  const opened = a.openedAt !== null;
                  const dot = statusDot(a.status, opened);
                  const isUnread = a.status === "submitted" && !opened;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={cn(
                        "w-full text-left px-4 py-3.5 border-b border-border/60 transition-colors relative",
                        isSel
                          ? "bg-edu-green-light/60"
                          : isUnread
                          ? "bg-edu-blue-light/30 hover:bg-muted/50"
                          : "hover:bg-muted/40"
                      )}
                    >
                      {isSel && (
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {s.fullName}
                        </p>
                        <span className="relative flex w-2 h-2 shrink-0">
                          {dot.pulse && (
                            <span
                              className={cn(
                                "absolute inset-0 rounded-full opacity-75 animate-soft-pulse",
                                dot.cls
                              )}
                            />
                          )}
                          <span className={cn("relative w-2 h-2 rounded-full", dot.cls)} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[13px] text-muted-foreground truncate">
                          {a.opportunityTitle.length > 26
                            ? a.opportunityTitle.slice(0, 26) + "…"
                            : a.opportunityTitle}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center justify-center h-5 px-2 rounded-full text-[11px] font-bold tabular-nums shrink-0",
                            matchPillCls(a.matchScore)
                          )}
                        >
                          {a.matchScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[12px] text-muted-foreground">
                          Submitted {a.submittedAt.split(",")[0]}
                        </p>
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full bg-edu-blue-light text-edu-blue text-[10px] font-bold uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* RIGHT */}
          <section className="flex-1 min-w-0 bg-muted/20 flex flex-col">
            {!selected ? (
              <EmptyRight />
            ) : (
              <SelectedView
                app={selected}
                onForwardClick={() => setModalOpen(true)}
              />
            )}
          </section>
        </div>
      </div>

      {selected && (
        <ForwardModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          app={selected}
        />
      )}
    </AdminLayout>
  );
}

// ───────── Empty states ─────────
function EmptyState({ filter, query }: { filter: FilterKey; query: string }) {
  if (query.trim()) {
    return (
      <Center>
        <Search className="w-12 h-12 text-muted-foreground/60" />
        <p className="mt-3 font-semibold text-foreground">No results</p>
        <p className="text-[13px] text-muted-foreground">Try a different search term</p>
      </Center>
    );
  }
  if (filter === "needs_review") {
    return (
      <Center>
        <CheckCircle2 className="w-12 h-12 text-primary" />
        <p className="mt-3 font-semibold text-primary">All caught up!</p>
        <p className="text-[13px] text-muted-foreground">No applications need review</p>
      </Center>
    );
  }
  if (filter === "under_review") {
    return (
      <Center>
        <Eye className="w-12 h-12 text-muted-foreground/60" />
        <p className="mt-3 font-semibold text-foreground">None under review</p>
        <p className="text-[13px] text-muted-foreground">
          No applications are currently being reviewed
        </p>
      </Center>
    );
  }
  if (filter === "forwarded") {
    return (
      <Center>
        <Send className="w-12 h-12 text-muted-foreground/60" />
        <p className="mt-3 font-semibold text-foreground">Nothing forwarded yet</p>
        <p className="text-[13px] text-muted-foreground">
          Forwarded applications will appear here
        </p>
      </Center>
    );
  }
  return (
    <Center>
      <FileText className="w-12 h-12 text-muted-foreground/60" />
      <p className="mt-3 font-semibold text-foreground">No applications</p>
    </Center>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {children}
    </div>
  );
}

function EmptyRight() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <Send className="w-14 h-14 text-primary/30" />
      <p className="mt-4 text-lg font-bold text-muted-foreground">Select an application</p>
      <p className="text-sm text-muted-foreground/80">Choose from the list to review</p>
    </div>
  );
}

// ───────── Selected view ─────────
function SelectedView({
  app,
  onForwardClick,
}: {
  app: Application;
  onForwardClick: () => void;
}) {
  const student = getStudent(app.studentId);
  const [downloaded, setDownloaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const downloadHref = `/admin/applications/${app.id}/download`;
  const pdfHref = `/admin/applications/${app.id}/pdf`;

  if (!student) return null;

  const handleDownloadClick = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <>
      {/* Section A — header */}
      <div className="bg-card border-b border-border/60 px-6 py-5 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <StudentAvatar name={student.fullName} size={44} />
            <div className="min-w-0">
              <p className="font-bold text-base text-foreground truncate">{student.fullName}</p>
              <p className="text-[13px] text-muted-foreground truncate">
                {student.faculty} · {student.program}
              </p>
            </div>
            <div className="hidden md:block w-px h-10 bg-border mx-1" />
            <div className="min-w-0">
              <CategoryBadge category={app.category} />
              <p className="font-bold text-[15px] text-foreground mt-1 truncate">
                {app.opportunityTitle}
              </p>
              <p className="text-[13px] text-muted-foreground truncate">{app.organisation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusPillLarge status={app.status} />
            <span
              className={cn(
                "inline-flex items-center px-3 h-7 rounded-full text-[13px] font-bold tabular-nums",
                matchPillCls(app.matchScore)
              )}
            >
              {app.matchScore}% match
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={downloadHref}
            download={`application_${app.code}.pdf`}
            onClick={handleDownloadClick}
          >
            <Button
              type="button"
              variant="outline"
              className="h-[38px] rounded-xl border-primary/30 text-primary hover:bg-edu-green-light"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Downloaded
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PDF
                </>
              )}
            </Button>
          </a>

          {app.status !== "forwarded" ? (
            <Button
              onClick={onForwardClick}
              className="h-[38px] rounded-xl bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" /> Mark as Forwarded
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 h-[38px] rounded-xl bg-edu-green-light text-primary text-[13px] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Forwarded to {app.forwardedTo} on {app.forwardedAt}
            </span>
          )}
        </div>

        {app.status === "forwarded" && (
          <div className="rounded-xl border border-primary/20 bg-edu-green-light/60 px-4 py-3 space-y-1.5 text-[13px]">
            <Row label="Forwarded to:" value={app.forwardedTo ?? "—"} />
            <Row label="Date forwarded:" value={app.forwardedAt ?? "—"} />
            <Row
              label="Notes:"
              value={app.forwardingNotes || ""}
              italicEmpty
            />
          </div>
        )}
      </div>

      {/* Section B — viewer */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#f8f9fa]">
        <div className="h-10 bg-card border-b border-border/60 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[13px]">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">Application PDF</span>
            <span className="text-primary font-medium">· {student.fullName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={pdfHref} target="_blank" rel="noreferrer">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={downloadHref}
                  download={`application_${app.code}.pdf`}
                  onClick={handleDownloadClick}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Download PDF</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-4 min-h-0">
          <div className="h-full rounded-xl bg-card border border-border/60 overflow-hidden relative">
            {iframeError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <AlertTriangle className="w-10 h-10 text-edu-amber" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Could not load PDF preview
                </p>
                <a
                  href={downloadHref}
                  download
                  className="mt-2 text-sm font-semibold text-primary hover:underline"
                >
                  Download instead →
                </a>
              </div>
            ) : (
              <PdfSkeleton />
            )}
            {/* iframe is mounted but PDF endpoint is mocked — skeleton stays visible */}
            <iframe
              key={app.id}
              src={pdfHref}
              title="Application PDF"
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
              onError={() => setIframeError(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function PdfSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20">
      <div className="flex flex-col items-center">
        <FileText className="w-10 h-10 text-muted-foreground/60" />
        <p className="mt-2 text-sm text-muted-foreground">Generating PDF…</p>
      </div>
      <div className="mt-6 w-3/5 max-w-md space-y-2">
        <div className="h-3 rounded bg-muted animate-pulse" />
        <div className="h-3 rounded bg-muted animate-pulse w-5/6" />
        <div className="h-3 rounded bg-muted animate-pulse w-4/6" />
        <div className="h-3 rounded bg-muted animate-pulse" />
        <div className="h-3 rounded bg-muted animate-pulse w-3/4" />
      </div>
    </div>
  );
}

function StatusPillLarge({ status }: { status: ApplicationStatus }) {
  const map = {
    submitted: { label: "Submitted", cls: "bg-edu-blue-light text-edu-blue" },
    under_review: { label: "Under Review", cls: "bg-edu-amber-light text-edu-amber" },
    forwarded: { label: "Forwarded", cls: "bg-primary text-primary-foreground" },
  } as const;
  const it = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 h-7 rounded-full text-[12px] font-semibold",
        it.cls
      )}
    >
      {it.label}
    </span>
  );
}

function Row({
  label,
  value,
  italicEmpty,
}: {
  label: string;
  value: string;
  italicEmpty?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      {value ? (
        <span className="font-semibold text-foreground">{value}</span>
      ) : (
        <span className={cn("text-muted-foreground", italicEmpty && "italic")}>None</span>
      )}
    </div>
  );
}

// ───────── Forwarding modal ─────────
function ForwardModal({
  open,
  onOpenChange,
  app,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  app: Application;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const student = getStudent(app.studentId);
  const [forwardedTo, setForwardedTo] = useState("");
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setForwardedTo("");
      setDate(today);
      setNotes("");
      setTouched(false);
      setLoading(false);
      setDownloaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!student) return null;

  const valid = forwardedTo.trim().length > 0;
  const downloadHref = `/admin/applications/${app.id}/download`;
  const pdfHref = `/admin/applications/${app.id}/pdf`;

  const handleConfirm = async () => {
    setTouched(true);
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const formatted = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    markAsForwarded(app.id, {
      forwardedTo: forwardedTo.trim(),
      forwardedAt: formatted,
      forwardingNotes: notes.trim() || undefined,
    });
    toast.success(`Application forwarded to ${forwardedTo.trim()}`);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] w-[90vw] p-0 rounded-2xl overflow-hidden gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Send className="w-[22px] h-[22px] text-primary" />
            <h2 className="text-xl font-bold text-foreground">Forward Application</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-edu-red-light hover:text-edu-red transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground px-6 mt-2">
          Confirm you have emailed this application to the organisation and record the details.
        </p>

        <div className="border-t border-border/60 mt-4" />

        {/* Summary strip */}
        <div className="bg-muted/40 border-b border-border/60 px-6 py-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <StudentAvatar name={student.fullName} size={32} />
            <span className="font-bold text-sm text-foreground">{student.fullName}</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-bold text-sm text-primary truncate">
              {app.opportunityTitle}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-muted-foreground">{student.faculty}</span>
            <span
              className={cn(
                "inline-flex items-center px-2 h-5 rounded-full text-[11px] font-bold tabular-nums",
                matchPillCls(app.matchScore)
              )}
            >
              {app.matchScore}% match
            </span>
            <CategoryBadge category={app.category} />
          </div>
        </div>

        {/* PDF section */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Application PDF</span>
            </div>
            <span className="text-xs text-muted-foreground">Review before forwarding</span>
          </div>
          <div className="h-[200px] rounded-xl bg-muted/40 border border-border/60 overflow-hidden relative">
            <PdfSkeleton />
            <iframe
              src={pdfHref}
              title="Application PDF"
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href={pdfHref} target="_blank" rel="noreferrer" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full h-9 rounded-xl"
              >
                <Maximize2 className="w-4 h-4" /> Open Full PDF
              </Button>
            </a>
            <a
              href={downloadHref}
              download={`application_${app.code}.pdf`}
              onClick={() => {
                setDownloaded(true);
                setTimeout(() => setDownloaded(false), 2000);
              }}
              className="block"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full h-9 rounded-xl border-primary/30 text-primary hover:bg-edu-green-light"
              >
                {downloaded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Downloaded ✓
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download PDF
                  </>
                )}
              </Button>
            </a>
          </div>
        </div>

        <div className="border-t border-border/60" />

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fwd-to" className="text-[13px] font-bold">
              Forwarded To <span className="text-edu-red">*</span>
            </Label>
            <Input
              id="fwd-to"
              placeholder="e.g. scholarships@mzuni.ac.mw or Dr. James Phiri"
              value={forwardedTo}
              onChange={(e) => setForwardedTo(e.target.value)}
              onBlur={() => setTouched(true)}
              className={cn(
                "h-10 rounded-xl",
                touched && !valid && "border-edu-red focus-visible:ring-edu-red"
              )}
            />
            {touched && !valid && (
              <p className="text-xs text-edu-red">This field is required</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fwd-date" className="text-[13px] font-bold">
              Date Forwarded <span className="text-edu-red">*</span>
            </Label>
            <Input
              id="fwd-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="fwd-notes" className="text-[13px] font-bold">
                Forwarding Notes
              </Label>
              <span className="text-[11px] text-muted-foreground">Optional</span>
            </div>
            <Textarea
              id="fwd-notes"
              rows={3}
              placeholder="e.g. Sent via email with student's latest results attached. Awaiting response from Dr. Phiri."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 px-6 py-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!valid || loading}
            onClick={handleConfirm}
            className={cn(
              "h-10 min-w-[160px] rounded-xl",
              valid ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Forwarding…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Confirm &amp; Forward
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
