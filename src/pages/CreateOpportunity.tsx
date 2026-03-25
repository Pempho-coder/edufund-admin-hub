import { useState, useMemo, useRef, useEffect } from "react";
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
  CheckCircle2,
  Circle,
  ChevronRight,
  Zap,
  Star,
  Mail,
  Phone,
  LinkIcon,
} from "lucide-react";
import { format } from "date-fns";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  { value: "open", label: "Open", color: "text-emerald-600" },
  { value: "closing_soon", label: "Closing Soon", color: "text-amber-600" },
  { value: "closed", label: "Closed", color: "text-red-500" },
  { value: "limited", label: "Limited", color: "text-blue-500" },
  { value: "restricted", label: "Restricted", color: "text-purple-500" },
];

const STEPS = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "personal", label: "Personal", icon: Users },
  { id: "funding", label: "Funding", icon: Wallet },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "method", label: "Method", icon: Globe },
  { id: "controls", label: "Controls", icon: ShieldCheck },
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
  const [activeSection, setActiveSection] = useState("basic");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setData = <K extends keyof OpportunityForm>(key: K, value: OpportunityForm[K]) => {
    setDataState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: keyof OpportunityForm, value: string) => {
    const arr = data[key] as string[];
    setData(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] as any);
  };

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

  // Completion progress
  const completionProgress = useMemo(() => {
    let filled = 0;
    let total = 7;
    if (data.title) filled++;
    if (data.organization) filled++;
    if (data.category) filled++;
    if (data.description) filled++;
    if (data.deadline) filled++;
    if (data.application_method) filled++;
    if (data.status) filled++;
    return Math.round((filled / total) * 100);
  }, [data]);

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast({ title: "Opportunity created", description: `"${data.title}" has been created successfully.` });
      navigate("/opportunities");
    }, 800);
  };

  const fieldError = (key: keyof OpportunityForm) =>
    errors[key] ? <p className="text-sm text-destructive mt-1">{errors[key]}</p> : null;

  // ─── Section Card ────────────────────────────────────────────────────

  const SectionCard = ({
    id,
    icon: Icon,
    title,
    description,
    badge,
    children,
  }: {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    badge?: string;
    children: React.ReactNode;
  }) => (
    <div
      id={id}
      ref={(el) => { sectionRefs.current[id] = el; }}
      className="scroll-mt-6"
    >
      <div className="group relative rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3.5 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shrink-0 ring-1 ring-primary/10">
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h3>
                {badge && (
                  <Badge className="text-[10px] px-2 py-0.5 font-medium bg-primary/10 text-primary border-0 rounded-md">
                    <Zap className="w-2.5 h-2.5 mr-0.5" />
                    {badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
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
    <div className={cn(
      "grid gap-1.5",
      columns === 3 ? "sm:grid-cols-3" : columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2"
    )}>
      {items.map((item) => {
        const value = typeof item === "string" ? item : item.value;
        const label = typeof item === "string" ? item : item.label;
        const isActive = selected.includes(value);
        return (
          <label
            key={value}
            className={cn(
              "group/item flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-all duration-200 text-sm",
              isActive
                ? "border-primary/30 bg-primary/[0.06] text-foreground shadow-sm shadow-primary/5"
                : "border-border/40 hover:border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            <Checkbox
              checked={isActive}
              onCheckedChange={() => onToggle(value)}
              className={cn(
                "transition-all duration-200",
                isActive && "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              )}
            />
            <span className="leading-tight text-[13px]">{label}</span>
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
          {/* ── Header ──────────────────────────────────────── */}
          <div className="border-b border-border/40 bg-card/80 backdrop-blur-sm px-4 lg:px-6 py-4 sticky top-0 z-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-lg hover:bg-muted/80"
                  onClick={() => navigate("/opportunities")}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-foreground tracking-tight">Create Opportunity</h1>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                      New
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fields marked with <span className="text-destructive font-medium">*</span> are required
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Progress indicator */}
                <div className="hidden sm:flex items-center gap-2 mr-3">
                  <span className="text-[11px] font-medium text-muted-foreground">{completionProgress}%</span>
                  <div className="w-20">
                    <Progress value={completionProgress} className="h-1.5" />
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => navigate("/opportunities")}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={processing} className="gap-1.5 rounded-lg shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <Save className="w-3.5 h-3.5" />
                  {processing ? "Saving…" : "Save Opportunity"}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Form body with sidebar navigation ─────────── */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-5xl mx-auto flex gap-6 p-4 lg:p-6">
              {/* Left: Step navigation (desktop only) */}
              <nav className="hidden xl:block w-48 shrink-0">
                <div className="sticky top-24 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Sections</p>
                  {STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = activeSection === step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => scrollToSection(step.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <StepIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{step.label}</span>
                        {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                      </button>
                    );
                  })}

                  <Separator className="my-3" />
                  
                  <div className="px-2 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Completion</p>
                    <Progress value={completionProgress} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">{completionProgress}% filled</p>
                  </div>
                </div>
              </nav>

              {/* Right: Form sections */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* Smart Matching banner */}
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-transparent px-5 py-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <div className="flex items-start gap-3 relative">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Smart Matching Enabled</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Eligibility fields power automatic recommendations. The more criteria you specify, the more accurate the student matching.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Section 1: Basic Info ──────────────────── */}
                <SectionCard id="basic" icon={FileText} title="Basic Information" description="Core details about the funding opportunity.">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Opportunity Title <span className="text-destructive">*</span></Label>
                        <Input value={data.title} onChange={(e) => setData("title", e.target.value)} placeholder="e.g. Mastercard Foundation Scholars Program" className="h-10 text-sm rounded-lg" />
                        {fieldError("title")}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Organization <span className="text-destructive">*</span></Label>
                        <Input value={data.organization} onChange={(e) => setData("organization", e.target.value)} placeholder="e.g. Mastercard Foundation" className="h-10 text-sm rounded-lg" />
                        {fieldError("organization")}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Category <span className="text-destructive">*</span></Label>
                        <Select value={data.category} onValueChange={(v) => setData("category", v)}>
                          <SelectTrigger className="h-10 text-sm rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {fieldError("category")}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Amount</Label>
                        <Input value={data.amount} onChange={(e) => setData("amount", e.target.value)} placeholder="e.g. MWK 2,500,000 or Full Coverage" className="h-10 text-sm rounded-lg" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Opening Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full h-10 justify-start text-left text-sm font-normal rounded-lg", !openingDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
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
                            <Button variant="outline" className={cn("w-full h-10 justify-start text-left text-sm font-normal rounded-lg", !deadlineDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
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
                      <Textarea value={data.description} onChange={(e) => setData("description", e.target.value)} placeholder="Describe the funding opportunity, its purpose, and what it covers…" rows={4} className="text-sm resize-none rounded-lg" />
                      {fieldError("description")}
                    </div>
                  </div>
                </SectionCard>

                {/* ── Section 2: Academic Eligibility ──────── */}
                <SectionCard id="academic" icon={GraduationCap} title="Academic Eligibility" description="Define which students qualify based on their academic profile." badge="Matching">
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-semibold">Eligible Faculties</Label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Leave empty to allow all faculties.</p>
                        </div>
                        <Button
                          type="button"
                          variant={data.eligible_faculties.length === FACULTY_NAMES.length ? "secondary" : "outline"}
                          size="sm"
                          className="h-7 text-xs rounded-md gap-1"
                          onClick={handleSelectAllFaculties}
                        >
                          {data.eligible_faculties.length === FACULTY_NAMES.length ? (
                            <><CheckCircle2 className="w-3 h-3" /> Deselect All</>
                          ) : (
                            <><Circle className="w-3 h-3" /> Select All</>
                          )}
                        </Button>
                      </div>
                      <CheckboxGroup
                        items={FACULTY_NAMES}
                        selected={data.eligible_faculties}
                        onToggle={handleFacultyToggle}
                        columns={2}
                      />
                    </div>

                    <Separator className="bg-border/40" />

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-semibold">Eligible Programs</Label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {data.eligible_faculties.length > 0
                              ? `Showing programs from ${data.eligible_faculties.length} selected ${data.eligible_faculties.length === 1 ? "faculty" : "faculties"}.`
                              : "Select faculties first or leave empty to allow all programs."}
                          </p>
                        </div>
                        {availablePrograms.length > 0 && (
                          <Button
                            type="button"
                            variant={data.eligible_programs.length === availablePrograms.length ? "secondary" : "outline"}
                            size="sm"
                            className="h-7 text-xs rounded-md gap-1"
                            onClick={handleSelectAllPrograms}
                          >
                            {data.eligible_programs.length === availablePrograms.length ? (
                              <><CheckCircle2 className="w-3 h-3" /> Deselect All</>
                            ) : (
                              <><Circle className="w-3 h-3" /> Select All</>
                            )}
                          </Button>
                        )}
                      </div>
                      {availablePrograms.length > 0 && (
                        <div className="max-h-56 overflow-y-auto rounded-lg border border-border/30 p-3 bg-muted/20">
                          <CheckboxGroup
                            items={availablePrograms}
                            selected={data.eligible_programs}
                            onToggle={(v) => toggleArrayValue("eligible_programs", v)}
                            columns={2}
                          />
                        </div>
                      )}
                    </div>

                    <Separator className="bg-border/40" />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <Label className="text-xs font-semibold">Eligible Levels of Study</Label>
                        <p className="text-[11px] text-muted-foreground -mt-1">Leave empty to allow all levels.</p>
                        <CheckboxGroup items={LEVELS} selected={data.eligible_levels} onToggle={(v) => toggleArrayValue("eligible_levels", v)} columns={2} />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-xs font-semibold">Eligible Learning Modes</Label>
                        <p className="text-[11px] text-muted-foreground -mt-1">Leave empty to allow all modes.</p>
                        <CheckboxGroup items={LEARNING_MODES} selected={data.eligible_learning_modes} onToggle={(v) => toggleArrayValue("eligible_learning_modes", v)} columns={2} />
                      </div>
                    </div>

                    <div className="space-y-1.5 max-w-xs">
                      <Label className="text-xs font-semibold">Minimum Average Score (%)</Label>
                      <p className="text-[11px] text-muted-foreground -mt-0.5">Used for recommendation ranking. Leave empty for no minimum.</p>
                      <Input type="number" min="0" max="100" value={data.min_average_score} onChange={(e) => setData("min_average_score", e.target.value)} placeholder="e.g. 60" className="h-10 text-sm w-32 rounded-lg" />
                    </div>
                  </div>
                </SectionCard>

                {/* ── Section 3: Personal & Financial ──────── */}
                <SectionCard id="personal" icon={Users} title="Personal & Financial Eligibility" description="Filter by gender, nationality, and financial background." badge="Matching">
                  <div className="space-y-5">
                    <div className="space-y-1.5 max-w-xs">
                      <Label className="text-xs font-semibold">Eligible Gender</Label>
                      <Select value={data.eligible_gender} onValueChange={(v) => setData("eligible_gender", v)}>
                        <SelectTrigger className="h-10 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-xs font-semibold">Eligible Nationalities</Label>
                      <p className="text-[11px] text-muted-foreground -mt-1">Leave empty to allow all nationalities.</p>
                      <CheckboxGroup items={NATIONALITIES} selected={data.eligible_nationalities} onToggle={(v) => toggleArrayValue("eligible_nationalities", v)} columns={3} />
                    </div>

                    <Separator className="bg-border/40" />

                    <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
                      <div className="flex items-start gap-3">
                        <Switch checked={data.requires_financial_need} onCheckedChange={(v) => setData("requires_financial_need", v)} className="mt-0.5" />
                        <div>
                          <Label className="text-sm font-medium cursor-pointer">Requires Financial Need</Label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Only match students who have indicated financial need in their profile.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* ── Section 4: Funding Coverage & Tags ───── */}
                <SectionCard id="funding" icon={Wallet} title="Funding Coverage & Matching Signals" description="Specify what the funding covers and add tags for smarter recommendations." badge="Matching">
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <Label className="text-xs font-semibold">Funding Coverage</Label>
                      <p className="text-[11px] text-muted-foreground -mt-1">Select all areas this opportunity covers. Used to match against student funding needs.</p>
                      <CheckboxGroup items={FUNDING_COVERAGE} selected={data.funding_coverage} onToggle={(v) => toggleArrayValue("funding_coverage", v)} columns={3} />
                    </div>

                    <Separator className="bg-border/40" />

                    <div className="space-y-2.5">
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
                                "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border",
                                active
                                  ? "bg-primary/10 border-primary/25 text-primary shadow-sm shadow-primary/10"
                                  : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/50"
                              )}
                            >
                              {active && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* ── Additional Notes ─────────────────────── */}
                <SectionCard id="notes" icon={FileText} title="Additional Notes" description="Any extra conditions or notes for this opportunity.">
                  <Textarea
                    value={data.additional_notes}
                    onChange={(e) => setData("additional_notes", e.target.value)}
                    placeholder="Any extra conditions or notes for this opportunity…"
                    rows={4}
                    className="text-sm resize-none rounded-lg"
                  />
                </SectionCard>

                {/* ── Section 6: Application Method ────────── */}
                <SectionCard id="method" icon={Globe} title="Application Method" description="How students will submit their applications.">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Application Method <span className="text-destructive">*</span></Label>
                        <Select value={data.application_method} onValueChange={(v) => setData("application_method", v)}>
                          <SelectTrigger className="h-10 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {APP_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      {data.application_method === "External Link" && (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Application Link</Label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input value={data.application_link} onChange={(e) => setData("application_link", e.target.value)} placeholder="https://..." className="h-10 text-sm pl-9 rounded-lg" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Contact Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input type="email" value={data.contact_email} onChange={(e) => setData("contact_email", e.target.value)} placeholder="funding@mzuni.ac.mw" className="h-10 text-sm pl-9 rounded-lg" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Contact Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input type="tel" value={data.contact_phone} onChange={(e) => setData("contact_phone", e.target.value)} placeholder="+265 1 123 456" className="h-10 text-sm pl-9 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* ── Section 7: Admin Controls ────────────── */}
                <SectionCard id="controls" icon={ShieldCheck} title="Admin Controls" description="Set visibility and promotion options.">
                  <div className="space-y-5">
                    <div className="space-y-1.5 max-w-xs">
                      <Label className="text-xs font-semibold">Status</Label>
                      <Select value={data.status} onValueChange={(v) => setData("status", v)}>
                        <SelectTrigger className="h-10 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg border border-border/40 bg-gradient-to-r from-amber-500/[0.04] to-transparent p-4">
                      <div className="flex items-start gap-3">
                        <Switch checked={data.featured} onCheckedChange={(v) => setData("featured", v)} className="mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Label className="text-sm font-medium cursor-pointer">Featured Opportunity</Label>
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Featured opportunities appear prominently on the student dashboard.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* ── Sticky Footer ────────────────────────── */}
                <div className="sticky bottom-0 bg-background/90 backdrop-blur-md border-t border-border/40 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 rounded-t-xl shadow-lg shadow-background/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5" />
                    <span>All changes are saved when you click Save.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => navigate("/opportunities")}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={processing} className="gap-1.5 rounded-lg shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 transition-all">
                      <Save className="w-3.5 h-3.5" />
                      {processing ? "Saving…" : "Save Opportunity"}
                    </Button>
                  </div>
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
