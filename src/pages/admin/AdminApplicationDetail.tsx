import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Download, Send, Check, X, User, PenSquare, Paperclip, Info,
  CheckCircle2, Lightbulb, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/hooks/useAdminStore";
import {
  getApplicationById, getStudent, markAsViewed, markAsForwarded,
} from "@/data/adminMockData";
import { CategoryBadge, StatusBadge } from "@/components/admin/badges";
import { MarkForwardedModal } from "@/components/admin/applications/MarkForwardedModal";
import { cn } from "@/lib/utils";

export default function AdminApplicationDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  useAdminStore(); // subscribe to re-renders

  const [forwardOpen, setForwardOpen] = useState(false);

  // Auto status change on mount
  useEffect(() => {
    if (id) markAsViewed(id);
  }, [id]);

  const app = getApplicationById(id);
  if (!app) {
    return (
      <AdminLayout>
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-lg font-semibold">Application not found</p>
          <Button onClick={() => navigate("/admin/applications")} className="mt-4 rounded-xl">
            Back to Applications
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const student = getStudent(app.studentId);

  const handleConfirmForward = (payload: {
    forwardedTo: string; forwardedAt: string; forwardingNotes?: string;
  }) => {
    markAsForwarded(app.id, payload);
    toast.success("Application marked as forwarded");
  };

  const handleDownload = () => {
    toast.success("PDF download started");
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto animate-fade-in-up space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/admin/applications" className="flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Applications
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">
            {student?.fullName} — {app.opportunityTitle}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight leading-tight">
              {app.opportunityTitle}
            </h1>
            <p className="text-base text-muted-foreground mt-0.5">{app.organisation}</p>
            <div className="flex items-center gap-2 mt-3">
              <CategoryBadge category={app.category} />
              <StatusBadge status={app.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl border-primary/30 text-primary" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download PDF
            </Button>
            {app.status === "forwarded" ? (
              <span className="inline-flex items-center px-4 h-10 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                Forwarded on {app.forwardedAt}
              </span>
            ) : (
              app.status === "under_review" && (
                <Button
                  className="rounded-xl bg-primary hover:bg-primary/90"
                  onClick={() => setForwardOpen(true)}
                >
                  <Send className="w-4 h-4" /> Mark as Forwarded
                </Button>
              )
            )}
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
          {/* LEFT */}
          <div className="space-y-5 min-w-0">
            {/* Match Score */}
            <Card className="rounded-2xl border-border/60 shadow-sm border-l-4 border-l-primary p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[56px] leading-none font-bold text-primary">{app.matchScore}</span>
                  <span className="text-3xl font-bold text-primary">%</span>
                  <span className="ml-3 text-sm text-muted-foreground self-end pb-2">Match Score</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-muted-foreground mb-2">Why this score?</p>
                  <div className="flex flex-wrap gap-2">
                    {app.matchBreakdown.map((b) => (
                      <span
                        key={b.label}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                          b.matched
                            ? "bg-edu-green-light text-primary border-primary/20"
                            : "bg-edu-red-light text-edu-red border-edu-red/20"
                        )}
                      >
                        {b.matched ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {b.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs italic text-muted-foreground mt-3">
                    Score computed at time of application submission
                  </p>
                </div>
              </div>
            </Card>

            {/* Applicant Details */}
            {student && (
              <Card className="rounded-2xl border-border/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Applicant Details</h2>
                  </div>
                  <Badge variant="secondary" className="text-[10px] rounded-full">
                    Snapshot — frozen at submission
                  </Badge>
                </div>

                <Section title="Personal">
                  <Field label="Full Name" value={student.fullName} />
                  <Field label="Email" value={student.email} />
                  <Field label="Phone" value={student.phone} />
                  <Field label="Date of Birth" value={student.dateOfBirth} />
                  <Field label="Gender" value={student.gender} />
                  <Field label="Nationality" value={student.nationality} />
                </Section>
                <Section title="Academic">
                  <Field label="Faculty" value={student.faculty} />
                  <Field label="Program" value={student.program} />
                  <Field label="Year of Study" value={String(student.year)} />
                  <Field label="Semester" value={String(student.semester)} />
                  <Field label="Level" value={student.level} />
                  <Field label="Mode" value={student.mode} />
                  <Field
                    label="Avg Score"
                    value={
                      <span className="flex items-center gap-2">
                        {student.avgScore}%
                        {student.scoreVerified ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-edu-green-light text-primary">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-edu-amber-light text-edu-amber">
                            Self-reported
                          </span>
                        )}
                      </span>
                    }
                  />
                  <Field label="MSCE Points" value={String(student.msceaPoints)} />
                </Section>
                <Section title="Financial" last>
                  <Field
                    label="Financial Need"
                    value={
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        student.financialNeed ? "bg-edu-green-light text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {student.financialNeed ? "Yes" : "No"}
                      </span>
                    }
                  />
                  <Field
                    label="Other Sponsorship"
                    value={
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        student.otherSponsorship ? "bg-edu-green-light text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {student.otherSponsorship ? "Yes" : "No"}
                      </span>
                    }
                  />
                </Section>
              </Card>
            )}

            {/* Essays */}
            <Card className="rounded-2xl border-border/60 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <PenSquare className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Essay Answers</h2>
              </div>
              {app.essays.length === 0 ? (
                <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
                  <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    This opportunity did not include essay questions. Only profile information was required.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {app.essays.map((e, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                          Q{i + 1}
                        </span>
                        <h3 className="text-sm font-semibold flex-1">{e.question}</h3>
                        <span className="text-xs text-muted-foreground">Max {e.maxWords} words</span>
                      </div>
                      <div className="bg-muted/60 rounded-xl p-4 border-l-4 border-l-primary text-sm leading-relaxed text-foreground/90">
                        {e.answer}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">{e.wordCount} words</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Documents */}
            <Card className="rounded-2xl border-border/60 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Paperclip className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Submitted Documents</h2>
              </div>
              {app.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents were attached to this application</p>
              ) : (
                <div className="divide-y divide-border/60">
                  {app.documents.map((d) => (
                    <div key={d.filename} className="flex items-center gap-3 py-3">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{d.type}</p>
                        <p className="text-xs text-muted-foreground truncate">{d.filename}</p>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl border-primary/30 text-primary" onClick={handleDownload}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Status Timeline */}
            <Card className="rounded-2xl border-border/60 shadow-md p-5">
              <h3 className="text-base font-semibold mb-4">Application Status</h3>
              <StatusBadge status={app.status} size="lg" />
              <div className="mt-5 relative pl-6">
                <TimelineNode
                  active
                  title="Submitted"
                  meta={app.submittedAt}
                  desc="Student submitted this application"
                  connectorActive={!!app.openedAt || app.status !== "submitted"}
                />
                <TimelineNode
                  active={app.status !== "submitted"}
                  title="Under Review"
                  meta={app.openedAt ?? "—"}
                  desc="Opened by admin"
                  connectorActive={app.status === "forwarded"}
                />
                <TimelineNode
                  active={app.status === "forwarded"}
                  title="Forwarded"
                  meta={app.forwardedAt ?? "—"}
                  desc={app.forwardedTo ? `Forwarded to ${app.forwardedTo}` : "Not yet forwarded"}
                  last
                />
              </div>
            </Card>

            {/* Forwarding Action */}
            <Card className="rounded-2xl border-border/60 shadow-sm p-5">
              {app.status === "submitted" && (
                <div>
                  <h3 className="text-base font-semibold">Not Yet Reviewed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This application will automatically move to Under Review when you open it.
                  </p>
                  <Button variant="outline" className="w-full rounded-xl border-primary/30 text-primary mt-4">
                    View &amp; Review
                  </Button>
                </div>
              )}
              {app.status === "under_review" && (
                <div>
                  <h3 className="text-base font-semibold">Ready to Forward?</h3>
                  <div className="flex items-start gap-3 mt-3 p-3 bg-edu-green-light rounded-xl">
                    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-primary/90">
                      Download the PDF below, email it to the organisation, then click Mark as Forwarded to complete the process.
                    </p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Button variant="outline" className="w-full rounded-xl border-primary/30 text-primary" onClick={handleDownload}>
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                    <Button className="w-full rounded-xl bg-primary hover:bg-primary/90" onClick={() => setForwardOpen(true)}>
                      <Send className="w-4 h-4" /> Mark as Forwarded
                    </Button>
                  </div>
                </div>
              )}
              {app.status === "forwarded" && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-semibold">Forwarded</h3>
                  </div>
                  <div className="bg-edu-green-light rounded-xl p-4 space-y-1.5 text-sm">
                    <p><span className="font-semibold">Forwarded to:</span> {app.forwardedTo}</p>
                    <p><span className="font-semibold">On:</span> {app.forwardedAt}</p>
                    <p><span className="font-semibold">Notes:</span> {app.forwardingNotes || "None"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    This application is complete. The organisation will contact the student directly.
                  </p>
                </div>
              )}
            </Card>

            {/* App Info */}
            <Card className="rounded-2xl border-border/60 shadow-sm p-5">
              <h3 className="text-base font-semibold mb-3">Application Info</h3>
              <div className="divide-y divide-border/60 text-[13px]">
                <InfoRow label="Application ID" value={`#${app.code}`} />
                <InfoRow label="Submitted" value={app.submittedAt} />
                <InfoRow label="Opportunity" value={app.opportunityTitle} />
                <InfoRow label="Organisation" value={app.organisation} />
                <InfoRow label="Category" value={app.category.charAt(0).toUpperCase() + app.category.slice(1)} />
                <InfoRow label="Deadline Was" value={app.deadline} />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <MarkForwardedModal
        open={forwardOpen}
        onOpenChange={setForwardOpen}
        onConfirm={handleConfirmForward}
      />
    </AdminLayout>
  );
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn("py-4", !last && "border-b border-border/60")}>
      <p className="text-[11px] uppercase font-semibold tracking-wider text-muted-foreground mb-3">
        {title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="font-medium text-foreground flex-1 min-w-0">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}

function TimelineNode({
  active, title, meta, desc, last, connectorActive,
}: {
  active: boolean; title: string; meta: string; desc: string; last?: boolean; connectorActive?: boolean;
}) {
  return (
    <div className="relative pb-5 last:pb-0">
      {!last && (
        <span
          className={cn(
            "absolute left-[-15px] top-4 w-0.5 h-full",
            connectorActive ? "bg-primary" : "bg-border"
          )}
        />
      )}
      <span
        className={cn(
          "absolute left-[-21px] top-1 w-3.5 h-3.5 rounded-full border-2",
          active ? "bg-primary border-primary" : "bg-card border-border"
        )}
      />
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{meta}</p>
      <p className="text-xs text-muted-foreground/80 mt-0.5">{desc}</p>
    </div>
  );
}
