"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/providers/database"
import { requireRole, getCurrentUser } from "@/lib/providers/auth"
import { updateProfileSchema, type UpdateProfileInput } from "./schemas"

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }

export async function updateProfileAction(input: UpdateProfileInput): Promise<ActionResult> {
  const user = await requireRole("sales_rep", "admin")

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { fullName, phoneNumber, location, educationLevel, languages } = parsed.data

  const profileRows = await db.sql`
    select id from sales_profiles
    where user_id = ${user.id} and deleted_at is null
    limit 1
  `
  const profile = profileRows[0] as { id: string } | undefined
  if (!profile) return { ok: false, message: "Profile not found." }

  const profileId = profile.id

  await db.transaction((sql) => [
    sql`
      update sales_profiles
      set
        full_name = ${fullName},
        phone_number = ${phoneNumber},
        location = ${location},
        education_level = ${educationLevel ?? null},
        updated_at = now()
      where id = ${profileId}
    `,
    // Soft-delete all existing language rows, then re-insert the current list.
    sql`
      update sales_profile_languages
      set deleted_at = now()
      where sales_profile_id = ${profileId} and deleted_at is null
    `,
    ...languages.map(
      (language) => sql`
        insert into sales_profile_languages (sales_profile_id, language)
        values (${profileId}, ${language})
        on conflict (sales_profile_id, language)
        do update set deleted_at = null
      `
    ),
  ])

  revalidatePath("/dashboard")
  return { ok: true }
}

export async function toggleActiveAction(): Promise<ActionResult> {
  const user = await requireRole("sales_rep", "admin")

  const profileRows = await db.sql`
    select id, is_active from sales_profiles
    where user_id = ${user.id} and deleted_at is null
    limit 1
  `
  const profile = profileRows[0] as { id: string; is_active: boolean } | undefined
  if (!profile) return { ok: false, message: "Profile not found." }

  await db.sql`
    update sales_profiles
    set
      is_active = ${!profile.is_active},
      active_status_updated_at = now(),
      updated_at = now()
    where id = ${profile.id}
  `

  revalidatePath("/dashboard")
  return { ok: true }
}

export async function updateAvatarAction(avatarUrl: string | null): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: "Not authenticated." }

  await db.sql`
    update sales_profiles
    set avatar_url = ${avatarUrl}, updated_at = now()
    where user_id = ${user.id} and deleted_at is null
  `

  revalidatePath("/dashboard")
  return { ok: true }
}
