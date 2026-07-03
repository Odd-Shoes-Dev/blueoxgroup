import NextAuth from "next-auth"

import { authConfig } from "./config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export type UserRole = "admin" | "sales_rep"

/** Returns the current session's user, or null if not signed in. */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

/**
 * Throws if there's no session, or the session's role isn't one of `roles`.
 * Use at the top of a server action / server component that must be
 * restricted to specific roles.
 */
export async function requireRole(...roles: UserRole[]) {
  const user = await getCurrentUser()
  if (!user || !roles.includes(user.role)) {
    throw new Error("Unauthorized")
  }
  return user
}
