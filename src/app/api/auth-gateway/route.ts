import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/modules/server/auth/betterauth/auth";
import { getAuthProvider } from "@/modules/server/auth/utils/getAuthProvider";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "How dare you to call this endpoint." });

  const { provider } = getAuthProvider();
  const mode = req.nextUrl.searchParams.get("mode"); // signin | signup

  try {
    // Keycloak flow
    if (provider === "keycloak") {
      const result = await auth.api.signInWithOAuth2({
        body: {
          providerId: "keycloak",
          callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/rolebased-redirect`,
          additionalData: { prompt: "login", max_age: 0 },
        },
      });

      return NextResponse.redirect(result.url);
    }

    // BetterAuth native pages
    if (provider === "betterauth") {
      const target = mode === "signup" ? "/signup" : "/signin";

      return NextResponse.redirect(new URL(target, req.url));
    }

    return NextResponse.redirect(new URL("/signin", req.url));
  } catch (error) {
    console.error("Auth redirect error:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
