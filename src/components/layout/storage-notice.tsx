"use client";

import { InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";

/** Surfaces storage problems instead of failing silently. */
export function StorageNotice() {
  const { ready, persistence, recoveredFromCorruption, actions } = useOrders();
  if (!ready) return null;

  if (persistence === "memory") {
    return (
      <div
        role="alert"
        className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
      >
        <TriangleAlertIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p>
          <span className="font-semibold">Browser storage is unavailable.</span> You can keep
          using OpsFlow, but changes will be lost when you refresh or close this tab. This can
          happen in private browsing or when site data is blocked.
        </p>
      </div>
    );
  }

  if (recoveredFromCorruption) {
    return (
      <div
        role="status"
        className="mb-6 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900"
      >
        <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-600" />
        <p className="flex-1">
          <span className="font-semibold">Saved data couldn&apos;t be read.</span> The data
          stored in this browser was damaged, so the demo data has been restored.
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-my-1 text-sky-700 hover:bg-sky-100 hover:text-sky-900"
          aria-label="Dismiss notice"
          onClick={actions.dismissRecoveryNotice}
        >
          <XIcon />
        </Button>
      </div>
    );
  }

  return null;
}
