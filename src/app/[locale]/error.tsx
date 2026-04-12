"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import RootNavBarPage from "@/modules/client/home/components/root-navbar";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const session = useSession();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen min-w-screen">
      <RootNavBarPage session={session} isErrorRender />
      <div className="p-32 min-h-screen min-w-screen flex flex-col items-center justify-center">
        <h2>Something went wrong!</h2>
        <p>Error reason: {error.message}</p>
        <Button onClick={() => reset()} className="mt-2">
          Try again
        </Button>
      </div>
    </div>
  );
}
