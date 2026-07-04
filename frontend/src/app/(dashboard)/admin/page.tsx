import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { requireRole } from "@/lib/providers/auth"
import { listReps } from "@/features/admin"
import { RepsDirectory } from "@/features/admin/components/reps-directory"

export const metadata: Metadata = {
  title: "Representatives — Blue Ox Group Admin",
}

export default async function AdminPage() {
  try {
    await requireRole("admin")
  } catch {
    redirect("/dashboard")
  }

  const reps = await listReps()

  return <RepsDirectory reps={reps} />
}
