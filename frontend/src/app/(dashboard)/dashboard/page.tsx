import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { getCurrentUser } from "@/lib/providers/auth"
import { getProfileByUserId, ProfileForm, ActiveToggle } from "@/features/sales-profile"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "My profile — Blue Ox Group",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const profile = await getProfileByUserId(user.id)
  if (!profile) redirect("/complete-profile")

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your details up to date so admins can reach you.
        </p>
      </div>

      <ActiveToggle isActive={profile.isActive} />

      <Separator />

      <section className="grid gap-6 sm:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-sm font-medium">Profile details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your contact information and background.
          </p>
        </div>
        <ProfileForm profile={profile} />
      </section>
    </div>
  )
}
