// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // Custom logic here only if you want to redirect per-role.
    // The role is available on req.nextauth.token?.role
    const token = (req as unknown as { nextauth?: { token?: { role?: string } } }).nextauth?.token;
    const role = token?.role ?? "STUDENT";
    const { pathname } = req.nextUrl;

    // Protect /doctor/* — allow DOCTOR or ADMIN only
    if (pathname.startsWith("/doctor") && !["DOCTOR", "ADMIN"].includes(role)) {
      const url = new URL("/api/auth/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return Response.redirect(url);
    }

    // Protect /admin/* — allow ADMIN only
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const url = new URL("/api/auth/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return Response.redirect(url);
    }
  },
  {
    callbacks: {
      // Return true to allow the request if the user is signed in (token exists)
      // For public pages, we don't run middleware due to matcher below.
      authorized: ({ token }) => !!token,
    },
  }
);

// Tell middleware which paths to run on
export const config = {
  matcher: [
    "/me/:path*",      // student dashboard
    "/doctor/:path*",  // doctor dashboard
    "/admin/:path*",   // admin pages
  ],
};