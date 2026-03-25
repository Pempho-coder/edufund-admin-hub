import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Sparkles,
  GraduationCap,
  Users,
  Wallet,
  FileText,
  Globe,
  ShieldCheck,
  Info,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Scholarship",
  "Bursary",
  "Loan",
  "Grant",
  "Corporate Sponsorship",
] as const;

const FACULTIES: Record<string, string[]> = {
  "Faculty of Science, Technology and Innovation": [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Mathematics",
    "Bachelor of Science in Physics",
    "Bachelor of Science in Biology",
    "Bachelor of Science in Chemistry",
    "Bachelor of Science in Environmental Science",
    "Bachelor of Science in Statistics",
  ],
  "Faculty of Education": [
    "Bachelor of Education in Science",
    "Bachelor of Education in Humanities",
    "Bachelor of Education in Languages",
    "Bachelor of Education in Social Studies",
    "Bachelor of Arts in Education",
    "Diploma in Primary Education",
  ],
  "Faculty of Health Sciences": [
    "Bachelor of Science in Nursing and Midwifery",
    "Bachelor of Science in Biomedical Sciences",
    "Bachelor of Science in Public Health",
    "Bachelor of Pharmacy",
    "Diploma in Clinical Medicine",
  ],
  "Faculty of Humanities and Social Sciences": [
    "Bachelor of Arts in Media and Communication",
    "Bachelor of Social Science",
    "Bachelor of Arts in History",
    "Bachelor of Arts in Theology and Religious Studies",
    "Bachelor of Arts in English",
    "Bachelor of Arts in French",
  ],
  "Faculty of Environmental Sciences": [
    "Bachelor of Science in Forestry",
    "Bachelor of Science in Fisheries and Aquatic Sciences",
    "Bachelor of Science in Land Management",
    "Bachelor of Science in Water Resources Management",
    "Bachelor of Science in Geography",
  ],
  "Faculty of Tourism, Hospitality and Commerce": [
    "Bachelor of Commerce (Accountancy)",
    "Bachelor of Commerce (Marketing)",
    "Bachelor of Commerce (Finance)",
    "Bachelor of Business Administration",
    "Bachelor of Arts in Tourism and Hospitality Management",
    "Diploma in Tourism and Hospitality Management",
  ],
};

const FACULTY_NAMES = Object.keys(FACULTIES);

const LEVELS = [
  "Certificate",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "Masters",
  "PhD",
];

const LEARNING_MODES = ["Generic", "ODeL", "Upgrading", "Weekend"];

const GENDERS = ["All", "Male", "Female"];

const NATIONALITIES = [
  "Malawian",
  "Kenyan",
  "Tanzanian",
  "Zambian",
  "Zimbabwean",
  "Mozambican",
  "South African",
  "Nigerian",
  "Ghanaian",
  "Ugandan",
  "Other",
];

const FUNDING_COVERAGE = [
  "Tuition",
  "Accommodation",
  "Upkeep",
  "Laptop",
  "Books / Learning Materials",
  "Transport",
  "Research Support",
];

const TAGS = [
  "Women in STEM",
  "Entrepreneurship",
  "Leadership",
  "Disability Support",
  "Research",
  "Innovation",
  "Tech",
  "Rural Students",
  "Academic Merit",
  "Financial Need",
];

const APP_METHODS = [
  "Internal Application",
  "External Link",
  "Email Submission",
  "Physical Submission",
  "University Administration",
];

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "closed", label: "Closed" },
  { value: "limited", label: "Limited" },
  { value: "restricted", label: "Restricted" },
];

// ─── Type ────────────────────────────────────────────────────────────────────

type OpportunityForm = {
  title: string;
  organization: string;
  category: string;
  description: string;
  amount: string;
  opening_date: string;
  deadline: string;
  eligible_faculties: string[];
  eligible_programs: string[];
  eligible_levels: string[];
  eligible_learning_modes: string[];
  eligible_gender: string;
  eligible_nationalities: string[];
  min_average_score: string;
  requires_financial_need: boolean;
  funding_coverage: string[];
  tags: string[];
  additional_notes: string;
  application_method: string;
  application_link: string;
  contact_email: string;
  contact_phone: string;
  featured: boolean;
  status: string;
};

const initialData: OpportunityForm = {
  title: "",
  organization: "",
  category: "",
  description: "",
  amount: "",
  opening_date: "",
  deadline: "",
  eligible_faculties: [],
  eligible_programs: [],
  eligible_levels: [],
  eligible_learning_modes: [],
  eligible_gender: "All",
  eligible_nationalities: [],
  min_average_score: "",
  requires_financial_need: false,
  funding_coverage: [],
  tags: [],
  additional_notes: "",
  application_method: "Internal Application",
  application_link: "",
  contact_email: "",
  contact_phone: "",
  featured: false,
  status: "open",
};

// ─── Component ───────────────────────────────────────────────────────────────

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setDataState] = useState<OpportunityForm>(initialData);
  const [processing, setProcessing] = useState(false);
  const [errors] = useState<Partial<Record<keyof OpportunityForm, string>>>({});
  const [openingDate, setOpeningDate] = useState<Date | undefined>();
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>();

  // Simulates Inertia's setData
  const setData = <K extends keyof OpportunityForm>(key: K, value: OpportunityForm[K]) => {
    setDataState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: keyof OpportunityForm, value: string) => {
    const arr = data[key] as string[];
    setData(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] as any);
  };

  // When faculties change, reset programs that no longer belong
  const availablePrograms = useMemo(() => {
    if (data.eligible_faculties.length === 0) {
      return Object.values(FACULTIES).flat();
    }
    return data.eligible_faculties.flatMap((f) => FACULTIES[f] || []);
  }, [data.eligible_faculties]);

  const handleFacultyToggle = (faculty: string) => {
    const newFaculties = data.eligible_faculties.includes(faculty)
      ? data.eligible_faculties.filter((f) => f !== faculty)
      : [...data.eligible_faculties, faculty];

    const validPrograms = newFaculties.length === 0
      ? data.eligible_programs
      : data.eligible_programs.filter((p) =>
          newFaculties.some((f) => (FACULTIES[f] || []).includes(p))
        );

    setDataState((prev) => ({
      ...prev,
      eligible_faculties: newFaculties,
      eligible_programs: validPrograms,
    }));
  };

  const handleSelectAllFaculties = () => {
    const allSelected = data.eligible_faculties.length === FACULTY_NAMES.length;
    setDataState((prev) => ({
      ...prev,
      eligible_faculties: allSelected ? [] : [...FACULTY_NAMES],
      eligible_programs: allSelected ? [] : prev.eligible_programs,
    }));
  };

  const handleSelectAllPrograms = () => {
    const allSelected = data.eligible_programs.length === availablePrograms.length;
    setData("eligible_programs", allSelected ? [] : [...availablePrograms] as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate Inertia post()
    setTimeout(() => {
      setProcessing(false);
      toast({ title: "Opportunity created", description: `"${data.title}" has been created successfully.` });
      navigate("/opportunities");
    }, 800);
  };

  const fieldError = (key: keyof OpportunityForm) =>
    errors[key] ? <p className="text-sm text-destructive mt-1">{errors[key]}</p> : null;

  // ─── Section helper ──────────────────────────────────────────────────

  const SectionCard = ({
    icon: Icon,
    title,
    description,
    badge,
    children,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    badge?: string;
    children: React.ReactNode;
  }) => (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {badge && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal border-primary/30 text-primary">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );

  // ─── Checkbox group ──────────────────────────────────────────────────

  const CheckboxGroup = ({
    items,
    selected,
    onToggle,
    columns = 2,
  }: {
    items: string[] | { value: string; label: string }[];
    selected: string[];
    onToggle: (v: string) => void;
    columns?: number;
  }) => (
    <div className={cn("grid gap-2", columns === 3 ? "sm:grid-cols-3" : columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2")}>
      {items.map((item) => {
        const value = typeof item === "string" ? item : item.value;
        const label = typeof item === "string" ? item : item.label;
        return (
          <label
            key={value}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-all text-sm",
              selected.includes(value)
                ? "border-primary/40 bg-primary/5 text-foreground"
                : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Checkbox
              checked={selected.includes(value)}
              onCheckedChange={() => onToggle(value)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="leading-tight">{label}</span>
          </label>
        );
      })}
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────

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

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border/60 bg-card px-4 lg:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => navigate("/opportunities")}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight">Create Opportunity</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add a new funding opportunity. Fields marked with <span className="text-destructive">*</span> are required.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <Button type="button" variant="outline" size="sm" onClick={() => navigate("/opportunities")}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={processing} className="gap-1.5 shadow-sm shadow-primary/20">
                  <Save className="w-3.5 h-3.5" />
                  {processing ? "Saving…" : "Save Opportunity"}
                </Button>
              </div>
            </div>
          </div>

          {/* Form body */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-5">
              {/* Matching info banner */}
              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-xs text-foreground/80">
                  <span className="font-semibold text-foreground">Smart Matching Enabled.</span>{" "}
                  Eligibility fields are used to automatically match and recommend this opportunity to qualifying students. The more criteria you specify, the more accurate the recommendations.
                </div>
              </div>

              {/* ── Section 1: Basic Info ──────────────────────────────────── */}
              <SectionCard icon={FileText} title="Basic Information" description="Core details about the funding opportunity.">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Opportunity Title <span className="text-destructive">*</span></Label>
                      <Input value={data.title} onChange={(e) => setData("title", e.target.value)} placeholder="e.g. Mastercard Foundation Scholars Program" className="h-9 text-sm" />
                      {fieldError("title")}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Organization <span className="text-destructive">*</span></Label>
                      <Input value={data.organization} onChange={(e) => setData("organization", e.target.value)} placeholder="e.g. Mastercard Foundation" className="h-9 text-sm" />
                      {fieldError("organization")}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Category <span className="text-destructive">*</span></Label>
                      <Select value={data.category} onValueChange={(v) => setData("category", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {fieldError("category")}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Amount</Label>
                      <Input value={data.amount} onChange={(e) => setData("amount", e.target.value)} placeholder="e.g. MWK 2,500,000 or Full Coverage" className="h-9 text-sm" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Opening Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-9 justify-start text-left text-sm font-normal", !openingDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                            {openingDate ? format(openingDate, "PPP") : "Select opening date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={openingDate}
                            onSelect={(d) => { setOpeningDate(d); if (d) setData("opening_date", format(d, "yyyy-MM-dd")); }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Deadline <span className="text-destructive">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-9 justify-start text-left text-sm font-normal", !deadlineDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                            {deadlineDate ? format(deadlineDate, "PPP") : "Select deadline"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={deadlineDate}
                            onSelect={(d) => { setDeadlineDate(d); if (d) setData("deadline", format(d, "yyyy-MM-dd")); }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldError("deadline")}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Description <span className="text-destructive">*</span></Label>
                    <Textarea value={data.description} onChange={(e) => setData("description", e.target.value)} placeholder="Describe the funding opportunity, its purpose, and what it covers…" rows={4} className="text-sm resize-none" />
                    {fieldError("description")}
                  </div>
                </div>
              </SectionCard>

              {/* ── Section 2: Academic Eligibility ────────────────────────── */}
              <SectionCard icon={GraduationCap} title="Academic Eligibility" description="Define which students qualify based on their academic profile." badge="Matching">
                <div className="space-y-5">
                   {/* Faculties */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs font-semibold">Eligible Faculties</Label>
                        <p className="text-[11px] text-muted-foreground">Leave empty to allow all faculties.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={handleSelectAllFaculties}>
                        {data.eligible_faculties.length === FACULTY_NAMES.length ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                    <CheckboxGroup
                      items={FACULTY_NAMES}
                      selected={data.eligible_faculties}
                      onToggle={handleFacultyToggle}
                      columns={2}
                    />
                  </div>

                  <Separator />

                  {/* Programs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs font-semibold">Eligible Programs</Label>
                        <p className="text-[11px] text-muted-foreground">
                          {data.eligible_faculties.length > 0
                            ? `Showing programs from ${data.eligible_faculties.length} selected ${data.eligible_faculties.length === 1 ? "faculty" : "faculties"}.`
                            : "Select faculties first or leave empty to allow all programs."}
                        </p>
                      </div>
                      {availablePrograms.length > 0 && (
                        <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={handleSelectAllPrograms}>
                          {data.eligible_programs.length === availablePrograms.length ? "Deselect All" : "Select All"}
                        </Button>
                      )}
                    </div>
                    {availablePrograms.length > 0 && (
                      <div className="max-h-56 overflow-y-auto rounded-lg border border-border/40 p-3">
                        <CheckboxGroup
                          items={availablePrograms}
                          selected={data.eligible_programs}
                          onToggle={(v) => toggleArrayValue("eligible_programs", v)}
                          columns={2}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Levels */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Eligible Levels of Study</Label>
                      <p className="text-[11px] text-muted-foreground -mt-1">Leave empty to allow all levels.</p>
                      <CheckboxGroup items={LEVELS} selected={data.eligible_levels} onToggle={(v) => toggleArrayValue("eligible_levels", v)} columns={2} />
                    </div>

                    {/* Learning Modes */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Eligible Learning Modes</Label>
                      <p className="text-[11px] text-muted-foreground -mt-1">Leave empty to allow all modes.</p>
                      <CheckboxGroup items={LEARNING_MODES} selected={data.eligible_learning_modes} onToggle={(v) => toggleArrayValue("eligible_learning_modes", v)} columns={2} />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <Label className="text-xs font-semibold">Minimum Average Score (%)</Label>
                    <p className="text-[11px] text-muted-foreground -mt-0.5">Used for recommendation ranking. Leave empty for no minimum.</p>
                    <Input type="number" min="0" max="100" value={data.min_average_score} onChange={(e) => setData("min_average_score", e.target.value)} placeholder="e.g. 60" className="h-9 text-sm w-32" />
                  </div>
                </div>
              </SectionCard>

              {/* ── Section 3: Personal & Financial ────────────────────────── */}
              <SectionCard icon={Users} title="Personal & Financial Eligibility" description="Filter by gender, nationality, and financial background." badge="Matching">
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Eligible Gender</Label>
                      <Select value={data.eligible_gender} onValueChange={(v) => setData("eligible_gender", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Eligible Nationalities</Label>
                    <p className="text-[11px] text-muted-foreground -mt-1">Leave empty to allow all nationalities.</p>
                    <CheckboxGroup items={NATIONALITIES} selected={data.eligible_nationalities} onToggle={(v) => toggleArrayValue("eligible_nationalities", v)} columns={3} />
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <Switch checked={data.requires_financial_need} onCheckedChange={(v) => setData("requires_financial_need", v)} className="mt-0.5" />
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">Requires Financial Need</Label>
                        <p className="text-[11px] text-muted-foreground">Only match students who have indicated financial need in their profile.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── Section 4: Funding Coverage & Tags ─────────────────────── */}
              <SectionCard icon={Wallet} title="Funding Coverage & Matching Signals" description="Specify what the funding covers and add tags for smarter recommendations." badge="Matching">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Funding Coverage</Label>
                    <p className="text-[11px] text-muted-foreground -mt-1">Select all areas this opportunity covers. Used to match against student funding needs.</p>
                    <CheckboxGroup items={FUNDING_COVERAGE} selected={data.funding_coverage} onToggle={(v) => toggleArrayValue("funding_coverage", v)} columns={3} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Tags</Label>
                    <p className="text-[11px] text-muted-foreground -mt-1">Tags improve recommendation ranking by matching student interests.</p>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag) => {
                        const active = data.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleArrayValue("tags", tag)}
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
                              active
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── Additional Notes ──────────────────────────────────── */}
              <SectionCard icon={FileText} title="Additional Notes" description="Any extra conditions or notes for this opportunity.">
                <div className="space-y-1.5">
                  <Textarea
                    value={data.additional_notes}
                    onChange={(e) => setData("additional_notes", e.target.value)}
                    placeholder="Any extra conditions or notes for this opportunity…"
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>
              </SectionCard>

              {/* ── Section 6: Application Method ──────────────────────────── */}
              <SectionCard icon={Globe} title="Application Method" description="How students will submit their applications.">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Application Method <span className="text-destructive">*</span></Label>
                      <Select value={data.application_method} onValueChange={(v) => setData("application_method", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {APP_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {(data.application_method === "External Link") && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Application Link</Label>
                        <Input value={data.application_link} onChange={(e) => setData("application_link", e.target.value)} placeholder="https://..." className="h-9 text-sm" />
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Contact Email</Label>
                      <Input type="email" value={data.contact_email} onChange={(e) => setData("contact_email", e.target.value)} placeholder="funding@mzuni.ac.mw" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Contact Phone</Label>
                      <Input type="tel" value={data.contact_phone} onChange={(e) => setData("contact_phone", e.target.value)} placeholder="+265 1 123 456" className="h-9 text-sm" />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── Section 7: Admin Controls ──────────────────────────────── */}
              <SectionCard icon={ShieldCheck} title="Admin Controls" description="Set visibility, verification status, and promotion.">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Status</Label>
                    <Select value={data.status} onValueChange={(v) => setData("status", v)}>
                      <SelectTrigger className="h-9 text-sm max-w-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start gap-3">
                    <Switch checked={data.featured} onCheckedChange={(v) => setData("featured", v)} className="mt-0.5" />
                    <div>
                      <Label className="text-sm font-medium cursor-pointer">Featured Opportunity</Label>
                      <p className="text-[11px] text-muted-foreground">Featured opportunities appear prominently on the student dashboard.</p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── Sticky Footer ─────────────────────────────────────────── */}
              <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border/60 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 rounded-t-lg">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="w-3.5 h-3.5" />
                  <span>All changes are saved when you click Save.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => navigate("/opportunities")}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={processing} className="gap-1.5 shadow-sm shadow-primary/20">
                    <Save className="w-3.5 h-3.5" />
                    {processing ? "Saving…" : "Save Opportunity"}
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;
