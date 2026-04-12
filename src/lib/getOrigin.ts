import { NextRequest } from "next/server";

export function getOrigin(req: NextRequest) {
  // 1️⃣ Prefer env (most stable)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2️⃣ Fallback to forwarded headers
  const proto =
    req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol ?? "https:";

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");

  return `${proto}//${host}`;
}
