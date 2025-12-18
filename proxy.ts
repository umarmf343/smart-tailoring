import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"]

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If no session and trying to access protected route, redirect to login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If has session, verify role-based access
  if (session) {
    try {
      const sessionData = JSON.parse(session.value)
      const role = sessionData.role

      // Customer routes
      if (pathname.startsWith("/customer") && role !== "customer") {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
      }

      // Tailor routes
      if (pathname.startsWith("/tailor") && role !== "tailor") {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
      }

      // Admin routes
      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
      }
    } catch (error) {
      // Invalid session, clear it
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
