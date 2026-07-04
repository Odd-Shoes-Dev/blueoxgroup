"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/providers/database"
import { requireRole } from "@/lib/providers/auth"

export type ActionResult = { ok: true } | { ok: false; message: string }

export async function deactivateRepAction(profileId: string): Promise<ActionResult> {
  await requireRole("admin")

  await db.sql`
    update sales_profiles
    set
      is_active = false,
      active_status_updated_at = now(),
      updated_at = now()
    where id = ${profileId}
      and deleted_at is null
  `

  revalidatePath("/admin")
  return { ok: true }
}

export async function softDeleteRepAction(profileId: string): Promise<ActionResult> {
  await requireRole("admin")

  await db.sql`
    update sales_profiles
    set deleted_at = now(), updated_at = now()
    where id = ${profileId}
      and deleted_at is null
  `

  revalidatePath("/admin")
  return { ok: true }
}
