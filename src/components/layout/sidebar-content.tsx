"use client";

import { ClipboardListIcon, LayoutDashboardIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrders } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { DemoNotice } from "./demo-notice";
import { Logo } from "./logo";

interface NavItem {
  href: "/" | "/orders";
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/orders", label: "Orders", icon: ClipboardListIcon },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { ready, orders } = useOrders();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo onClick={onNavigate} />
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2.5 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "size-4.5 shrink-0",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {item.label}
                  {item.href === "/orders" && ready && (
                    <span
                      className={cn(
                        "ml-auto rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                        active ? "bg-card text-accent-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <span className="sr-only">(</span>
                      {orders.length}
                      <span className="sr-only"> orders)</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 p-3">
        <DemoNotice />
      </div>
    </div>
  );
}
