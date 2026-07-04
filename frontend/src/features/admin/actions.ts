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

  const rows = await db.sql`
    update sales_profiles
    set deleted_at = now(), updated_at = now()
    where id = ${profileId}
      and deleted_at is null
    returning user_id
  `

  const userId = (rows[0] as { user_id: string } | undefined)?.user_id
  if (userId) {
    await db.sql`
      update users
      set role = 'suspended', updated_at = now()
      where id = ${userId}
        and role != 'admin'
    `
  }

  revalidatePath("/admin")
  return { ok: true }
}

export async function reinstateRepAction(userId: string): Promise<ActionResult> {
  await requireRole("admin")

  await db.sql`
    update users
    set role = 'sales_rep', updated_at = now()
    where id = ${userId}
      and role = 'suspended'
  `

  await db.sql`
    update sales_profiles
    set deleted_at = null, updated_at = now()
    where user_id = ${userId}
      and deleted_at is not null
  `

  revalidatePath("/admin")
  return { ok: true }
}
