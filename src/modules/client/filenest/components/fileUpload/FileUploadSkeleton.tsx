import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FileUploadSkeleton() {
  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Dropzone */}
          <div className="border-2 border-dashed rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-4 w-56 mx-auto" />
                <Skeleton className="h-3 w-40 mx-auto" />
              </div>
            </div>
          </div>

          {/* Uploaded files list */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />

            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
              >
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>

          {/* Select */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-3/4" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
