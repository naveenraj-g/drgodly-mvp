import { Skeleton } from "@/components/ui/skeleton";
import { DataTableCardSkeleton } from "@/modules/shared/components/table/DataTableCardSkeleton";

export function ListFilesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Table / Card skeleton */}
      <DataTableCardSkeleton />
    </div>
  );
}
