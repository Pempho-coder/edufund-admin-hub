import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Opportunity } from "./opportunitiesData";

interface OpportunityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: Opportunity | null;
  onSave: (data: Partial<Opportunity>) => void;
}

const emptyForm = {
  title: "",
  organization: "",
  category: "scholarship" as const,
  fundingType: "",
  amount: "",
  deadline: "",
  description: "",
  eligibility: "",
  requiredDocuments: "",
  applicationInstructions: "",
  status: "draft" as const,
  featured: false,
};

export function OpportunityFormModal({ open, onOpenChange, opportunity, onSave }: OpportunityFormModalProps) {
  const isEdit = !!opportunity;
  const [form, setForm] = useState(emptyForm);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>();
  const [publishImmediately, setPublishImmediately] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setForm({
        title: opportunity.title,
        organization: opportunity.organization,
        category: opportunity.category,
        fundingType: opportunity.fundingType,
        amount: opportunity.amount,
        deadline: opportunity.deadline,
        description: opportunity.description,
        eligibility: opportunity.eligibility,
        requiredDocuments: opportunity.requiredDocuments,
        applicationInstructions: opportunity.applicationInstructions,
        status: opportunity.status,
        featured: opportunity.featured,
      });
      setDeadlineDate(new Date(opportunity.deadline));
      setPublishImmediately(opportunity.status === "active");
    } else {
      setForm(emptyForm);
      setDeadlineDate(undefined);
      setPublishImmediately(false);
    }
  }, [opportunity, open]);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...form,
      deadline: deadlineDate ? format(deadlineDate, "yyyy-MM-dd") : form.deadline,
      status: publishImmediately ? "active" : form.status,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{isEdit ? "Edit Opportunity" : "Add New Opportunity"}</DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit ? "Update the details of this funding opportunity." : "Fill in the details to create a new funding opportunity for students."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Title & Org */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Opportunity Title</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Mastercard Foundation Scholarship" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Organization Name</Label>
              <Input value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder="e.g. World Bank" className="h-9 text-sm" />
            </div>
          </div>

          {/* Category, Type, Amount */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="bursary">Bursary</SelectItem>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Funding Type</Label>
              <Input value={form.fundingType} onChange={(e) => update("fundingType", e.target.value)} placeholder="e.g. Full Scholarship" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Amount</Label>
              <Input value={form.amount} onChange={(e) => update("amount", e.target.value)} placeholder="e.g. MWK 2,500,000" className="h-9 text-sm" />
            </div>
          </div>

          {/* Deadline & Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full h-9 justify-start text-left text-sm font-normal", !deadlineDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {deadlineDate ? format(deadlineDate, "PPP") : "Select deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={deadlineDate} onSelect={setDeadlineDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Description</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the funding opportunity..." rows={3} className="text-sm resize-none" />
          </div>

          {/* Eligibility */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Eligibility Criteria</Label>
            <Textarea value={form.eligibility} onChange={(e) => update("eligibility", e.target.value)} placeholder="Who is eligible to apply?" rows={2} className="text-sm resize-none" />
          </div>

          {/* Documents & Instructions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Required Documents</Label>
              <Textarea value={form.requiredDocuments} onChange={(e) => update("requiredDocuments", e.target.value)} placeholder="List required documents..." rows={2} className="text-sm resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Application Instructions</Label>
              <Textarea value={form.applicationInstructions} onChange={(e) => update("applicationInstructions", e.target.value)} placeholder="How should students apply?" rows={2} className="text-sm resize-none" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
              <Label className="text-sm font-medium cursor-pointer">Featured Opportunity</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={publishImmediately} onCheckedChange={setPublishImmediately} />
              <Label className="text-sm font-medium cursor-pointer">Publish Immediately</Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-sm">Cancel</Button>
          <Button onClick={handleSave} className="h-9 text-sm">{isEdit ? "Save Changes" : "Create Opportunity"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
