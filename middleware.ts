import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

import { NextRequest, NextResponse } from "next/server";
import { TSession } from "./src/modules/server/auth/types/auth-types";
import {
  formattedRBACSessionData,
  matchDynamicRoute,
} from "@/lib/format-session-data";
import { getOrigin } from "@/lib/getOrigin";

const intlMiddleware = createMiddleware(routing);

async function getMiddlewareSession(
  req: NextRequest
): Promise<TSession | null> {
  // pas this in fetch when building for production
  const origin = getOrigin(req);

  try {
    // replace req.nextUrl.origin -> to origin;
    const response = await fetch(`${origin}/api/auth/get-session`, {
      method: "GET",
      headers: {
        Cookie: req.headers.get("cookie") || "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      if (response.status === 500) {
        console.error("Session API error:", await response.text());
      }
      return null;
    }

    const session: TSession = await response.json();
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

function matchRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}`);
}

const publicRoutes = ["/", "/chat"];

const authRoutes = [
  "/sign",
  "/email-verification",
  "/reset-password",
  "/2fa-verification",
];
const routesRoleNotRequiredMatch = ["/", "/bezs"];
const routesRoleNotRequiredStartWith = [
  "/bezs/dashboard",
  "/bezs/apps",
  "/bezs/calendar",
  "/2fa-verification",
  "/set-username",
];

// if (
//       pathname === '/profile' &&
//       request.cookies.get('NEW_PROFILE')?.value === 'true'
//     ) {
//       response = NextResponse.rewrite(
//         new URL(`/${locale}/profile/new`, request.url),
//         {headers: response.headers}
//       );
//     }

export async function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);

  if (!intlResponse.ok) {
    return intlResponse;
  }

  const [, locale, ...rest] = new URL(
    intlResponse.headers.get("x-middleware-rewrite") || req.url
  ).pathname.split("/");
  const pathname = "/" + rest.join("/");

  // console.log({ message: "Middleware ended", pathname, locale });
  // const { pathname, locale } = req.nextUrl;

  const url = req.url;

  // console.log({ url });

  // Skip only for session API
  if (pathname === "/api/auth/get-session" || pathname === `/${locale}`) {
    return NextResponse.next();
  }

  if (publicRoutes.some((route) => matchRoute(pathname, route))) {
    return NextResponse.next();
  }

  const session = await getMiddlewareSession(req);

  // Auth routes (accessible only if not logged in)
  if (authRoutes.some((route) => matchRoute(pathname, route))) {
    return session
      ? NextResponse.redirect(new URL(`/${locale}/bezs`, url))
      : NextResponse.next();
  }

  // Protected Routes (Require login)
  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/signin`, url));
  }

  // Admin-only route protection
  if (pathname.startsWith("/bezs/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL(`/${locale}`, url));
  }

  // Role-Not-Required Routes (bypass role checks)
  if (
    routesRoleNotRequiredMatch.some((route) => pathname === route) ||
    routesRoleNotRequiredStartWith.some((route) => matchRoute(pathname, route))
  ) {
    return NextResponse.next();
  }

  const userRole = session?.user?.role || "";
  const rbacData = formattedRBACSessionData(session);
  const roleBasedAllowedRoutes: string[] = rbacData[userRole] || [];
  // console.log({ roleBasedAllowedRoutes, rbacData });

  const isAllowed = roleBasedAllowedRoutes.some((routePattern) =>
    matchDynamicRoute(routePattern, pathname)
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL(`/${locale}`, url));
  }

  // if (!roleBasedAllowedRoutes.some((route) => pathname === route)) {
  //   return NextResponse.redirect(new URL("/", url));
  // }

  // Set the current URL as a custom header for use in server components
  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  res.headers.set("x-next-intl-locale", locale);

  console.log("Middleware working");
  return res;

  // return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
