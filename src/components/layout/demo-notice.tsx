"use client";

import { DatabaseIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResetDemoDialog } from "./reset-demo-dialog";

/** Explains that OpsFlow is a browser-only demo and offers a reset. */
export function DemoNotice() {
  return (
    <section
      aria-labelledby="demo-notice-title"
      className="rounded-xl border bg-muted/60 p-3.5"
    >
      <div className="flex items-center gap-2">
        <DatabaseIcon aria-hidden="true" className="size-4 text-primary" />
        <h2 id="demo-notice-title" className="text-sm font-semibold text-foreground">
          Browser demo
        </h2>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        Sample data with fictional customers. Changes are saved in this browser only.
      </p>
      <ResetDemoDialog>
        <Button variant="outline" size="sm" className="mt-3 w-full bg-card">
          <RotateCcwIcon aria-hidden="true" />
          Reset demo data
        </Button>
      </ResetDemoDialog>
    </section>
  );
}
