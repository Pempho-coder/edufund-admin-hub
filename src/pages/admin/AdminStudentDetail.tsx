import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, FileText } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StudentAvatar, MatchBadge, StatusBadge, CategoryBadge } from "@/components/admin/badges";
import { getStudent, getApplicationsByStudent } from "@/data/adminMockData";
import { useAdminStore } from "@/hooks/useAdminStore";
import { cn } from "@/lib/utils";

export default function AdminStudentDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  useAdminStore();
  const student = getStudent(id);

  const [tab, setTab] = useState("profile");

  if (!student) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Student not found</p>
          <Button onClick={() => navigate("/admin/students")} className="mt-4 rounded-xl">
            Back to Students
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const apps = getApplicationsByStudent(student.id);
  const forwarded = apps.filter((a) => a.status === "forwarded").length;
  const avgMatch = apps.length ? Math.round(apps.reduce((sum, a) => sum + a.matchScore, 0) / apps.length) : 0;
  const ringStroke = (student.profileCompletion / 100) * 251.2;

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto animate-fade-in-up space-y-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/admin/students" className="flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Students
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">{student.fullName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
          {/* LEFT */}
          <div className="space-y-5 min-w-0">
            <Card className="rounded-2xl shadow-sm border-border/60 p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <StudentAvatar name={student.fullName} size={72} />
                <div className="flex-1 min-w-0">
                  <h1 className="text-[24px] font-bold leading-tight">{student.fullName}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{student.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{student.phone}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-edu-blue-light text-edu-blue">
                      {student.faculty}
                    </span>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-edu-green-light text-primary">
                      Year {student.year}
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-2">Joined {student.joinedAt}</p>
                </div>
              </div>
            </Card>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="rounded-xl bg-muted">
                <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
                <TabsTrigger value="applications" className="rounded-lg">Applications</TabsTrigger>
                <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-5 mt-4">
                <Card className="rounded-2xl shadow-sm border-border/60 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Profile Completion — {student.profileCompletion}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full",
                        student.profileCompletion >= 80 ? "bg-primary" :
                        student.profileCompletion >= 40 ? "bg-edu-amber" : "bg-edu-red"
                      )}
                      style={{ width: `${student.profileCompletion}%` }}
                    />
                  </div>
                  {student.missingFields.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-xs text-muted-foreground mr-1">Missing:</span>
                      {student.missingFields.map((f) => (
                        <span key={f} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-edu-amber-light text-edu-amber">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="rounded-2xl shadow-sm border-border/60 p-6">
                  <Section title="Personal">
                    <Field label="Full Name" v={student.fullName} />
                    <Field label="Email" v={student.email} />
                    <Field label="Phone" v={student.phone} />
                    <Field label="Date of Birth" v={student.dateOfBirth} />
                    <Field label="Gender" v={student.gender} />
                    <Field label="Nationality" v={student.nationality} />
                  </Section>
                  <Section title="Academic">
                    <Field label="Faculty" v={student.faculty} />
                    <Field label="Program" v={student.program} />
                    <Field label="Year" v={String(student.year)} />
                    <Field label="Semester" v={String(student.semester)} />
                    <Field label="Level" v={student.level} />
                    <Field label="Mode" v={student.mode} />
                    <Field label="Avg Score" v={`${student.avgScore}%`} />
                    <Field label="MSCE Points" v={String(student.msceaPoints)} />
                  </Section>
                  <Section title="Financial" last>
                    <Field label="Financial Need" v={student.financialNeed ? "Yes" : "No"} />
                    <Field label="Other Sponsorship" v={student.otherSponsorship ? "Yes" : "No"} />
                  </Section>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-3 mt-4">
                {apps.length === 0 ? (
                  <Card className="p-10 text-center rounded-2xl border-border/60">
                    <p className="text-sm text-muted-foreground">No applications submitted yet.</p>
                  </Card>
                ) : apps.map((a) => (
                  <Card key={a.id} className="p-5 rounded-2xl shadow-sm border-border/60 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{a.opportunityTitle}</p>
                        <p className="text-xs text-muted-foreground">{a.organisation}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <CategoryBadge category={a.category} />
                          <StatusBadge status={a.status} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MatchBadge score={a.matchScore} />
                        <span className="text-xs text-muted-foreground hidden md:block">
                          Submitted {a.submittedAt.split(",")[0]}
                        </span>
                        <Link
                          to={`/admin/applications/${a.id}`}
                          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
                        >
                          View Application →
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card className="rounded-2xl shadow-sm border-border/60 p-6">
                  {apps.flatMap((a) => a.documents).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {apps.flatMap((a) => a.documents).map((d, i) => (
                        <div key={i} className="flex items-center gap-3 py-3">
                          <FileText className="w-5 h-5 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{d.type}</p>
                            <p className="text-xs text-muted-foreground truncate">{d.filename}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{d.uploadedAt}</span>
                          <Button size="sm" variant="outline" className="rounded-xl border-primary/30 text-primary">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24 self-start">
            <Card className="rounded-2xl shadow-md border-border/60 p-6">
              <div className="flex flex-col items-center">
                <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${ringStroke} 251.2`}
                  />
                </svg>
                <div className="-mt-[68px] text-center">
                  <p className="text-2xl font-bold">{student.profileCompletion}%</p>
                </div>
                <p className="mt-9 text-xs text-muted-foreground uppercase tracking-wider">Profile</p>
              </div>
              <div className="divide-y divide-border/60 mt-5 text-sm">
                <Row label="Total Applications" value={String(apps.length)} />
                <Row label="Forwarded" value={String(forwarded)} />
                <Row label="Avg Match Score" value={`${avgMatch}%`} />
                <Row label="Last Active" value={student.lastActive} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn("py-4", !last && "border-b border-border/60")}>
      <p className="text-[11px] uppercase font-semibold tracking-wider text-muted-foreground mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}
function Field({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="font-medium flex-1 min-w-0">{v}</span>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
