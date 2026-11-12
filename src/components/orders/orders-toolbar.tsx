"use client";

import { ArrowUpDownIcon, DownloadIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSortOption, SORT_LABELS, SORT_OPTIONS, type OrderFilters } from "@/lib/types";

interface OrdersToolbarProps {
  filters: OrderFilters;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: OrderFilters["sort"]) => void;
  onExport: () => void;
  exportCount: number;
}

export function OrdersToolbar({
  filters,
  onQueryChange,
  onSortChange,
  onExport,
  exportCount,
}: OrdersToolbarProps) {
  return (
    <div className="flex flex-col gap-2.5 border-b p-3 sm:flex-row sm:items-center sm:p-4">
      <div className="relative flex-1 sm:max-w-sm">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={filters.query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search customer, product or ID"
          aria-label="Search orders by customer, product or order ID"
          className="h-9 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        />
        {filters.query !== "" && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
          >
            <XIcon />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <Select
          value={filters.sort}
          onValueChange={(value) => {
            if (isSortOption(value)) onSortChange(value);
          }}
        >
          <SelectTrigger aria-label="Sort orders" className="h-9! flex-1 sm:w-44 sm:flex-none">
            <ArrowUpDownIcon aria-hidden="true" className="text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="lg"
          onClick={onExport}
          disabled={exportCount === 0}
          aria-label={`Export ${exportCount} ${exportCount === 1 ? "order" : "orders"} as CSV`}
        >
          <DownloadIcon aria-hidden="true" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
