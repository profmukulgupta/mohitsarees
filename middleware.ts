import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Paths that require authentication
  const authRoutes = ["/account", "/checkout"]

  // Check if the current path requires authentication
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If the route requires authentication and the user is not authenticated
  if (isAuthRoute && !isAuthenticated) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If the user is already authenticated and tries to access login/register pages
  if (
    isAuthenticated &&
    (request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/register"))
  ) {
    return NextResponse.redirect(new URL("/account", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/auth/login", "/auth/register"],
}

