import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile (background + text color). */
  tone: string;
}

export function KpiCard({ label, value, detail, icon: Icon, tone }: KpiCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <span aria-hidden="true" className={cn("grid size-9 place-items-center rounded-lg", tone)}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <dd className="mt-1">
        <span className="block text-[1.75rem] leading-tight font-semibold tracking-tight text-foreground">
          {value}
        </span>
        <span className="mt-1.5 block text-xs text-muted-foreground">{detail}</span>
      </dd>
    </div>
  );
}
