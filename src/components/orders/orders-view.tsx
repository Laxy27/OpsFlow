"use client";

import { ClipboardListIcon, PlusIcon, RotateCcwIcon, SearchXIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResetDemoDialog } from "@/components/layout/reset-demo-dialog";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import { downloadOrdersCsv } from "@/lib/csv";
import { todayIsoDate } from "@/lib/dates";
import {
  filterOrders,
  filtersFromSearchParams,
  filtersToSearchParams,
  hasActiveFilters,
} from "@/lib/filters";
import { formatCurrency, formatNumber } from "@/lib/format";
import { countByStatus } from "@/lib/metrics";
import { getOrderTotal, roundCurrency } from "@/lib/orders";
import { DEFAULT_FILTERS, type Order, type OrderFilters } from "@/lib/types";
import { DeleteOrderDialog } from "./delete-order-dialog";
import { OrderFormDialog } from "./order-form-dialog";
import { OrdersTable } from "./orders-table";
import { OrdersTableSkeleton } from "./orders-table-skeleton";
import { OrdersToolbar } from "./orders-toolbar";
import { StatusFilter } from "./status-filter";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function OrdersView() {
  const { ready, orders } = useOrders();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Filters start from the URL (shareable links) and are kept in local state.
  const [filters, setFilters] = useState<OrderFilters>(() =>
    filtersFromSearchParams(searchParams),
  );
  // `?new=1` (used by the dashboard's "New order" button) opens the form.
  const [formOpen, setFormOpen] = useState(() => searchParams.get("new") === "1");
  const [editing, setEditing] = useState<Order | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Order | null>(null);

  // Mirror the filters into the URL without adding history entries.
  useEffect(() => {
    const query = filtersToSearchParams(filters).toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", url);
    }
  }, [filters, pathname]);

  const filtered = useMemo(() => filterOrders(orders, filters), [orders, filters]);
  const counts = useMemo(() => countByStatus(orders), [orders]);
  const filteredValue = useMemo(
    () => roundCurrency(filtered.reduce((sum, order) => sum + getOrderTotal(order), 0)),
    [filtered],
  );
  const customerSuggestions = useMemo(
    () => uniqueSorted(orders.map((order) => order.customer)),
    [orders],
  );
  const productSuggestions = useMemo(
    () => uniqueSorted(orders.map((order) => order.product)),
    [orders],
  );

  const updateFilters = (patch: Partial<OrderFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));
  const clearFilters = () => setFilters((current) => ({ ...DEFAULT_FILTERS, sort: current.sort }));

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(order: Order) {
    setEditing(order);
    setFormOpen(true);
  }

  function openDelete(order: Order) {
    setDeleting(order);
    setDeleteOpen(true);
  }

  function handleExport() {
    if (filtered.length === 0) return;
    const fileName = `opsflow-orders-${todayIsoDate()}.csv`;
    downloadOrdersCsv(filtered, fileName);
    toast.success(
      `Exported ${formatNumber(filtered.length)} ${filtered.length === 1 ? "order" : "orders"}`,
      { description: fileName },
    );
  }

  const filtersActive = hasActiveFilters(filters);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track, update and export customer orders."
        actions={
          <Button size="lg" onClick={openCreate} disabled={!ready}>
            <PlusIcon aria-hidden="true" />
            New order
          </Button>
        }
      />

      {!ready ? (
        <OrdersTableSkeleton />
      ) : (
        <>
          <StatusFilter
            value={filters.status}
            counts={counts}
            total={orders.length}
            onChange={(status) => updateFilters({ status })}
          />

          <section aria-label="Order list" className="panel mt-4 overflow-hidden">
            <OrdersToolbar
              filters={filters}
              onQueryChange={(query) => updateFilters({ query })}
              onSortChange={(sort) => updateFilters({ sort })}
              onExport={handleExport}
              exportCount={filtered.length}
            />

            {orders.length === 0 ? (
              <EmptyState
                icon={ClipboardListIcon}
                title="No orders yet"
                description="Create your first order, or restore the sample dataset to explore the dashboard."
              >
                <Button onClick={openCreate}>
                  <PlusIcon aria-hidden="true" />
                  New order
                </Button>
                <ResetDemoDialog>
                  <Button variant="outline">
                    <RotateCcwIcon aria-hidden="true" />
                    Reset demo data
                  </Button>
                </ResetDemoDialog>
              </EmptyState>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchXIcon}
                title="No matching orders"
                description="No orders match your current search and status filter."
              >
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyState>
            ) : (
              <OrdersTable orders={filtered} onEdit={openEdit} onDelete={openDelete} />
            )}

            {orders.length > 0 && (
              <div className="flex flex-col gap-1 border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite">
                  Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
                  {orders.length} orders
                  {filtersActive && (
                    <>
                      {" · "}
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="font-medium text-primary underline-offset-2 outline-none hover:underline focus-visible:underline"
                      >
                        Clear filters
                      </button>
                    </>
                  )}
                </p>
                <p>
                  Order value shown:{" "}
                  <span className="font-medium text-foreground tabular-nums">
                    {formatCurrency(filteredValue)}
                  </span>
                </p>
              </div>
            )}
          </section>
        </>
      )}

      <OrderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editing}
        customerSuggestions={customerSuggestions}
        productSuggestions={productSuggestions}
      />
      <DeleteOrderDialog order={deleting} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
