import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTableSkeleton() {
  return (
    <div role="status" aria-label="Loading orders">
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-8 w-28 rounded-lg" />
        ))}
      </div>
      <div className="panel mt-4 overflow-hidden">
        <div className="flex gap-2 border-b p-4">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="ml-auto h-9 w-44" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center gap-6 px-4 py-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
