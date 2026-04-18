import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, UserCheck, FileText } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentAvatar } from "@/components/admin/badges";
import {
  students, getApplicationsByStudent, TOTAL_STUDENTS, COMPLETE_PROFILES, APPLIED_AT_LEAST_ONCE,
} from "@/data/adminMockData";
import { cn } from "@/lib/utils";

const FACULTIES = Array.from(new Set(students.map((s) => s.faculty)));

export default function AdminStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [completion, setCompletion] = useState("all");
  const [year, setYear] = useState("all");

  const rows = useMemo(() => {
    let r = [...students];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.program.toLowerCase().includes(q)
      );
    }
    if (faculty !== "all") r = r.filter((s) => s.faculty === faculty);
    if (year !== "all") r = r.filter((s) => String(s.year) === year);
    if (completion === "complete") r = r.filter((s) => s.profileCompletion >= 80);
    if (completion === "incomplete") r = r.filter((s) => s.profileCompletion < 80);
    return r;
  }, [search, faculty, completion, year]);

  const stats = [
    { label: "Total Students", value: TOTAL_STUDENTS, icon: Users, color: "text-edu-blue", bg: "bg-edu-blue-light" },
    { label: "Complete Profiles", value: COMPLETE_PROFILES, icon: UserCheck, color: "text-primary", bg: "bg-edu-green-light" },
    { label: "Applied At Least Once", value: APPLIED_AT_LEAST_ONCE, icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-[1400px] mx-auto animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse student profiles and application history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="p-5 rounded-2xl shadow-sm border-border/60">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-bold mt-2 tabular-nums">{s.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                  <s.icon className={cn("w-5 h-5", s.color)} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-3 rounded-2xl shadow-sm border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or program..."
                className="pl-9 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={faculty} onValueChange={setFaculty}>
              <SelectTrigger className="w-[260px] rounded-xl"><SelectValue placeholder="All Faculties" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                {FACULTIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={completion} onValueChange={setCompletion}>
              <SelectTrigger className="w-[180px] rounded-xl"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="complete">Complete (≥80%)</SelectItem>
                <SelectItem value="incomplete">Incomplete (&lt;80%)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[140px] rounded-xl"><SelectValue placeholder="All Years" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {[1,2,3,4,5,6].map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs uppercase tracking-wider">Student</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Program</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Year</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Profile</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Applications</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const apps = getApplicationsByStudent(s.id);
                const forwarded = apps.filter((a) => a.status === "forwarded").length;
                const barColor = s.profileCompletion >= 80 ? "bg-primary" : s.profileCompletion >= 40 ? "bg-edu-amber" : "bg-edu-red";
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <StudentAvatar name={s.fullName} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{s.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-[220px]">{s.program}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[220px]">{s.faculty}</p>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-edu-green-light text-primary">
                        Year {s.year}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{s.level}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${s.profileCompletion}%` }} />
                        </div>
                        <span className="text-xs font-semibold tabular-nums">{s.profileCompletion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-bold">{apps.length}</p>
                      <p className={cn("text-xs", forwarded > 0 ? "text-primary" : "text-muted-foreground")}>
                        {forwarded} forwarded
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-primary/30 text-primary hover:bg-edu-green-light hover:text-primary"
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
