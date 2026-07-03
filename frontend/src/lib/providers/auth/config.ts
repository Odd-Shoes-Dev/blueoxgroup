import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { db } from "@/lib/providers/database"

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const rows = await db.sql`
          select id, email, password_hash, role
          from users
          where email = ${email} and deleted_at is null
          limit 1
        `
        const user = rows[0] as
          | { id: string; email: string; password_hash: string | null; role: string }
          | undefined

        if (!user || !user.password_hash) return null

        const passwordMatches = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatches) return null

        return { id: user.id, email: user.email, role: user.role as "admin" | "sales_rep" }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Google sign-in: create the users row on first login if it doesn't exist yet.
      if (account?.provider === "google" && user.email) {
        const rows = await db.sql`
          select id, deleted_at from users where email = ${user.email} limit 1
        `
        const existing = rows[0] as { id: string; deleted_at: string | null } | undefined

        if (existing?.deleted_at) return false // deactivated/deleted accounts can't sign in

        if (!existing) {
          await db.sql`
            insert into users (email, role) values (${user.email}, 'sales_rep')
          `
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // On credentials login `user` already has id/role from authorize().
        // On Google login, look up the row we just ensured exists in signIn().
        if ("role" in user && user.role) {
          token.id = user.id
          token.role = user.role
        } else if (user.email) {
          const rows = await db.sql`
            select id, role from users where email = ${user.email} and deleted_at is null limit 1
          `
          const dbUser = rows[0] as { id: string; role: string } | undefined
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "sales_rep"
      }
      return session
    },
  },
}
