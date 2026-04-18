// Centralised mock data + tiny in-memory store for the admin pages.
// Mutations (markAsViewed / markAsForwarded) persist for the lifetime of the
// browser tab and notify subscribers so screens re-render.

export type ApplicationStatus = "submitted" | "under_review" | "forwarded";
export type Category = "scholarship" | "bursary" | "grant" | "loan" | "sponsorship";

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  nationality: string;
  faculty: string;
  program: string;
  year: number;
  semester: number;
  level: string;
  mode: string;
  avgScore: number;
  scoreVerified: boolean;
  msceaPoints: number;
  financialNeed: boolean;
  otherSponsorship: boolean;
  profileCompletion: number;
  missingFields: string[];
  joinedAt: string;
  lastActive: string;
}

export interface EssayAnswer {
  question: string;
  answer: string;
  wordCount: number;
  maxWords: number;
}

export interface AppDocument {
  type: string;
  filename: string;
  uploadedAt: string;
}

export interface Application {
  id: string;
  code: string;
  studentId: string;
  opportunityTitle: string;
  organisation: string;
  category: Category;
  matchScore: number;
  matchBreakdown: { label: string; matched: boolean }[];
  status: ApplicationStatus;
  submittedAt: string;
  openedAt: string | null;
  forwardedAt: string | null;
  forwardedTo: string | null;
  forwardingNotes: string | null;
  deadline: string;
  essays: EssayAnswer[];
  documents: AppDocument[];
}

// ───── Students ──────────────────────────────────────────────────
export const students: Student[] = [
  {
    id: "s1",
    fullName: "Chisomo Banda",
    email: "chisomo@mzuni.ac.mw",
    phone: "+265 999 000 111",
    dateOfBirth: "12 March 2003",
    gender: "Male",
    nationality: "Malawian",
    faculty: "Faculty of Science, Technology & Innovation",
    program: "BSc Computer Science",
    year: 3,
    semester: 1,
    level: "Degree",
    mode: "Full-time",
    avgScore: 72,
    scoreVerified: false,
    msceaPoints: 22,
    financialNeed: true,
    otherSponsorship: false,
    profileCompletion: 65,
    missingFields: ["Phone", "Date of Birth", "Bio"],
    joinedAt: "08 Sep 2024",
    lastActive: "2 hours ago",
  },
  {
    id: "s2",
    fullName: "Tadala Mwale",
    email: "tadala@mzuni.ac.mw",
    phone: "+265 888 222 333",
    dateOfBirth: "04 July 2004",
    gender: "Female",
    nationality: "Malawian",
    faculty: "Faculty of Business",
    program: "BA Economics",
    year: 2,
    semester: 2,
    level: "Degree",
    mode: "Full-time",
    avgScore: 68,
    scoreVerified: true,
    msceaPoints: 20,
    financialNeed: true,
    otherSponsorship: false,
    profileCompletion: 82,
    missingFields: ["Bio"],
    joinedAt: "12 Oct 2024",
    lastActive: "1 day ago",
  },
  {
    id: "s3",
    fullName: "Limbani Phiri",
    email: "limbani@mzuni.ac.mw",
    phone: "+265 999 444 555",
    dateOfBirth: "22 Jan 2002",
    gender: "Male",
    nationality: "Malawian",
    faculty: "Faculty of Education",
    program: "BEd Primary Education",
    year: 4,
    semester: 1,
    level: "Degree",
    mode: "Full-time",
    avgScore: 64,
    scoreVerified: true,
    msceaPoints: 18,
    financialNeed: false,
    otherSponsorship: true,
    profileCompletion: 45,
    missingFields: ["Phone", "DOB", "Bio", "MSCE Points", "Financial Info"],
    joinedAt: "03 Aug 2024",
    lastActive: "5 days ago",
  },
  {
    id: "s4",
    fullName: "Grace Mkandawire",
    email: "grace@mzuni.ac.mw",
    phone: "+265 999 777 888",
    dateOfBirth: "30 Nov 2005",
    gender: "Female",
    nationality: "Malawian",
    faculty: "Faculty of Health Sciences",
    program: "BSc Nursing",
    year: 1,
    semester: 1,
    level: "Degree",
    mode: "Full-time",
    avgScore: 78,
    scoreVerified: true,
    msceaPoints: 24,
    financialNeed: true,
    otherSponsorship: false,
    profileCompletion: 91,
    missingFields: [],
    joinedAt: "20 Sep 2024",
    lastActive: "Just now",
  },
  {
    id: "s5",
    fullName: "Joseph Gondwe",
    email: "joseph@mzuni.ac.mw",
    phone: "+265 888 555 222",
    dateOfBirth: "18 May 2003",
    gender: "Male",
    nationality: "Malawian",
    faculty: "Faculty of Business",
    program: "BBA Finance",
    year: 3,
    semester: 1,
    level: "Degree",
    mode: "Full-time",
    avgScore: 60,
    scoreVerified: false,
    msceaPoints: 16,
    financialNeed: false,
    otherSponsorship: true,
    profileCompletion: 58,
    missingFields: ["Bio", "DOB", "Avg Score Verification"],
    joinedAt: "01 Sep 2024",
    lastActive: "3 days ago",
  },
];

// Pad students up to 340 for stats — only the 5 above are detailed.
// Pad applications up to 127 for stats — only the 7 below are detailed.

const chisomoEssays: EssayAnswer[] = [
  {
    question: "Why do you deserve this funding opportunity?",
    answer:
      "I am a third-year Computer Science student maintaining a 72% average while supporting my family of five on a teacher's salary. This scholarship would allow me to focus entirely on my studies rather than seeking part-time work to cover accommodation costs. I have demonstrated consistent academic improvement each semester and was recently selected to represent my faculty in the national ICT innovation challenge.",
    wordCount: 218,
    maxWords: 300,
  },
  {
    question: "How will this funding support your academic goals?",
    answer:
      "My goal is to build software solutions that address healthcare data management challenges in Malawi. This funding would remove the financial barriers that currently prevent me from taking on unpaid research projects and internship opportunities that would accelerate my career. With tuition and accommodation covered I could dedicate my final year to building a real-world system in partnership with Mzuzu Central Hospital.",
    wordCount: 156,
    maxWords: 300,
  },
];

const standardDocs = (variant: number): AppDocument[] => [
  { type: "Academic Transcript", filename: `transcript_${variant}.pdf`, uploadedAt: "12 Jan 2025" },
  { type: "National ID", filename: `id_${variant}.pdf`, uploadedAt: "12 Jan 2025" },
  { type: "Proof of Enrolment", filename: `enrolment_${variant}.pdf`, uploadedAt: "12 Jan 2025" },
];

const buildBreakdown = (matched: Record<string, boolean>) => [
  { label: "Faculty", matched: matched.faculty ?? true },
  { label: "Year", matched: matched.year ?? true },
  { label: "Financial Need", matched: matched.need ?? true },
  { label: "Avg Score", matched: matched.score ?? true },
  { label: "Gender", matched: matched.gender ?? true },
  { label: "Nationality", matched: matched.nationality ?? true },
];

// In-memory store
let applications: Application[] = [
  {
    id: "a1",
    code: "APP-0042",
    studentId: "s1",
    opportunityTitle: "Chancellor's Scholarship",
    organisation: "Mzuzu University",
    category: "scholarship",
    matchScore: 88,
    matchBreakdown: buildBreakdown({ nationality: false }),
    status: "forwarded",
    submittedAt: "12 Jan 2025, 09:42 AM",
    openedAt: "13 Jan 2025, 10:15 AM",
    forwardedAt: "15 Jan 2025, 02:20 PM",
    forwardedTo: "scholarships@mzuni.ac.mw",
    forwardingNotes: "Sent via email with cover letter",
    deadline: "20 Jan 2025",
    essays: chisomoEssays,
    documents: standardDocs(1),
  },
  {
    id: "a2",
    code: "APP-0043",
    studentId: "s1",
    opportunityTitle: "MHANGO Bursary",
    organisation: "Mhango Foundation",
    category: "bursary",
    matchScore: 91,
    matchBreakdown: buildBreakdown({}),
    status: "under_review",
    submittedAt: "16 Jan 2025, 11:10 AM",
    openedAt: "18 Jan 2025, 08:55 AM",
    forwardedAt: null,
    forwardedTo: null,
    forwardingNotes: null,
    deadline: "28 Jan 2025",
    essays: [],
    documents: standardDocs(2),
  },
  {
    id: "a3",
    code: "APP-0044",
    studentId: "s1",
    opportunityTitle: "STEM Grant",
    organisation: "TechMalawi Trust",
    category: "grant",
    matchScore: 76,
    matchBreakdown: buildBreakdown({ nationality: false }),
    status: "submitted",
    submittedAt: "19 Jan 2025, 03:24 PM",
    openedAt: null,
    forwardedAt: null,
    forwardedTo: null,
    forwardingNotes: null,
    deadline: "05 Feb 2025",
    essays: [],
    documents: standardDocs(3),
  },
  {
    id: "a4",
    code: "APP-0045",
    studentId: "s2",
    opportunityTitle: "Student Welfare Loan",
    organisation: "UNIMA Welfare Office",
    category: "loan",
    matchScore: 67,
    matchBreakdown: buildBreakdown({ score: false }),
    status: "forwarded",
    submittedAt: "10 Jan 2025, 02:18 PM",
    openedAt: "11 Jan 2025, 09:00 AM",
    forwardedAt: "14 Jan 2025, 04:00 PM",
    forwardedTo: "welfare@unima.mw",
    forwardingNotes: null,
    deadline: "25 Jan 2025",
    essays: [],
    documents: standardDocs(4),
  },
  {
    id: "a5",
    code: "APP-0046",
    studentId: "s2",
    opportunityTitle: "Community Development Grant",
    organisation: "NICE Public Trust",
    category: "grant",
    matchScore: 72,
    matchBreakdown: buildBreakdown({ nationality: true }),
    status: "submitted",
    submittedAt: "20 Jan 2025, 10:05 AM",
    openedAt: null,
    forwardedAt: null,
    forwardedTo: null,
    forwardingNotes: null,
    deadline: "10 Feb 2025",
    essays: [],
    documents: standardDocs(5),
  },
  {
    id: "a6",
    code: "APP-0047",
    studentId: "s4",
    opportunityTitle: "Women in Tech Scholarship",
    organisation: "She Codes Africa",
    category: "scholarship",
    matchScore: 95,
    matchBreakdown: buildBreakdown({}),
    status: "under_review",
    submittedAt: "17 Jan 2025, 01:30 PM",
    openedAt: "18 Jan 2025, 02:00 PM",
    forwardedAt: null,
    forwardedTo: null,
    forwardingNotes: null,
    deadline: "01 Feb 2025",
    essays: [],
    documents: standardDocs(6),
  },
  {
    id: "a7",
    code: "APP-0048",
    studentId: "s5",
    opportunityTitle: "Business Innovation Sponsorship",
    organisation: "Standard Bank",
    category: "sponsorship",
    matchScore: 54,
    matchBreakdown: buildBreakdown({ need: false, score: false }),
    status: "submitted",
    submittedAt: "21 Jan 2025, 09:15 AM",
    openedAt: null,
    forwardedAt: null,
    forwardedTo: null,
    forwardingNotes: null,
    deadline: "15 Feb 2025",
    essays: [],
    documents: standardDocs(7),
  },
];

// Padded counts for stats
export const TOTAL_STUDENTS = 340;
export const TOTAL_APPLICATIONS = 127;
export const TOTAL_OPPORTUNITIES = 48;
export const FORWARDED_COUNT = 38;
export const UNDER_REVIEW_COUNT = 46;
export const AWAITING_REVIEW_COUNT = 43;
export const COMPLETE_PROFILES = 198;
export const APPLIED_AT_LEAST_ONCE = 127;

// ───── Subscribe pattern ─────────────────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ───── Selectors ─────────────────────────────────────────────────
export function getApplications(): Application[] {
  return applications;
}

export function getApplicationById(id: string): Application | undefined {
  return applications.find((a) => a.id === id);
}

export function getApplicationsByStudent(studentId: string): Application[] {
  return applications.filter((a) => a.studentId === studentId);
}

export function getStudent(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function getOpportunityTitles(): string[] {
  return Array.from(new Set(applications.map((a) => a.opportunityTitle)));
}

// ───── Mutations ─────────────────────────────────────────────────
export function markAsViewed(id: string): boolean {
  const app = applications.find((a) => a.id === id);
  if (!app) return false;
  if (app.status === "submitted") {
    applications = applications.map((a) =>
      a.id === id
        ? { ...a, status: "under_review", openedAt: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) }
        : a
    );
    notify();
    return true;
  }
  return false;
}

export function markAsForwarded(
  id: string,
  payload: { forwardedTo: string; forwardedAt: string; forwardingNotes?: string }
): boolean {
  const app = applications.find((a) => a.id === id);
  if (!app || app.status === "forwarded") return false;
  applications = applications.map((a) =>
    a.id === id
      ? {
          ...a,
          status: "forwarded",
          forwardedTo: payload.forwardedTo,
          forwardedAt: payload.forwardedAt,
          forwardingNotes: payload.forwardingNotes ?? null,
        }
      : a
  );
  notify();
  return true;
}

// ───── Reports data ──────────────────────────────────────────────
export const applicationsLast30Days = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  // smooth-ish synthetic curve
  const base = Math.sin(i / 4) * 4 + 8;
  const noise = ((day * 7) % 5) - 2;
  return {
    date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    count: Math.max(1, Math.round(base + noise)),
  };
});

export const topOpportunities = [
  { name: "Chancellor's Scholarship", short: "Chancellor's", count: 34 },
  { name: "MHANGO Bursary", short: "MHANGO Bur.", count: 28 },
  { name: "Women in Tech Scholarship", short: "Women in T.", count: 22 },
  { name: "STEM Grant", short: "STEM Grant", count: 18 },
  { name: "Student Welfare Loan", short: "Welfare Loan", count: 15 },
];

export const matchDistribution = [
  { range: "90-100%", count: 18 },
  { range: "75-89%", count: 47 },
  { range: "50-74%", count: 38 },
  { range: "25-49%", count: 16 },
  { range: "0-24%", count: 8 },
];

export const facultyCoverage = [
  { faculty: "Faculty of Science, Technology & Innovation", students: 92, eligible: 14, ratio: "1 per 7", status: "well" as const },
  { faculty: "Faculty of Business", students: 88, eligible: 11, ratio: "1 per 8", status: "well" as const },
  { faculty: "Faculty of Health Sciences", students: 54, eligible: 6, ratio: "1 per 9", status: "well" as const },
  { faculty: "Faculty of Hospitality", students: 39, eligible: 3, ratio: "1 per 13", status: "limited" as const },
  { faculty: "Faculty of Education", students: 67, eligible: 3, ratio: "1 per 22", status: "underserved" as const },
];

export interface GapInsight {
  id: string;
  severity: "critical" | "high" | "medium";
  title: string;
  description: string;
  detectedAgo: string;
}

export const gapInsights: GapInsight[] = [
  {
    id: "g1",
    severity: "critical",
    title: "23 students match zero open opportunities",
    description:
      "23 registered students currently match no open opportunities with a score above 50%. These students receive no recommendations and cannot be guided to suitable funding. Most affected faculties: Faculty of Education (12 students), Faculty of Business (7 students). Recommended action: Add opportunities targeting these faculties or broaden eligibility criteria on existing ones.",
    detectedAgo: "2 hours ago",
  },
  {
    id: "g2",
    severity: "high",
    title: "Faculty of Education is severely underserved",
    description:
      "67 students in the Faculty of Education have access to only 3 open opportunities — a ratio of 1 opportunity per 22 students. The platform average is 1 per 7 students. Students in this faculty are significantly disadvantaged in finding suitable funding.",
    detectedAgo: "Today, 06:00 AM",
  },
  {
    id: "g3",
    severity: "high",
    title: "Financial need underrepresented in funding",
    description:
      "61% of registered students have declared financial need, but only 18% of open opportunities prioritise or require it. The most vulnerable students have the fewest options. Consider sourcing bursaries and need-based grants.",
    detectedAgo: "Yesterday",
  },
  {
    id: "g4",
    severity: "medium",
    title: "Year 1 students have very limited options",
    description:
      "Only 2 open opportunities accept first-year students, yet 84 Year 1 students are registered. Most scholarships require Year 2 or above. Consider adding entry-level funding or adjusting year eligibility on existing opportunities.",
    detectedAgo: "2 days ago",
  },
];
