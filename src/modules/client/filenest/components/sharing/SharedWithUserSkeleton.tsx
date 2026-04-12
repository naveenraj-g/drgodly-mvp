"use client";

import { Skeleton } from "@/components/ui/skeleton";

function SharedWithUserSkeleton() {
  return (
    <div className="space-y-4">
      {/* Repeat for multiple users */}
      {Array.from({ length: 2 }).map((_, userIdx) => (
        <div
          key={userIdx}
          className="flex flex-col items-start gap-4 p-4 bg-muted/60 rounded-lg"
        >
          {/* User header */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" /> {/* User name */}
            <Skeleton className="h-5 w-16 rounded-full" /> {/* Files badge */}
          </div>

          {/* File list */}
          <div className="space-y-2 w-full">
            {Array.from({ length: 3 }).map((_, fileIdx) => (
              <div
                key={fileIdx}
                className="flex items-center gap-2 p-2 rounded-lg bg-background/80"
              >
                {/* File icon */}
                <Skeleton className="h-4 w-4 rounded" />

                {/* File name */}
                <Skeleton className="h-4 flex-1 max-w-[250px]" />

                {/* Permission badges */}
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />

                {/* Ellipsis button */}
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SharedWithUserSkeleton;
