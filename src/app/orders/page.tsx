import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { OrdersTableSkeleton } from "@/components/orders/orders-table-skeleton";
import { OrdersView } from "@/components/orders/orders-view";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    // OrdersView reads filters from the URL, so it renders in the browser.
    <Suspense
      fallback={
        <>
          <PageHeader title="Orders" description="Track, update and export customer orders." />
          <OrdersTableSkeleton />
        </>
      }
    >
      <OrdersView />
    </Suspense>
  );
}
