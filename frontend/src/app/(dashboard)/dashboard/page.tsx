import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { getCurrentUser } from "@/lib/providers/auth"
import { getProfileByUserId } from "@/features/sales-profile"
import { ProfilePageClient } from "@/features/sales-profile/components/profile-page-client"

export const metadata: Metadata = {
  title: "My profile — Blue Ox Group",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const profile = await getProfileByUserId(user.id)
  if (!profile) redirect("/complete-profile")

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-[0.08em]" style={{ color: "var(--brand-blue)" }}>My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your details up to date so admins can reach you.
        </p>
      </div>
      <ProfilePageClient profile={profile} email={user.email ?? ""} />
    </div>
  )
}
