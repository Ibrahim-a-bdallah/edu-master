// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const path = req.nextUrl.pathname;

  if (path === "/login" || path === "/unauthorized") {
    if (token && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", req.url);

    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // const routed =
  //   role === "admin"
  //     ? "/teachers"
  //     : role === "super-admin"
  //     ? "/super-admin"
  //     : "/students";
  // if (path.startsWith("") && role) {
  //   return NextResponse.redirect(new URL(routed, req.url));
  // }
  if (path.startsWith("/students") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/teachers") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/super-admin") && role !== "super-admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
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
