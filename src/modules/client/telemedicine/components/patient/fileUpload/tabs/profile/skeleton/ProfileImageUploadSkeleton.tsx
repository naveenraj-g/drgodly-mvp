import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileImageUploadSkeleton() {
  return (
    <CardContent>
      <div className="flex flex-col items-center gap-4">
        {/* Avatar skeleton */}
        <Skeleton className="h-36 w-36 rounded-full" />

        {/* Button skeleton */}
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>
    </CardContent>
  );
}

export default ProfileImageUploadSkeleton;
