import { useState, useRef, useEffect } from "react";
import {
  Bell,
  FileText,
  UserPlus,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

type NotificationType = "submission" | "registration" | "forwarded" | "deadline" | "gap";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "submission",
    title: "New application submitted",
    message: "Chisomo Banda applied to MHANGO Foundation Bursary",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "submission",
    title: "New application submitted",
    message: "Tadala Phiri applied to STEM Excellence Grant",
    time: "18 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "registration",
    title: "New student registered",
    message: "Yamikani Mwale joined — Faculty of Sci & Tech",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n4",
    type: "deadline",
    title: "Opportunity closing today",
    message: "MHANGO Foundation Bursary deadline is in 6 hours",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "n5",
    type: "forwarded",
    title: "Application forwarded",
    message: "You forwarded Mphatso Banda to Chancellor's Office",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n6",
    type: "gap",
    title: "Funding gap detected",
    message: "Faculty of Education has 0 active opportunities",
    time: "Yesterday",
    read: true,
  },
];

const iconFor = (type: NotificationType) => {
  switch (type) {
    case "submission":
      return { Icon: FileText, color: "text-edu-blue", bg: "bg-edu-blue-light" };
    case "registration":
      return { Icon: UserPlus, color: "text-primary", bg: "bg-edu-green-light" };
    case "forwarded":
      return { Icon: Send, color: "text-primary", bg: "bg-edu-green-light" };
    case "deadline":
      return { Icon: Clock, color: "text-edu-red", bg: "bg-edu-red-light" };
    case "gap":
      return { Icon: AlertTriangle, color: "text-edu-amber", bg: "bg-edu-amber-light" };
  }
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const markAllRead = () => setItems((xs) => xs.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setItems((xs) => xs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const dismiss = (id: string) => setItems((xs) => xs.filter((n) => n.id !== id));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 rounded-xl hover:bg-accent transition-all active:scale-95"
      >
        <Bell className="w-[18px] h-[18px] text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-edu-red text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-card">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <p className="text-sm font-bold text-foreground">Notifications</p>
              <p className="text-[11px] text-muted-foreground">
                {unread > 0 ? `${unread} unread` : "All caught up"}
              </p>
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-primary/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-muted-foreground">No notifications</p>
              </div>
            ) : (
              items.map((n) => {
                const { Icon, color, bg } = iconFor(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`group flex gap-3 px-4 py-3 border-b border-border/60 cursor-pointer transition-colors hover:bg-accent/60 ${
                      !n.read ? "bg-edu-blue-light/30" : ""
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold text-foreground leading-snug">
                          {n.title}
                        </p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-edu-blue mt-1.5 shrink-0" />}
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-snug mt-0.5 truncate">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1">{n.time}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 rounded-md hover:bg-edu-red-light flex items-center justify-center shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-edu-red" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-border bg-muted/30">
            <button className="w-full text-[12px] font-semibold text-primary hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
