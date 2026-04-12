import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/modules/server/auth/betterauth/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (!session.user.username) {
    return NextResponse.redirect(new URL("/set-username", req.url));
  }

  const role = session.user.role;

  const redirectUrl = session.roleBasedRedirectUrls[role || ""] ?? "/bezs";

  return NextResponse.redirect(new URL(redirectUrl, req.url));
}
