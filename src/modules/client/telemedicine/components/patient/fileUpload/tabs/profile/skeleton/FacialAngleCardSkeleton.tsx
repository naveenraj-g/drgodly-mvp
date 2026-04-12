import { Skeleton } from "@/components/ui/skeleton";

interface FacialAngleCardSkeletonProps {
  count?: number;
}

function FacialAngleCardLoaderSkeleton({
  count = 5,
}: FacialAngleCardSkeletonProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden bg-card border border-border shadow-card"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex gap-3 items-center">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>

            {/* Image area */}
            <Skeleton className="aspect-square h-80 w-full" />
          </div>
        ))}
      </div>
      {/* Submit button */}
      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>
    </>
  );
}

export default FacialAngleCardLoaderSkeleton;
