import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { getCurrentUser } from "@/lib/providers/auth"
import { getProfileByUserId } from "@/features/sales-profile"
import { CompleteProfileForm } from "@/features/auth"

export const metadata: Metadata = {
  title: "Complete your profile — Blue Ox Group",
}

export default async function CompleteProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const profile = await getProfileByUserId(user.id)
  if (profile) redirect("/dashboard")

  return (
    <div className="grid gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Complete your profile</h1>
        <p className="text-sm text-muted-foreground">
          A few more details before you join the network.
        </p>
      </div>

      <CompleteProfileForm defaultName={user.name ?? ""} />
    </div>
  )
}
