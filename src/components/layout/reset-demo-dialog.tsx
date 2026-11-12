"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { orderActions } from "@/lib/order-store";

/** Confirmation dialog that restores the original demo dataset. */
export function ResetDemoDialog({ children }: { children: React.ReactNode }) {
  function handleReset() {
    const { saved } = orderActions.resetDemoData();
    if (saved) {
      toast.success("Demo data restored", {
        description: "All 40 sample orders are back to their original state.",
      });
    } else {
      toast.warning("Demo data restored for this session", {
        description: "Browser storage is unavailable, so it will not survive a refresh.",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
          <AlertDialogDescription>
            This replaces every order in this browser with the original sample dataset.
            Orders you added or edited will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>Reset data</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
