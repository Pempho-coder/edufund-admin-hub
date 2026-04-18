import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  UserPlus, ClipboardCheck, Bell, Target, Hash, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="max-w-[1100px] mx-auto space-y-5 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account, platform configuration, and notifications.
          </p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="rounded-xl bg-muted">
            <TabsTrigger value="account" className="rounded-lg">Account</TabsTrigger>
            <TabsTrigger value="platform" className="rounded-lg">Platform</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-5 space-y-5">
            <AccountTab />
          </TabsContent>
          <TabsContent value="platform" className="mt-5">
            <PlatformTab />
          </TabsContent>
          <TabsContent value="notifications" className="mt-5">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function AccountTab() {
  const [pw, setPw] = useState("");
  const strength = useMemo(() => {
    let s = 0;
    if (pw.length >= 8) s += 30;
    if (/[A-Z]/.test(pw)) s += 20;
    if (/[0-9]/.test(pw)) s += 25;
    if (/[^A-Za-z0-9]/.test(pw)) s += 25;
    return Math.min(100, s);
  }, [pw]);
  const strengthLabel = strength <= 25 ? "Weak" : strength <= 60 ? "Fair" : "Strong";
  const strengthColor =
    strength <= 25 ? "bg-edu-red" : strength <= 60 ? "bg-edu-amber" : "bg-primary";
  const strengthText =
    strength <= 25 ? "text-edu-red" : strength <= 60 ? "text-edu-amber" : "text-primary";

  return (
    <>
      <Card className="rounded-2xl shadow-sm border-border/60 p-6">
        <h2 className="text-base font-semibold mb-4">Admin Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" defaultValue="Admin User" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="admin@mzuni.ac.mw" className="rounded-xl" />
            <p className="text-xs text-muted-foreground">Changing email requires re-verification</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue="+265 999 000 000" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <span className="inline-flex w-fit px-3 py-2 rounded-xl bg-edu-green-light text-primary text-sm font-semibold">
              Administrator
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button className="rounded-xl bg-primary hover:bg-primary/90" onClick={() => toast.success("Profile updated")}>
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl shadow-sm border-border/60 p-6">
        <h2 className="text-base font-semibold mb-4">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="cur-pw">Current Password</Label>
            <Input id="cur-pw" type="password" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-pw">New Password</Label>
            <Input id="new-pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="rounded-xl" />
            {pw && (
              <div className="space-y-1.5">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", strengthColor)} style={{ width: `${strength}%` }} />
                </div>
                <p className={cn("text-xs font-semibold", strengthText)}>{strengthLabel}</p>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-pw">Confirm New Password</Label>
            <Input id="confirm-pw" type="password" className="rounded-xl" />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button className="rounded-xl bg-primary hover:bg-primary/90" onClick={() => toast.success("Password updated")}>
            Update Password
          </Button>
        </div>
      </Card>
    </>
  );
}

function PlatformTab() {
  const [allowReg, setAllowReg] = useState(true);
  const [requireProfile, setRequireProfile] = useState(true);
  const [profileMin, setProfileMin] = useState(60);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [matchMin, setMatchMin] = useState(50);
  const [maxApps, setMaxApps] = useState(0);

  const rows = [
    {
      icon: UserPlus, title: "Allow New Registrations", desc: "Allow new students to register",
      control: <Switch checked={allowReg} onCheckedChange={setAllowReg} />,
    },
    {
      icon: ClipboardCheck, title: "Require Profile Completion Before Applying",
      desc: "Students must complete a minimum % before applying",
      control: (
        <div className="flex items-center gap-3">
          <Switch checked={requireProfile} onCheckedChange={setRequireProfile} />
          <Input
            type="number"
            value={profileMin}
            disabled={!requireProfile}
            onChange={(e) => setProfileMin(Number(e.target.value))}
            className="w-20 rounded-xl"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      ),
    },
    {
      icon: Bell, title: "Deadline Reminder Notifications",
      desc: "Send alerts when opportunity deadlines approach",
      control: <Switch checked={deadlineReminders} onCheckedChange={setDeadlineReminders} />,
    },
    {
      icon: Target, title: "Minimum Match Score for Recommendations",
      desc: "Opportunities below this score are not recommended",
      control: (
        <div className="w-[260px] space-y-2">
          <div className="flex items-center justify-between">
            <Slider value={[matchMin]} max={100} step={1} onValueChange={(v) => setMatchMin(v[0])} className="flex-1" />
            <span className="ml-3 inline-flex px-2.5 py-1 rounded-full bg-edu-green-light text-primary text-xs font-bold">
              {matchMin}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{matchMin}% minimum</p>
        </div>
      ),
    },
    {
      icon: Hash, title: "Maximum Applications Per Student", desc: "Leave at 0 for no limit",
      control: (
        <Input type="number" value={maxApps} onChange={(e) => setMaxApps(Number(e.target.value))} className="w-24 rounded-xl" />
      ),
    },
  ];

  return (
    <Card className="rounded-2xl shadow-sm border-border/60 p-6">
      <h2 className="text-base font-semibold mb-4">Platform Configuration</h2>
      <div className="divide-y divide-border/60">
        {rows.map((r) => (
          <div key={r.title} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-edu-green-light flex items-center justify-center shrink-0">
                <r.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </div>
            <div className="shrink-0">{r.control}</div>
          </div>
        ))}
      </div>
      <Button
        className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-5"
        onClick={() => toast.success("Platform settings saved")}
      >
        <Save className="w-4 h-4" /> Save Platform Settings
      </Button>
    </Card>
  );
}

function NotificationsTab() {
  const items = [
    { id: "n1", label: "New student registers", default: true },
    { id: "n2", label: "Student submits an application", default: true },
    { id: "n3", label: "Application waiting more than 7 days unreviewed", default: true },
    { id: "n4", label: "Opportunity deadline within 3 days", default: true },
    { id: "n5", label: "Daily platform activity summary", default: false },
    { id: "n6", label: "Weekly analytics digest", default: false },
  ];
  return (
    <Card className="rounded-2xl shadow-sm border-border/60 p-6">
      <h2 className="text-base font-semibold">Notification Preferences</h2>
      <p className="text-sm text-muted-foreground mb-4">Choose when to receive admin alerts</p>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
            <Checkbox id={it.id} defaultChecked={it.default} />
            <Label htmlFor={it.id} className="cursor-pointer flex-1">{it.label}</Label>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-5">
        <Button className="rounded-xl bg-primary hover:bg-primary/90" onClick={() => toast.success("Preferences saved")}>
          Save Preferences
        </Button>
      </div>
    </Card>
  );
}
