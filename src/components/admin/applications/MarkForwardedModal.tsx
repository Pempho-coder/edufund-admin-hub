import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MarkForwardedModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (payload: { forwardedTo: string; forwardedAt: string; forwardingNotes?: string }) => void;
}

export function MarkForwardedModal({ open, onOpenChange, onConfirm }: MarkForwardedModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [forwardedTo, setForwardedTo] = useState("");
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setForwardedTo("");
    setDate(today);
    setNotes("");
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!forwardedTo.trim()) return;
    setLoading(true);
    // simulate brief async
    await new Promise((r) => setTimeout(r, 350));
    const formatted = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
    onConfirm({
      forwardedTo: forwardedTo.trim(),
      forwardedAt: formatted,
      forwardingNotes: notes.trim() || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Forward Application</DialogTitle>
          <DialogDescription>
            Confirm you have sent this application to the organisation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="forwarded-to">Forwarded To <span className="text-edu-red">*</span></Label>
            <Input
              id="forwarded-to"
              placeholder="e.g. scholarships@mzuni.ac.mw"
              value={forwardedTo}
              onChange={(e) => setForwardedTo(e.target.value)}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">Name or email of organisation contact</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="forward-date">Date Forwarded <span className="text-edu-red">*</span></Label>
            <Input
              id="forward-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Forwarding Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Any notes about this submission..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-primary hover:bg-primary/90"
            disabled={!forwardedTo.trim() || loading}
            onClick={handleSubmit}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Confirm & Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
