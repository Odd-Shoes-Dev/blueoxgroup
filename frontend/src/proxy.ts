import { NextResponse } from "next/server"

import { auth } from "@/lib/providers/auth"

/**
 * Route guard. Next.js 16 renamed `middleware.ts` -> `proxy.ts`; this is the
 * proxy equivalent of the old auth middleware pattern.
 *
 * Note: this only covers page navigation. Server Actions are POST requests
 * to the page route and can be missed by a matcher change, so every
 * server action that mutates data must also call requireRole() itself
 * (see lib/providers/auth/index.ts) rather than relying on this alone.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user

  // Suspended users can only reach /suspended and auth/sign-out routes
  if (user?.role === "suspended" && !pathname.startsWith("/suspended")) {
    return NextResponse.redirect(new URL("/suspended", req.nextUrl.origin))
  }

  const isAdminRoute = pathname.startsWith("/admin")
  const isDashboardRoute = pathname.startsWith("/dashboard")

  if ((isAdminRoute || isDashboardRoute) && !user) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (isAdminRoute && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
