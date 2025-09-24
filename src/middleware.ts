// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const path = req.nextUrl.pathname;

  // Handle login and unauthorized pages
  if (path === "/login" || path === "/unauthorized") {
    if (token && path === "/login") {
      // If user has token and tries to access login, redirect to appropriate dashboard
      const routed =
        role === "admin"
          ? "/teachers"
          : role === "super-admin"
          ? "/super-admin"
          : "/students";
      return NextResponse.redirect(new URL(routed, req.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based authorization checks
  if (path.startsWith("/students") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/teachers") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/super-admin") && role !== "super-admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Handle root path redirect based on role
  if (path === "/") {
    const routed =
      role === "admin"
        ? "/teachers"
        : role === "super-admin"
        ? "/super-admin"
        : "/students";
    return NextResponse.redirect(new URL(routed, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/students/:path*",
    "/teachers/:path*",
    "/super-admin/:path*",
    "/unauthorized",
  ],
};
