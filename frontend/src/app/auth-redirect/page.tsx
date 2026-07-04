import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/providers/auth"

export default async function AuthRedirectPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (user.role === "admin") redirect("/admin")
  redirect("/dashboard")
}
