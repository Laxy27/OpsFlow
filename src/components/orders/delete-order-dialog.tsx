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
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/format";
import { orderActions } from "@/lib/order-store";
import { getOrderTotal } from "@/lib/orders";
import type { Order } from "@/lib/types";

interface DeleteOrderDialogProps {
  /** Kept after closing so the text does not change during the exit animation. */
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteOrderDialog({ order, open, onOpenChange }: DeleteOrderDialogProps) {
  function handleDelete() {
    if (!order) return;
    const { saved } = orderActions.remove(order.id);
    if (saved) toast.success(`Order ${order.id} deleted`);
    else
      toast.warning(`Order ${order.id} deleted for this session`, {
        description: "Browser storage is unavailable, so it will reappear after a refresh.",
      });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete order {order?.id}?</AlertDialogTitle>
          <AlertDialogDescription>
            {order && (
              <>
                The {formatCurrency(getOrderTotal(order))} order for{" "}
                <span className="font-medium text-foreground">{order.customer}</span> will be
                permanently removed. This can&apos;t be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            variant="destructive"
          >
            Delete order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
