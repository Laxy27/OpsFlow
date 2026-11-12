import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4.5" strokeWidth={2.25}>
          <path
            d="M4 15.5 9 10l4 4 7-8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="6" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        OpsFlow
      </span>
    </Link>
  );
}
