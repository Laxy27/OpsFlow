"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/dates";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getOrderTotal } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { OrderRowActions } from "./order-row-actions";
import { StatusMenu } from "./status-menu";

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

/**
 * Responsive order list: a full table from the md breakpoint up,
 * stacked cards on small screens.
 */
export function OrdersTable({ orders, onEdit, onDelete }: OrdersTableProps) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-10 pl-4 text-xs font-medium text-muted-foreground">Order</TableHead>
              <TableHead className="h-10 text-xs font-medium text-muted-foreground">Customer</TableHead>
              <TableHead className="hidden h-10 text-right text-xs font-medium text-muted-foreground xl:table-cell">Qty</TableHead>
              <TableHead className="hidden h-10 text-right text-xs font-medium text-muted-foreground xl:table-cell">Unit price</TableHead>
              <TableHead className="h-10 text-right text-xs font-medium text-muted-foreground">Total</TableHead>
              <TableHead className="h-10 pl-6 text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="h-10 w-12 pr-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="group">
                <TableCell className="py-3 pl-4">
                  <div className="font-mono text-[0.8rem] font-medium text-foreground">{order.id}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{formatDate(order.orderDate)}</div>
                </TableCell>
                <TableCell className="max-w-72 py-3">
                  <div className="truncate font-medium text-foreground">{order.customer}</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">{order.product}</div>
                </TableCell>
                <TableCell className="hidden py-3 text-right tabular-nums xl:table-cell">
                  {formatNumber(order.quantity)}
                </TableCell>
                <TableCell className="hidden py-3 text-right text-muted-foreground tabular-nums xl:table-cell">
                  {formatCurrency(order.unitPrice)}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="font-semibold text-foreground tabular-nums">
                    {formatCurrency(getOrderTotal(order))}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground tabular-nums xl:hidden">
                    {formatNumber(order.quantity)} × {formatCurrency(order.unitPrice)}
                  </div>
                </TableCell>
                <TableCell className="py-3 pl-6">
                  <StatusMenu order={order} />
                </TableCell>
                <TableCell className="py-3 pr-4 text-right">
                  <OrderRowActions order={order} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="divide-y md:hidden" aria-label="Orders">
        {orders.map((order) => (
          <li key={order.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{order.customer}</p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{order.product}</p>
              </div>
              <OrderRowActions order={order} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="space-y-2">
                <StatusMenu order={order} />
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono font-medium text-foreground">{order.id}</span>
                  {" · "}
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold tabular-nums">{formatCurrency(getOrderTotal(order))}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(order.quantity)} × {formatCurrency(order.unitPrice)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
