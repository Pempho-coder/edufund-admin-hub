import { cn } from "@/lib/utils";
import type { ApplicationStatus, Category } from "@/data/adminMockData";

export function StatusBadge({
  status,
  pulse = false,
  size = "sm",
}: {
  status: ApplicationStatus;
  pulse?: boolean;
  size?: "sm" | "lg";
}) {
  const map = {
    submitted: { label: "Submitted", cls: "bg-edu-blue-light text-edu-blue", dot: "bg-edu-blue" },
    under_review: { label: "Under Review", cls: "bg-edu-amber-light text-edu-amber", dot: "bg-edu-amber" },
    forwarded: { label: "Forwarded", cls: "bg-primary text-primary-foreground", dot: "bg-white" },
  } as const;
  const it = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        it.cls,
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-4 h-11 text-sm w-full justify-center"
      )}
    >
      {pulse && status === "submitted" && (
        <span className="relative flex w-2 h-2">
          <span className={cn("absolute inset-0 rounded-full opacity-75 animate-soft-pulse", it.dot)} />
          <span className={cn("relative w-2 h-2 rounded-full", it.dot)} />
        </span>
      )}
      {it.label}
    </span>
  );
}

const categoryStyles: Record<Category, string> = {
  scholarship: "bg-edu-blue-light text-edu-blue",
  bursary: "bg-purple-100 text-purple-700",
  grant: "bg-teal-100 text-teal-700",
  loan: "bg-edu-amber-light text-edu-amber",
  sponsorship: "bg-orange-100 text-orange-700",
};

export function CategoryBadge({ category }: { category: Category }) {
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold",
        categoryStyles[category]
      )}
    >
      {label}
    </span>
  );
}

export function MatchBadge({ score }: { score: number }) {
  const cls =
    score >= 75
      ? "bg-edu-green-light text-primary"
      : score >= 50
      ? "bg-edu-amber-light text-edu-amber"
      : "bg-edu-red-light text-edu-red";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-[72px] h-7 rounded-full text-xs font-bold tabular-nums",
        cls
      )}
    >
      {score}%
    </span>
  );
}

export function StudentAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white font-semibold flex items-center justify-center shrink-0 shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
