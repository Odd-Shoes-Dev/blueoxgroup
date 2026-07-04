import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { requireRole, getCurrentUser } from "@/lib/providers/auth"
import { listReps, listSuspendedReps } from "@/features/admin"
import { RepsDirectory } from "@/features/admin/components/reps-directory"
import { SuspendedUsers } from "@/features/admin/components/suspended-users"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Representatives — Blue Ox Group Admin",
}

export default async function AdminPage() {
  try {
    await requireRole("admin")
  } catch {
    redirect("/dashboard")
  }

  const [reps, suspendedReps, user] = await Promise.all([
    listReps(),
    listSuspendedReps(),
    getCurrentUser(),
  ])

  return (
    <div className="grid gap-16">
      <RepsDirectory reps={reps} currentUserId={user!.id} />

      {suspendedReps.length > 0 && (
        <>
          <Separator />
          <section className="grid gap-6">
            <div>
              <h2
                className="font-display text-2xl uppercase tracking-[0.08em]"
                style={{ color: "var(--brand-blue)" }}
              >
                Suspended users
              </h2>
              <p className="mt-1 font-utility text-xs text-muted-foreground">
                {suspendedReps.length} suspended — reinstate to restore access
              </p>
            </div>
            <SuspendedUsers reps={suspendedReps} />
          </section>
        </>
      )}
    </div>
  )
}
