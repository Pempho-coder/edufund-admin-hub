import { Star, Building2, Calendar, Banknote, FileText, CheckCircle2, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Opportunity } from "./opportunitiesData";

interface OpportunityDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
  onEdit: (opp: Opportunity) => void;
}

const statusStyles: Record<string, string> = {
  active: "bg-edu-green-light text-primary border-primary/20",
  draft: "bg-edu-amber-light text-edu-amber border-edu-amber/20",
  closed: "bg-muted text-muted-foreground border-border",
};

export function OpportunityDetailsModal({ open, onOpenChange, opportunity, onEdit }: OpportunityDetailsModalProps) {
  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                {opportunity.featured && <Star className="w-4 h-4 text-edu-yellow fill-edu-yellow" />}
                <Badge className={`text-[11px] font-semibold capitalize border ${statusStyles[opportunity.status]}`} variant="outline">
                  {opportunity.status}
                </Badge>
                <Badge variant="outline" className="text-[11px] capitalize">{opportunity.category}</Badge>
              </div>
              <DialogTitle className="text-lg leading-snug">{opportunity.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Key info row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoItem icon={Building2} label="Organization" value={opportunity.organization} />
            <InfoItem icon={Banknote} label="Amount" value={opportunity.amount} />
            <InfoItem icon={Calendar} label="Deadline" value={formatDate(opportunity.deadline)} />
          </div>

          <div className="h-px bg-border" />

          {/* Description */}
          <Section title="Description">
            <p className="text-sm text-muted-foreground leading-relaxed">{opportunity.description}</p>
          </Section>

          {/* Eligibility */}
          <Section title="Eligibility Criteria">
            <p className="text-sm text-muted-foreground leading-relaxed">{opportunity.eligibility}</p>
          </Section>

          {/* Documents */}
          <Section title="Required Documents" icon={FileText}>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.requiredDocuments.split(", ").map((doc) => (
                <Badge key={doc} variant="secondary" className="text-xs font-medium">{doc}</Badge>
              ))}
            </div>
          </Section>

          {/* Instructions */}
          <Section title="Application Instructions" icon={ClipboardList}>
            <p className="text-sm text-muted-foreground leading-relaxed">{opportunity.applicationInstructions}</p>
          </Section>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Funding type: <strong className="text-foreground">{opportunity.fundingType}</strong></span>
            <span>·</span>
            <span>Created: {formatDate(opportunity.dateCreated)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-sm">Close</Button>
          <Button onClick={() => { onOpenChange(false); onEdit(opportunity); }} className="h-9 text-sm">Edit Opportunity</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        {Icon ? <Icon className="w-3.5 h-3.5 text-muted-foreground" /> : <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />}
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
