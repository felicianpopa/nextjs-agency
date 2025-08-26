import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const locales = ["en", "ro"];
const defaultLocale = "en";

// Get the preferred locale
function getLocale(request: NextRequest): string {
  // Check browser language preferences
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim());

    for (const lang of languages) {
      if (locales.includes(lang)) {
        return lang;
      }
      // Check for language without region (e.g., "en" from "en-US")
      const langCode = lang.split("-")[0];
      if (locales.includes(langCode)) {
        return langCode;
      }
    }
  }

  return defaultLocale; // Default fallback
}

// Custom function to check if route is protected
function isProtectedRoute(pathname: string): boolean {
  // Check for profile routes with or without locale
  return (
    pathname.includes("/profile") ||
    locales.some((locale) => pathname.startsWith(`/${locale}/profile`))
  );
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const { pathname } = req.nextUrl;

  // Skip locale handling for API routes
  if (pathname.startsWith("/api/")) {
    // Only handle protected API routes if needed
    return;
  }

  // Handle locale redirects first
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    const locale = getLocale(req);
    req.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(req.nextUrl);
  }

  // Handle protected routes
  if (!userId && isProtectedRoute(pathname)) {
    console.warn("PROTECTED - redirecting to sign in");
    return redirectToSignIn();
  }

  console.warn("Access granted");
});

export const config = {
  matcher: [
    // Skip all internal paths (_next) including image optimization, API routes, and static files
    "/((?!_next|api|favicon.ico).*)",
  ],
};
