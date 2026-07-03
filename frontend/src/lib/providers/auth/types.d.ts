import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: "admin" | "sales_rep"
  }

  interface Session {
    user: {
      id: string
      role: "admin" | "sales_rep"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "admin" | "sales_rep"
  }
}
